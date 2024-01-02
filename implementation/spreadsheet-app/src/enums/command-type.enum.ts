/**
 * The commands a user might invoke on a spreadsheet
 */
export enum CommandType {
  INSERTCOL = 'INSERTCOL',
  INSERTROW = 'INSERTROW',
  REMOVEROW = 'REMOVEROW',
  REMOVECOL = 'REMOVECOL',
  DELETESHEET = 'DELETESHEET',
  EDITTITLESHEET = 'EDITTITLESHEET',
  EXPORTSHEET = 'EXPORTSHEET',
}
