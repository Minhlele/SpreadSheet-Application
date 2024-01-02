import { ICell } from '../../interfaces/cell.interface';
import { IExpression } from '../../interfaces/expression.interface';
import { Parser } from 'hot-formula-parser';
import { ReferenceExpression } from './reference-expression';
import { RangeExpression } from './range-expression';
import { ErrorExpression } from './error-expression';

/**
 * A complex expression type, a function. Represented by =(OPERATIONS), where
 * operations may contain n amount of operands and n-1 amount of operators.
 * May reference other cell values.
 */
export class FunctionExpression implements IExpression {
  private func: string;
  private referenced: Array<ICell>;

  public constructor(func: string, referenced: Array<ICell>) {
    this.func = func;
    this.referenced = referenced;
  }

  public getSimplifiedExpression(): IExpression {
    const parser = new Parser();
    const ref_result = this.resolveRefs(this.func);
    let modifiedExpression = this.stripFunction(ref_result);

    // Define the CONCAT function
    parser.setFunction('CONCAT', (params: unknown) => {
      if (!Array.isArray(params)) {
        throw new Error('Expected an array');
      }
      if (!params.every((param) => typeof param === 'string')) {
        throw new Error('Expected all parameters to be strings');
      }
      return params.join('');
    });

    // Check if the expression is a concatenation of pure strings or strings in quotes, separated only by +
    if (
      /^\(((\s*"[^"]+"\s*)|\s*[a-zA-Z]+\s*)+(\+\s*((\s*"[^"]+"\s*)|\s*[a-zA-Z]+\s*)+)*\)$/.test(
        modifiedExpression
      )
    ) {
      modifiedExpression = this.removeParentheses(modifiedExpression);

      // Use the custom split function
      modifiedExpression = this.splitOutsideQuotes(modifiedExpression, '+')
        .map((s) => {
          s = s.trim();
          if (/^".*"$/.test(s)) {
            return s; // Return as is if already in quotes
          }
          return `"${s}"`; // Wrap in quotes otherwise
        })
        .join(',');
      modifiedExpression = `CONCAT(${modifiedExpression})`;
    }

    if (this.containsMixedTypes(modifiedExpression)) {
      return new ErrorExpression('#ERROR!');
    }

    try {
      const parsedResult = parser.parse(modifiedExpression);
      if (parsedResult.error !== null && parsedResult.error !== undefined) {
        return new ErrorExpression(parsedResult.error);
      }
      if (parsedResult.result === null) {
        return new ErrorExpression('#NULL');
      }
      return new FunctionExpression(
        parsedResult.result.toString(),
        this.referenced
      );
    } catch (e) {
      return new ErrorExpression('#UNKNOWN');
    }
  }

  public toString(): string {
    return this.func;
  }

  // ======= HELPERS =======
  /**
   * Helper function to help with the string wrapping in "" functionality
   * @param str
   * @param delimiter
   * @returns
   */
  private splitOutsideQuotes(str: string, delimiter: string): Array<string> {
    const result: Array<string> = [];
    let currentChunk = '';
    let inQuotes = false;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(currentChunk);
        currentChunk = '';
        continue;
      }
      currentChunk += char;
    }

    if (currentChunk) {
      result.push(currentChunk);
    }

    return result;
  }

  /**
   * stripFunction to remove the = sign from the function
   * @param func the user inputted function
   * @returns the function without the = sign
   */
  private stripFunction(func: string): string {
    if (func.charAt(0) === '=') {
      return func.substring(1, func.length);
    } else {
      return func;
    }
  }
  /**Helper function to remove the outermost parentheses
   * Fucntions
   * @param input the user inputted function
   * @returns the function without the outermost parentheses
   */
  private removeParentheses(input: string): string {
    // Check if the string starts and ends with parentheses
    if (input.startsWith('(') && input.endsWith(')')) {
      // Remove the outermost parentheses
      return input.substring(1, input.length - 1);
    }
    return input;
  }
  /**
   * Helper function to check if the expression contains mixed types
   * @param expression the user inputted function
   * @returns if the expression contains mixed types
   */
  private containsMixedTypes(expression: string): boolean {
    // Remove parentheses for the check
    const innerExpression = this.removeParentheses(expression);

    // Split by + and check each part
    const parts = innerExpression.split('+');
    let hasNumber = false;
    let hasString = false;

    for (let part of parts) {
      part = part.trim();
      if (/^\d+$/.test(part)) {
        // pure number
        hasNumber = true;
      } else if (/^".*"$/.test(part)) {
        // string in quotes
        hasString = true;
      }

      if (hasNumber && hasString) {
        return true; // Found a mix of numbers and strings
      }
    }
    return false; // No mix found
  }
  /**
   * Helper function to get the numeric value for a cell reference
   * @param cellReference the string representation of the cell reference
   * @returns the numeric value of the cell reference in string form
   */
  private getNumericValueForCellReference(cellReference: string): string {
    // Find the referenced cell from the array
    const referencedCell = this.referenced.find(
      (cell) => cell.getPosition().toString() === cellReference
    );

    // If the cell is found, create a ReferenceExpression and get its value
    if (referencedCell) {
      const refExpression = new ReferenceExpression(
        cellReference,
        referencedCell
      );
      return refExpression.getSimplifiedExpression().toString();
    }
    return ''; // Return empty string if the reference is not found
  }
  /**
   * Helper function to resolve the references in the function
   * @param inputString the user inputted function
   * @returns the function with the references resolved
   */
  private resolveRefs(inputString: string): string {
    const refPattern = /REF\(([^)]+)\)/g;
    const rangePattern = /(SUM|AVG)\((.*?)\.\.(.*?)\)/g;

    // Function to check if the match is within quotes
    const isInQuotes = (index: number, str: string) => {
      let quoteCount = 0;
      for (let i = 0; i < index; i++) {
        if (str[i] === '"') quoteCount++;
      }
      return quoteCount % 2 !== 0; // If odd, it's inside quotes
    };

    let modifiedString: string = inputString.replace(
      refPattern,
      (match, refKey, offset, string) => {
        if (isInQuotes(offset, string)) return match; // Skip replacement if inside quotes
        const numericValue = this.getNumericValueForCellReference(refKey);
        return numericValue === '' ? '0' : numericValue;
      }
    );

    modifiedString = modifiedString.replace(
      rangePattern,
      (match, rangeType, startCell, endCell, offset, string) => {
        if (isInQuotes(offset, string)) return match; // Skip replacement if inside quotes
        const rangeExprString = `${rangeType}(${startCell}..${endCell})`;
        const rangeExpr = new RangeExpression(
          rangeExprString,
          this.extractRangeReferences(this.referenced, rangeExprString)
        );
        return rangeExpr.getSimplifiedExpression().toString();
      }
    );

    return modifiedString;
  }

  /**
   * Helper function to extract the range references
   * @param references the array of referenced cells
   * @param formula the user inputted function
   * @returns the array of range references for the range expression
   */
  private extractRangeReferences(
    references: Array<ICell>,
    formula: string
  ): Array<ICell> {
    const rangeCells: Array<ICell> = [];
    const rangePattern = /(SUM|AVG)\((.*?)\.\.(.*?)\)/g;

    let rangeMatch;
    while ((rangeMatch = rangePattern.exec(formula)) !== null) {
      const startRef = rangeMatch[2];
      const endRef = rangeMatch[3];
      const cellRefsInRange = this.getCellRefsInRange(startRef, endRef);
      const cellsInRange = references.filter((cell) =>
        cellRefsInRange.includes(cell.getPosition().toString())
      );
      rangeCells.push(...cellsInRange);
    }

    return rangeCells;
  }

  /**
   * Helper function to get the cell references in a range
   * @param startCell the starting cell reference
   * @param endCell the ending cell reference
   * @returns the array of cell references in the range
   */
  private getCellRefsInRange(
    startCell: string,
    endCell: string
  ): Array<string> {
    const startColMatch = startCell.match(/[A-Z]+/);
    const startRowMatch = startCell.match(/\d+/);
    const endColMatch = endCell.match(/[A-Z]+/);
    const endRowMatch = endCell.match(/\d+/);

    if (!startColMatch || !startRowMatch || !endColMatch || !endRowMatch) {
      throw new Error('Invalid cell reference format.');
    }

    const startColIndex = startColMatch[0].charCodeAt(0);
    const startRowIndex = parseInt(startRowMatch[0]);
    const endColIndex = endColMatch[0].charCodeAt(0);
    const endRowIndex = parseInt(endRowMatch[0]);

    const cellRefs: string[] = [];
    for (let rowIndex = startRowIndex; rowIndex <= endRowIndex; rowIndex++) {
      for (let colIndex = startColIndex; colIndex <= endColIndex; colIndex++) {
        const colLetter = String.fromCharCode(colIndex);
        cellRefs.push(`${colLetter}${rowIndex}`);
      }
    }

    return cellRefs;
  }
  private computeRange(): string {
    return this.getSimplifiedExpression().toString();
  }
}
