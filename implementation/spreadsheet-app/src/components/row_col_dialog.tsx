import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { CommandType } from '../enums/command-type.enum';
import {
  COMMAND_TYPE_TO_STRING,
  MAX_COLUMNS,
  MAX_ROWS,
} from '../models/constants';

/**
 * This component displays the possible actions the user is allowed to take
 * when clicking either a row or a column header. It disables insert/delete options
 * if the user tries going out of the allotted range. It changes the actions
 * based on if a column or a row was selected.
 * @param props RowColDialogProps (see interface documentation for more details)
 * @returns RowColDialog
 */
export default function RowColDialog(props: RowColDialogProps) {
  const { open, column, onClose, numberOfRows, numberOfColumns } = props;

  // If a column header was clicked on, we only want to display the column actions
  const actions: Array<CommandType> = column
    ? [CommandType.INSERTCOL, CommandType.REMOVECOL]
    : [CommandType.INSERTROW, CommandType.REMOVEROW];

  // Handles if the user clicks outside of the dialog
  const handleClose = () => {
    onClose(null);
  };

  // Handles if the user clicks on a button in the dialog
  // Passes that action, which eventually is handled by the
  // spreadsheet model
  const handleListItemClick = (value: CommandType) => {
    onClose(value);
  };

  // Determines if the user is trying to add too many
  // rows or columns, or if the user is trying to delete all of them
  const shouldButtonBeDisabled = (action: CommandType) => {
    if (column) {
      if (action === CommandType.INSERTCOL) {
        return numberOfColumns >= MAX_COLUMNS;
      } else {
        return numberOfColumns < 2;
      }
    } else {
      if (action === CommandType.INSERTROW) {
        return numberOfRows >= MAX_ROWS;
      } else {
        return numberOfRows < 2;
      }
    }
  };

  return (
    <Dialog id="editRowColDialog" onClose={handleClose} open={open}>
      <DialogTitle> Select Action </DialogTitle>
      <List sx={{ pt: 0 }}>
        {actions.map((action: CommandType) => (
          <ListItem disableGutters key={action}>
            <ListItemButton
              disabled={shouldButtonBeDisabled(action)}
              id={`action: ${COMMAND_TYPE_TO_STRING.get(action)}`}
              onClick={() => handleListItemClick(action)}
            >
              <ListItemText primary={COMMAND_TYPE_TO_STRING.get(action)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

interface RowColDialogProps {
  // If the button to opent he dialog is pressed. If this is false, the dialog closes
  open: boolean;

  // True if column was clicked
  column: boolean;

  // The function that handles commands
  onClose: (command: CommandType | null) => void;

  // Number of rows and columns to check if the user is
  // violating the max and min row/col constraints
  numberOfRows: number;
  numberOfColumns: number;
}
