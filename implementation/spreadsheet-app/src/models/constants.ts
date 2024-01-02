import { CommandType } from '../enums/command-type.enum';

// Define the row and column size
export const MAX_ROWS = 150;
export const MAX_COLUMNS = 26;
export const DEFAULT_ROWS = 10;
export const DEFAULT_COLUMNS = 10;

export const ALPHABET_ARRAY: Array<string> = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

// List of errors that need to be formatted
export const ERROR_LIST: Array<string> = [
  '#DIV/0!',
  '#ERROR!',
  '#INVLREXPR!',
  '#VALUE!',
  '#NAME?',
];

export const COMMAND_TYPE_TO_STRING: Map<CommandType, string> = new Map([
  [CommandType.INSERTCOL, 'Insert Column'],
  [CommandType.INSERTROW, 'Insert Row'],
  [CommandType.REMOVECOL, 'Remove Column'],
  [CommandType.REMOVEROW, 'Remove Row'],
]);
