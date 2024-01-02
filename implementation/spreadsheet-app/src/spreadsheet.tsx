import React, { useState } from 'react';
import './spreadsheet.css';
import SheetGrid from './components/sheet_grid';
import SheetSelector from './components/sheet_selector';
import { ISpreadSheet } from './interfaces/spreadsheet.interface';
import { Card } from '@mui/material';

/**
 * This component handles all display and user interaction with the spreadsheet
 * @param props SpreadSheetProps (see interface documentation for more details)
 * @returns Spreadsheet
 */
export default function Spreadsheet(props: SpreadSheetProps) {
  const { spreadsheet } = props;

  // States that are different attributes of the spreadsheet, so
  // the appropriate components are re-rendered when they are changed
  const [currentSheetId, setCurrentSheetId] = useState(0);
  const [sheets, setSheets] = useState(spreadsheet.getSheets());
  const [currentSheet, setCurrentSheet] = useState(sheets[currentSheetId]);
  const [exportBlob, setExportBlob] = useState(new Blob());

  // Handles sheet selection
  const onSelection = (index: number) => {
    setCurrentSheetId(index);
    setCurrentSheet(sheets[index]);
  };

  // Creates a new sheet that is then displayed
  const onAddition = () => {
    spreadsheet.createSheet();
    setSheets(spreadsheet.getSheets());
    const new_index = spreadsheet.getSheets().length - 1;
    setCurrentSheetId(new_index);
    setCurrentSheet(spreadsheet.getSheets()[new_index]);
  };

  // Changes the title of a sheet
  const onTitleChange = (title: string, sheetId: number) => {
    sheets[sheetId].setTitle(title);
  };

  // Deletes a sheet.
  // If the current selected sheet is deleted, display the first sheet
  const onDeletion = (id: number) => {
    if (id === currentSheetId) {
      spreadsheet.deleteSheet(id);
      setSheets(spreadsheet.getSheets());
      setCurrentSheetId(0);
      setCurrentSheet(spreadsheet.getSheets()[0]);
    } else {
      spreadsheet.deleteSheet(id);
      setSheets(spreadsheet.getSheets());
      setCurrentSheet(
        spreadsheet.getSheets()[currentSheetId === 0 ? 0 : currentSheetId - 1]
      );
      setCurrentSheetId((prev) => (prev === 0 ? 0 : prev - 1));
    }
  };

  // Handles exporting sheets by creating a new Blob object
  // that is later transformed into a URL string that can be downloaded
  const onExport = (id: number) => {
    setExportBlob(spreadsheet.exportSheet(id));
  };

  return (
    <div className="Spreadsheet">
      <Card
        sx={{
          display: 'flex',
          position: 'absolute',
          left: '50%',
          transform: 'translate(-50%, 0)',
        }}
      >
        <SheetSelector
          sheets={sheets}
          sheetId={currentSheetId}
          onSelection={onSelection}
          onAddition={onAddition}
          onDeletion={onDeletion}
          onTitleChange={onTitleChange}
          onExport={onExport}
          exportBlob={exportBlob}
        />
        <SheetGrid sheet={currentSheet} sheetIndex={currentSheetId} />
      </Card>
    </div>
  );
}

interface SpreadSheetProps {
  // A ISpreadSheet to manipulate
  spreadsheet: ISpreadSheet;
}
