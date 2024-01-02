import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { ChangeEventHandler, useState } from 'react';

/**
 * This component displays a text field to allow the user to enter a new title for the sheet
 * @param props EditSheetTitleDialogProps (more details are in the interface documentation)
 * @returns EditSheetTitleDialog
 */
export default function EditSheetTitleDialog(props: EditSheetTitleDialogProps) {
  const { openChangeTitleDialog, selectedSheetTitle, handleTitleChange } =
    props;

  const [newTitle, setNewTitle] = useState('');

  // Handles if the user clicks off the dialog or presses cancel
  const handleCancel = () => {
    handleTitleChange(null);
  };

  // Handles if the user presses the save button
  const handleSave = () => {
    // Do not allow for empty titles
    if (newTitle === '') {
      handleTitleChange(null);
    } else {
      handleTitleChange(newTitle);
    }
  };

  // Stores the users input
  const handleTextInput: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    setNewTitle(event.target.value);
  };

  return (
    <Dialog
      id="editSheetTitleDialog"
      onClose={handleCancel}
      open={openChangeTitleDialog}
    >
      <DialogTitle>Change Title</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the new title for the sheet. The new title cannot be blank.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="newTitle"
          label="New Title"
          fullWidth
          variant="standard"
          onChange={handleTextInput}
          defaultValue={selectedSheetTitle}
        />
      </DialogContent>
      <DialogActions>
        <Button id="sheetTitleCancelButton" onClick={handleCancel}>
          Cancel
        </Button>
        <Button id="sheetTitleSaveButton" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface EditSheetTitleDialogProps {
  // If true the dialog is open, otherwise it is closed
  openChangeTitleDialog: boolean;

  // Passing the selected sheet title for display purposes
  selectedSheetTitle: string;

  // Function to handle title change
  handleTitleChange: (title: string | null) => void;
}
