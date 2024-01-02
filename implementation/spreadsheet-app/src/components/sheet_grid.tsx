import * as React from 'react';
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  useGridApiRef,
  GridColumnHeaderParams,
  GridCellParams,
} from '@mui/x-data-grid';
import { Box, ButtonGroup, TextField, Button, IconButton } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { Position } from '../models/cellposition';
import { CommandType } from '../enums/command-type.enum';
import RowColDialog from './row_col_dialog';
import { ICell } from '../interfaces/cell.interface';
import clsx from 'clsx';
import { ISheet } from '../interfaces/sheet.interface';
import { ALPHABET_ARRAY, ERROR_LIST } from '../models/constants';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';

/**
 * The component serves to represent all the information of a single ISheet.
 * It enables display and editing capabilities.
 * @param props SheetGridProps which requires an ISheet and an index number for the sheet
 * @returns The SheetGrid
 */
export default function SheetGrid(props: SheetGridProps) {
  const { sheet, sheetIndex } = props;

  const numOfRows: number = sheet.getCellGrid().length;
  const numOfCols: number = sheet.getCellGrid()[0].length;
  const apiRef = useGridApiRef();

  // States that help define UI changes based on button clicks
  // and allow for the components to be re-rendered

  // State that represents all the cells for the sheet
  const [grid, setGrid] = useState(sheet.getCellGrid());

  // State that represents the row/col that is clicked
  const [selectedRowId, setSelectedRowId] = useState(-1);
  const [selectedColId, setSelectedColId] = useState(-1);

  // State that represents whether an edit event has occured
  const [hasCellBeenEdited, setHasCellBeenEdited] = useState(false);

  // State to represent the true value of the cell which is
  // displayed in the display/formula bar above the grid
  const [currentTrueCellValue, setCurrentTrueCellValue] = useState('');

  // States to handle button interactions
  const [savePressed, setSavePressed] = useState(false);
  const [clearPressed, setClearPressed] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [bold, setBold] = useState(false);
  const [italics, setItalics] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // If the user has switched sheets we need to re-render the grid.
  if (currentIndex !== sheetIndex) {
    setGrid(sheet.getCellGrid());
    setCurrentIndex(sheetIndex);
    setSelectedColId(-1);
    setSelectedRowId(-1);
    setCurrentTrueCellValue('');
  }

  // This function will take the column number and return an alphabetical letter associated with it
  // Ex: 0 -> A,  3 -> D
  const createColHeaderFromNum = (num: number): string => {
    return ALPHABET_ARRAY[num];
  };

  // This function returns a number indicating the position of the letter in the alphabet
  const createNumFromColHeader = (colHead: string): number => {
    return ALPHABET_ARRAY.findIndex(
      (letter) => letter === colHead.substring(0, 1)
    );
  };

  // This is triggered when a cell has been double clicked,
  // and then the user moves away from the cell
  const handleCellStop: GridEventListener<'cellEditStop'> = () => {
    setHasCellBeenEdited(true);
  };

  // This is triggered when a cell is clicked on once.
  // We need to update the true value display at the top of the grid
  // to have the contents of the clicked cell.
  const handleCellClick: GridEventListener<'cellClick'> = (
    params: GridCellParams
  ) => {
    const { id, field } = params;
    setSelectedRowId(Number(id) - 1);

    // If the Row header is clicked then we want to open up the dialog for row actions
    if (field === 'id') {
      setSelectedColId(-1);
      setCurrentTrueCellValue('');
      handleDialogOpen();
    } else {
      setSelectedColId(createNumFromColHeader(field));
      setCurrentTrueCellValue(
        sheet
          .getCellGrid()[Number(id) - 1][createNumFromColHeader(field)].getValue()
          .toString()
      );
    }
  };

  // This is triggered when a column header is clicked on. It should
  // open the dialog to allow for column remove and column delete actions.
  const handleColHeaderClick: GridEventListener<'columnHeaderClick'> = (
    params: GridColumnHeaderParams
  ) => {
    const { field } = params;
    if (field !== 'id') {
      setSelectedRowId(-1);
      setSelectedColId(createNumFromColHeader(field));
      setCurrentTrueCellValue('');
      setOpenDialog(true);
    }
  };

  // Opens up the Row/Col dialog to allow the user to select actions.
  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  // Closes the Row/Col dialog and modifies the sheet according
  // to the action selected.
  const handleDialogClose = (action: CommandType | null) => {
    setOpenDialog(false);
    switch (action) {
      case CommandType.INSERTCOL:
        sheet.insert(false, selectedColId);
        break;
      case CommandType.INSERTROW:
        sheet.insert(true, selectedRowId);
        break;
      case CommandType.REMOVECOL:
        sheet.delete(false, selectedColId);
        break;
      case CommandType.REMOVEROW:
        sheet.delete(true, selectedRowId);
        break;
      default:
    }
    setGrid(sheet.getCellGrid());
  };

  // This function handles changes to the true value display for the cell grid.
  const handleTextFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setGrid(sheet.getCellGrid());
    setCurrentTrueCellValue(event.target.value);
  };

  // This function handles when tab or enter are used to click out of
  // a cell. It updates the true value display to match the contents
  // of the new selected cell.
  const changeSelectedCellInfo = () => {
    const { cell } = apiRef.current.state.tabIndex;
    if (cell !== null) {
      setSelectedRowId(Number(cell.id) - 1);
      if (cell.field !== 'id') {
        setSelectedColId(createNumFromColHeader(cell.field));
        setCurrentTrueCellValue(
          sheet
            .getCellGrid()[Number(cell.id) - 1][createNumFromColHeader(cell.field)].getValue()
            .toString()
        );
      } else {
        setSelectedColId(-1);
        setCurrentTrueCellValue('');
      }
    }
  };

  // Triggered when a cell is edited
  useEffect(() => {
    // There row and column id need to be valid
    if (selectedRowId + 1 > 0 && selectedColId >= 0) {
      const value: string = apiRef.current.getCellValue(
        String(selectedRowId + 1),
        createColHeaderFromNum(selectedColId)
      );

      // Handles value edits to the cell
      if (
        hasCellBeenEdited &&
        sheet.getCellGrid()[selectedRowId][selectedColId].getDisplay() !== value
      ) {
        // The try-catch is to prevent the front-end from crashing because of an unhandled error.
        // There should be NO unhandled errors, but this is just a precaution.
        try {
          sheet.setCellValue(
            new Position(Number(selectedRowId), Number(selectedColId)),
            value
          );
        } catch (e) {
          sheet.setCellValue(
            new Position(Number(selectedRowId), Number(selectedColId)),
            (e as Error).message
          );
        }
      }
      // Handles cell formatting
      if (bold) {
        sheet
          .getCell(selectedRowId, selectedColId)
          .setIsBolded(
            !sheet.getCell(selectedRowId, selectedColId).getIsBolded()
          );
        setBold(false);
      }
      if (italics) {
        sheet
          .getCell(selectedRowId, selectedColId)
          .setIsItalicized(
            !sheet.getCell(selectedRowId, selectedColId).getIsItalicized()
          );
        setItalics(false);
      }
      if (underline) {
        sheet
          .getCell(selectedRowId, selectedColId)
          .setIsUnderlined(
            !sheet.getCell(selectedRowId, selectedColId).getIsUnderlined()
          );
        setUnderline(false);
      }

      setGrid(sheet.getCellGrid());
      setHasCellBeenEdited(false);

      // Updates the display to handle the new selected cell value
      changeSelectedCellInfo();
    }
  }, [hasCellBeenEdited, bold, italics, underline]);

  // Triggered when the save button is pressed
  useEffect(() => {
    // If the row and columns are valid we try to set the value of cell.
    if (savePressed && selectedRowId >= 0 && selectedColId >= 0) {
      try {
        sheet.setCellValue(
          new Position(Number(selectedRowId), Number(selectedColId)),
          currentTrueCellValue
        );
      } catch (e) {
        sheet.setCellValue(
          new Position(Number(selectedRowId), Number(selectedColId)),
          (e as Error).message
        );
      }
      setGrid(sheet.getCellGrid());
      setSavePressed(false);
    }
  }, [savePressed]);

  // Triggered when the clear button is pressed
  // Clears the cell value and the true display values.
  useEffect(() => {
    if (clearPressed && selectedRowId >= 0 && selectedColId >= 0) {
      sheet
        .getCellGrid()[Number(selectedRowId)][Number(selectedColId)].clearCell();
      setCurrentTrueCellValue('');
      setGrid(sheet.getCellGrid());
      setClearPressed(false);
    }
  }, [clearPressed]);

  // Creating the columns from the Sheet's cellGrid
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: '',
      headerAlign: 'center',
      align: 'center',
      width: 90,
      editable: false,
      sortable: false,
      headerClassName: 'col-header',
      cellClassName: 'border-cell',
    },
  ];
  for (let i = 0; i < numOfCols; i++) {
    columns.push({
      field: createColHeaderFromNum(i),
      headerName: createColHeaderFromNum(i),
      width: 90,
      editable: true,
      sortable: false,
      headerClassName: 'col-header',
      headerAlign: 'center',
      // Creating a custom class name based on the formatting to apply CSS styles to
      cellClassName: (params: GridCellParams<ICell>) => {
        const cell: ICell = sheet.getCell(
          Number(params.id) - 1,
          createNumFromColHeader(params.field)
        );
        const createCSSClassName: Array<string> = [];
        // If the cell is being removed, we do not want to format it. So we only format cells with valid positions.
        if (
          cell.getPosition().getRowId() < sheet.getCellGrid().length &&
          cell.getPosition().getColumnId() < sheet.getCellGrid()[0].length
        ) {
          if (ERROR_LIST.includes(cell.getDisplay())) {
            createCSSClassName.push('error');
          } else {
            if (cell.getIsBolded()) {
              createCSSClassName.push('bolded');
            }
            if (cell.getIsItalicized()) {
              createCSSClassName.push('italicized');
            }
            if (cell.getIsUnderlined()) {
              createCSSClassName.push('underlined');
            }
          }
        }
        const combinedClassName: string = createCSSClassName.join(' ');

        return clsx('cell-formatting', combinedClassName);
      },
    });
  }

  // Creating the rows from the Sheet's cellGrid
  const rows: { [index: string]: unknown }[] = [];
  for (let row = 1; row < numOfRows + 1; row++) {
    // Creating a new object
    const rowObject: { [index: string]: unknown } = { id: String(row) };
    for (let col = 0; col < numOfCols; col++) {
      const colID: string = createColHeaderFromNum(col);
      try {
        rowObject[colID] = grid[row - 1][col].getDisplay();
      } catch (e) {
        rowObject[colID] = 'Loading';
      }
    }
    rows.push(rowObject);
  }

  return (
    <div style={{ width: 800, height: '100%' }}>
      <div style={{}}>
        <Box>
          <div style={{ display: 'flex' }}>
            <div style={{ width: 100 }}>
              <TextField
                id="cell_row_col_id"
                value={
                  createColHeaderFromNum(selectedColId)
                    ? createColHeaderFromNum(selectedColId) +
                      String(selectedRowId + 1)
                    : ''
                }
                disabled={true}
                inputProps={{ style: { textAlign: 'center' } }}
              />
            </div>
            <TextField
              fullWidth
              id="cell_true_display"
              value={currentTrueCellValue}
              variant="outlined"
              disabled={false}
              onChange={handleTextFieldChange}
            />
            <ButtonGroup orientation="vertical" id="save clear button group">
              {[
                <Button
                  key="save"
                  id="saveButton"
                  onClick={() => {
                    setSavePressed(true);
                  }}
                  sx={{
                    fontSize: 12,
                  }}
                >
                  Save
                </Button>,
                <Button
                  key="clear"
                  id="clearButton"
                  onClick={() => {
                    setClearPressed(true);
                  }}
                  sx={{
                    fontSize: 12,
                  }}
                >
                  Clear
                </Button>,
              ]}
            </ButtonGroup>
            <ButtonGroup orientation="horizontal" id="format button group">
              {[
                <IconButton
                  key="bold"
                  id="boldButton"
                  onClick={() => {
                    setBold(true);
                  }}
                >
                  <FormatBoldIcon />
                </IconButton>,
                <IconButton
                  key="italics"
                  id="italicsButton"
                  onClick={() => {
                    setItalics(true);
                  }}
                >
                  <FormatItalicIcon />
                </IconButton>,
                <IconButton
                  key="underline"
                  id="underlineButton"
                  onClick={() => {
                    setUnderline(true);
                  }}
                >
                  <FormatUnderlinedIcon />
                </IconButton>,
              ]}
            </ButtonGroup>
          </div>
        </Box>
      </div>
      <div style={{ height: 500, overflowX: 'hidden', overflowY: 'scroll' }}>
        <Box
          sx={{
            '& .cell-formatting.error': {
              backgroundColor: 'darksalmon',
            },
            '& .cell-formatting.bolded': {
              fontWeight: '600',
            },
            '& .cell-formatting.italicized': {
              fontStyle: 'italic',
            },
            '& .cell-formatting.underlined': {
              textDecorationLine: 'underline',
            },
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            hideFooter={true}
            showCellVerticalBorder={true}
            showColumnVerticalBorder={true}
            disableRowSelectionOnClick={true}
            onCellEditStop={handleCellStop}
            onCellClick={handleCellClick}
            onColumnHeaderClick={handleColHeaderClick}
            disableColumnFilter={true}
            disableColumnMenu={true}
            disableColumnSelector={true}
            apiRef={apiRef}
            sx={{ '& .MuiDataGrid-row:hover': { backgroundColor: 'inherit' } }}
          />
        </Box>
      </div>
      <RowColDialog
        open={openDialog}
        column={selectedColId !== -1}
        onClose={handleDialogClose}
        numberOfColumns={grid[0].length}
        numberOfRows={grid.length}
      />
    </div>
  );
}

interface SheetGridProps {
  sheet: ISheet;
  sheetIndex: number;
}
