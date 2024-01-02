import * as React from 'react';
import Box from '@mui/material/Box';
import {
  Card,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import { ISheet } from '../interfaces/sheet.interface';
import { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SheetDialog from './sheet_dialog';
import { CommandType } from '../enums/command-type.enum';
import EditSheetTitleDialog from './edit_sheet_title_dialog';

/**
 * This component displays all the sheets that are within the spreadsheet.
 * It allows the user to select between the sheets and allow them to perform
 * actions on them.
 * @param props SheetSelectorProps (see interface for more documentation)
 * @returns SheetSelector
 */
export default function SheetSelector(props: SheetSelectorProps) {
  const {
    sheets,
    sheetId,
    onSelection,
    onAddition,
    onDeletion,
    onTitleChange,
    onExport,
    exportBlob,
  } = props;

  // The index and title of the current sheet that is being displayed
  const [selectedSheetIndexForSetting, setSelectedSheetIndexForSetting] =
    useState(0);
  const [selectedSheetTitleForSetting, setSelectedSheetTitleForSetting] =
    useState('');

  // States that handle opening and closing the action dialogs
  const [openSheetDialog, setOpenSheetDialog] = useState(false);
  const [openChangeTitleDialog, setOpenChangeTitleDialog] = useState(false);

  // Handles the user clicking on a different sheet
  const handleSheetChange = (index: number) => {
    onSelection(index);
  };

  // Handles the user adding a sheet
  const handleSheetAddition = () => {
    onAddition();
  };

  // Handles closing the sheet dialog
  const handleSheetDialogClose = (value: CommandType | null) => {
    setOpenSheetDialog(false);

    // Based on the command that was chosen in the dialog,
    // a different function is called which will eventually
    // be passed to the spreadsheet model to evaluate
    if (value === CommandType.DELETESHEET) {
      onDeletion(selectedSheetIndexForSetting);
    }
    // We need more information from the user, so we open another dialog
    else if (value === CommandType.EDITTITLESHEET) {
      setOpenChangeTitleDialog(true);
    } else if (value === CommandType.EXPORTSHEET) {
      onExport(selectedSheetIndexForSetting);
    }
  };

  // Handles title change
  const handleTitleChange = (newTitle: string | null) => {
    setOpenChangeTitleDialog(false);
    if (newTitle !== null) {
      onTitleChange(newTitle, selectedSheetIndexForSetting);
    }
  };

  return (
    <Card>
      <Typography sx={{ textAlign: 'center' }}>
        {' '}
        {`Current Sheet: ${sheets[sheetId].getTitle()}`}{' '}
      </Typography>
      <Box
        id="sheetSelectorSheetList"
        sx={{
          width: 150,
          height: 530,
          bgcolor: 'background.paper',
          overflowY: 'scroll',
          overflowX: 'hidden',
        }}
      >
        <List
          sx={{ pt: 0, '& .MuiList :hover': { backgroundColor: 'inherit' } }}
        >
          {sheets.map((sheet: ISheet, index: number) => (
            <Box
              key={`${index} box`}
              sx={{
                display: 'flex',
                border: 1,
                borderColor: 'grey.500',
                borderRadius: '16px',
              }}
            >
              <ListItem
                disableGutters
                key={index}
                sx={{ '& .MuiListItem :hover': { backgroundColor: 'inherit' } }}
              >
                <ListItemButton
                  id={`selectSheet${index}Button`}
                  onClick={() => handleSheetChange(index)}
                  sx={{
                    width: 100,
                    borderRadius: '16px',
                    '& .MuiButtonBase-root :hover': {
                      backgroundColor: 'inherit',
                    },
                  }}
                >
                  <ListItemText
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: 100,
                      textAlign: 'center',
                    }}
                    primary={sheet.getTitle()}
                  />
                </ListItemButton>
              </ListItem>
              <IconButton
                id={`selectSheet${index}SettingsButton`}
                key={`${index} settings`}
                onClick={() => {
                  setOpenSheetDialog(true);
                  setSelectedSheetIndexForSetting(index);
                  setSelectedSheetTitleForSetting(sheets[index].getTitle());
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
          ))}
        </List>
      </Box>
      <Button
        id="addSheetButton"
        sx={{ textAlign: 'center' }}
        onClick={() => handleSheetAddition()}
      >
        Add Sheet
      </Button>
      <SheetDialog
        openSheetDialog={openSheetDialog}
        selectedSheetTitle={selectedSheetTitleForSetting}
        onClose={handleSheetDialogClose}
        numberOfSheets={sheets.length}
        exportBlob={exportBlob}
      />
      <EditSheetTitleDialog
        openChangeTitleDialog={openChangeTitleDialog}
        selectedSheetTitle={selectedSheetTitleForSetting}
        handleTitleChange={handleTitleChange}
      />
    </Card>
  );
}

interface SheetSelectorProps {
  // The list of sheets that exist
  sheets: Array<ISheet>;

  // The index of the current sheet selected
  sheetId: number;

  // Function that handles sheet selection
  onSelection: (index: number) => void;

  // Function that handles sheet addition
  onAddition: () => void;

  // Function that handles sheet deletion
  onDeletion: (index: number) => void;

  // Function that handles title change
  onTitleChange: (newTitle: string, index: number) => void;

  // Function that handles sheet export
  onExport: (index: number) => void;

  // Blob that contains the csv information. It is only generated
  // when the export sheet button is clicked in the sheet dialog
  exportBlob: Blob;
}
