# Spreadsheet Application

Welcome to our Spreadsheet Application, a project developed as part of our coursework for CS4530. This application, built using TypeScript and React, provides a user-friendly platform for managing and analyzing data in a spreadsheet format. It is designed to demonstrate our learning and application of programming concepts in a practical, real-world tool.

## Must-Have Features

Our Spreadsheet Application includes:

- **Versatile Cell Content**: Cells can contain numeric and string constants, cell references, range expressions, and complex formulas.
- **Formulas**: Arithmetic operations with correct precedence and parentheses handling.
- **String Concatenation**: Seamlessly join strings.
- **Cell Reference and Ranges**: Reference individual cells by calling REF() and calculate SUM and AVERAGE over cell ranges.
- **Error Detection**: Robust error checking and handling for reliable data entry.
- **Spreadsheet Management**: Insert and delete rows and columns, clear cells
- **Interactive Web Interface**: Developed using React, providing real-time data manipulation and display.

## Additional Features

- **Multi-Sheet Management**: Handle multiple sheets within a single spreadsheet. Enables deletions, additions, and name changes for sheets.
- **CSV Export**: Export sheets to CSV format. Export button can be found after clicking the settings icon that is to the right of the sheet button.
- **Font Formatting**: Format the cell to be bold, italic, or underlined.

## Usage

### Entering Formulas, Ranges, and References

To perform computations or reference other cells, start the user input with an equal sign `"="`. This indicates that the cell will process a formula, range expression, or cell reference.

- **Functions**: Use to perform arithmetic operations. After `"="`, use parentheses `()` to wrap your computation. For example, `=((1+1)*2)`.
- **Range Expressions**: Use expressions like `SUM` or `AVG` followed by a cell range. For example, `=SUM(A1..C3)`.
- **Cell References**: To reference another cell, use `REF` followed by the cell's coordinates. For example, `=REF(B2)`.

To use the spreadsheet application, you need to create a `Sheet` object and use its methods to manipulate cells.

Here's a basic example to illustrate these concepts:

```typescript
let sheet = new Sheet();

sheet.setCellValue(new Position(0, 0), "2"); // Sets a simple number
sheet.setCellValue(new Position(0, 1), "Hello"); // Sets a string
sheet.setCellValue(new Position(1, 0), "=((1+1)*2)"); // Function: Basic arithmetic
sheet.setCellValue(new Position(2, 0), "=SUM(A1..A2)"); // Range: Sum of cells from A1 to A2
sheet.setCellValue(new Position(3, 0), "=REF(B1)"); // Reference: Refers to cell B1
```

## Note

- The export functionality will only work on browsers with HTML5
- Cell selection using arrow keys are not supported
- The save button only works for value enter from the formula bar
- Direct cell edits can be save by pressing Enter

## Installation

This project requires Node.js and npm. Ensure they are installed on your system before proceeding.

Clone the repository:

`git clone git@github.com:neu-cs4530-fall2023/team509-project.git`

Navigate to the project directory and install the dependencies. The root of the project is the spreadsheet-app folder

`cd spreadsheet-app`

`npm install`

## Available Scripts

- **Start the App**: `npm start` - Launches the app in development mode.
- **Run Tests**: `npm test` - Executes tests interactively.
- **Build for Production**: `npm run build` - Prepares the app for deployment.
- **Eject Configuration**: `npm run eject` - Customizes configuration.
- **Open Cypress Interface**: `npm run cy:open` - Opens up Cypress Interface to visualize E2E tests.
- **Run E2E tests**: `npm run cy:run` - Run E2E tests in headless mode.

## Contributing

We welcome contributions to improve this project. Please follow our contribution guidelines when submitting pull requests.

## Acknowledgments

Our gratitude goes to everyone who has contributed to and supported this project.

