import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { CommandType } from '../enums/command-type.enum';

/**
 * Dialog that shows the actions that can be done on the sheet
 * (Delete, Rename, Export)
 * @param props SheetDialogProps (see interface for more documentation)
 * @returns SheetDialog
 */
export default function SheetDialog(props: SheetDialogProps) {
  const {
    openSheetDialog,
    selectedSheetTitle,
    onClose,
    numberOfSheets,
    exportBlob,
  } = props;

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

  // The delete button is disabled if there are less than 2 sheets

  // The export button is wrapped around an HTML5 anchor element. The exportBlob
  // that contains all the CSV information is turned into a URL object string
  // which can be downloaded client-side by the browser.
  return (
    <Dialog id="sheetDialog" onClose={handleClose} open={openSheetDialog}>
      <DialogTitle> Select Action </DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItem disableGutters key={'delete'}>
          <ListItemButton
            disabled={numberOfSheets < 2}
            id="deleteSheetButton"
            onClick={() => handleListItemClick(CommandType.DELETESHEET)}
          >
            <ListItemText primary={`Delete Sheet: ${selectedSheetTitle}`} />
          </ListItemButton>
        </ListItem>
        <ListItem disableGutters key={'changeTitle'}>
          <ListItemButton
            id="changeSheetTitleButton"
            onClick={() => handleListItemClick(CommandType.EDITTITLESHEET)}
          >
            <ListItemText primary={"Change Sheet's Title"} />
          </ListItemButton>
        </ListItem>
        <ListItem disableGutters key={'export'}>
          <a
            href={URL.createObjectURL(exportBlob)}
            download={selectedSheetTitle}
            style={{ color: 'black', textDecoration: 'none' }}
          >
            <ListItemButton
              id="exportSheetButton"
              onClick={() => {
                handleListItemClick(CommandType.EXPORTSHEET);
              }}
            >
              <ListItemText primary={'Export Sheet'} />
            </ListItemButton>
          </a>
        </ListItem>
      </List>
    </Dialog>
  );
}

interface SheetDialogProps {
  // If true, the dialog is open
  openSheetDialog: boolean;

  // The title of the selected sheet for display purposes
  selectedSheetTitle: string;

  // Function to handle onClose values
  onClose: (command: CommandType | null) => void;

  // Number of sheets in the spreadsheet to determine if the delete button needs to be deleted
  numberOfSheets: number;

  // Blob that contains the csv information. It is only generated when the export sheet button is clicked
  exportBlob: Blob;
}
