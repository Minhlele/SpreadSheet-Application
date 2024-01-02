/// <reference types="cypress" />

// Some component ids to make things easy, put them in cy.get() to get them
/**
 * Formula/True value display bar: '[id="cell_true_display"]'
 * Save Button: '[id="saveButton"]'
 * Clear Button: '[id="clearButton"]'
 * Bold Button: '[id="boldButton"]'
 * Italics Button: '[id="italicsButton"]'
 * Underline Button: '[id="underlineButton"]'
 * Add Sheet Button: '[id="addSheetButton"]'
 *
 *
 * Note: Sheet Selector Buttons are dynamic, you have to put in the index of the sheet
 * Select Sheet: '[id="selectSheet{index}Button"]'
 * Select Sheet Settings: '[id="selectSheet{index}SettingsButton"]'
 *
 * Note: Dialog ids will only return the elements if the dialog is open
 *
 * Edit Sheet Title Dialog Ids:
 *  Dialog: '[id="editSheetTitleDialog"]'
 *  Save Button: '[id="sheetTitleSaveButton"]'
 *  Cancel Button: '[id="sheetTitleCancelButton"]'
 *  Text Field: '[id="newTitle"]'
 *
 * Edit Row/Col Dialog Ids:
 *  Dialog: '[id="editRowColDialog"]
 *  Insert Row Button: '[id="action Insert Row"]'
 *  Insert Col Button: '[id="action Insert Column"]'
 *  Remove Row Button: '[id="action Remove Row"]'
 *  Remove Col Button: '[id="action Remove Column"]
 *
 * Sheet Dialog Ids:
 *  Dialog: '[id="sheetDialog"]'
 *  Delete Sheet Button: '[id="deleteSheetButton"]'
 *  Change Title Button: '[id="changeSheetTitleButton"]'
 *  Export Sheet Button: '[id="exportSheetButton"]'
 */

describe('Spreadsheet Application', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('the default sheet exists', () => {
    cy.contains('Current Sheet: 0');
  });

  // Makes sure editing cells and saving by pressing enter works
  it('Selects cell A1 and inputs a value into it', () => {
    // cy.get searches the entire DOM tree for an element with the class or attribute,
    // which we don't want because we have duplicate names
    // So we use .within which limits the scope of the search into just that element.
    cy.get('.Spreadsheet')
      .get('[data-rowindex="0"]')
      .within(() => {
        cy.get('[data-field="A"]')
          .click({ multiple: false })
          .type('This is a test')
          .type('{enter}'); // {enter} mimics presses the enter key
        cy.get('[data-field="A"]').within(() => {
          cy.get('.MuiDataGrid-cellContent').should(
            'have.attr',
            'title',
            'This is a test'
          ); // Checking if the value was actually changed
        });
      });
  });

  it('Test display value save works', () => {
    // Clicking cell B2
    cy.get('.Spreadsheet')
      .get('[data-rowindex="1"]')
      .within(() => {
        cy.get('[data-field="B"]').click({ multiple: false });
      });

    // Typing in "testing123" into the true value display
    cy.get('.Spreadsheet')
      .get('[id="cell_true_display"]')
      .click()
      .type('testing123');

    // Clicking the save button
    cy.get('[id="saveButton"]').click();

    // Checking to make sure cell B2 was updated
    cy.get('.Spreadsheet')
      .get('[data-rowindex="1"]')
      .within(() => {
        cy.get('[data-field="B"]').within(() => {
          // Checking if the value was actually changed
          // The cells store the acutal value in the 'title' attribute so we have to check that
          cy.get('.MuiDataGrid-cellContent').should(
            'have.attr',
            'title',
            'testing123'
          );
        });
      });
  });

  it('Changing the title of the first sheet', () => {
    // Click the settings icon of the first sheet in SheetSelector to open SheetDialog
    cy.get('[id="selectSheet0SettingsButton"]').click();

    // Click the change sheet title button of the SheetDialog
    cy.get('[id="changeSheetTitleButton"]').click();

    // Clearing the default title and typing the new title into the text field
    cy.get('[id="newTitle"]').click().clear().type('New Sheet Title');

    // Clicking the save button
    cy.get('[id="sheetTitleSaveButton"]').click();

    //  Check if the name has been updated
    cy.get('[id="selectSheet0Button"]').click().contains('New Sheet Title');
  });

  it('Performs basic arithmetic operations in cell', () => {
    // Input formula in cell A1
    cy.get('.Spreadsheet')
      .get('[data-rowindex="0"]')
      .within(() => {
        cy.get('[data-field="A"]')
          .click({ multiple: false })
          .type('=(2+3)')
          .type('{enter}');
        cy.get('[data-field="A"]').within(() => {
          cy.get('.MuiDataGrid-cellContent').should('have.attr', 'title', '5'); // Checking if the value was actually changed
        });
      });
  });
  it('Test display value save works for basic arithmethic #1', () => {
    // Clicking cell B2
    cy.get('.Spreadsheet')
      .get('[data-rowindex="1"]')
      .within(() => {
        cy.get('[data-field="B"]').click({ multiple: false });
      });
    // Typing in "testing123" into the true value display
    cy.get('.Spreadsheet')
      .get('[id="cell_true_display"]')
      .click()
      .type('=((2*3)/6)');
    // Clicking the save button
    cy.get('[id="saveButton"]').click();
    // Checking to make sure cell B2 was updated
    cy.get('.Spreadsheet')
      .get('[data-rowindex="1"]')
      .within(() => {
        cy.get('[data-field="B"]').within(() => {
          // Checking if the value was actually changed
          // The cells store the acutal value in the 'title' attribute so we have to check that
          cy.get('.MuiDataGrid-cellContent').should('have.attr', 'title', '1');
        });
      });
  });

  it('Performs SUM operation on a range of cells', () => {
    // Set values in a range of cells A1, A2, A3
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="A"]')
      .click()
      .type('1')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="1"] [data-field="A"]')
      .click()
      .type('2')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="2"] [data-field="A"]')
      .click()
      .type('3')
      .type('{enter}');

    // Perform SUM operation in cell B1
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="B"]')
      .click()
      .type('=SUM(A1..A3)')
      .type('{enter}');

    // Check the result in cell B1
    cy.get('.Spreadsheet')
      .get('[data-rowindex="0"]')
      .within(() => {
        cy.get('[data-field="B"]').within(() => {
          // Checking if the value was actually changed
          // The cells store the acutal value in the 'title' attribute so we have to check that
          cy.get('.MuiDataGrid-cellContent').should('have.attr', 'title', '6');
          //cy.get('.Spreadsheet [data-rowindex="0"] [data-field="B"]').get('[id="cell_true_display"]').should('have.attr', 'value', '=SUM(A1..A3)');
        });
      });
  });

  it('Performs simple error detectinon for division by 0', () => {
    // Set values in a range of cells A1, A2, A3
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="A"]')
      .click()
      .type('1')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="1"] [data-field="A"]')
      .click()
      .type('2')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="2"] [data-field="A"]')
      .click()
      .type('3')
      .type('{enter}');

    // Perform SUM operation in cell B1
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="B"]')
      .click()
      .type('=(REF(A1)/0)')
      .type('{enter}');

    // Check the result in cell B1
    cy.get('.Spreadsheet')
      .get('[data-rowindex="0"]')
      .within(() => {
        cy.get('[data-field="B"]').within(() => {
          // Checking if the value was actually changed
          // The cells store the acutal value in the 'title' attribute so we have to check that
          cy.get('.MuiDataGrid-cellContent').should(
            'have.attr',
            'title',
            '#DIV/0!'
          );
          //cy.get('.Spreadsheet [data-rowindex="0"] [data-field="B"]').get('[id="cell_true_display"]').should('have.attr', 'value', '=SUM(A1..A3)');
        });
      });
  });

  it('Performs AVG operation on a range of cells', () => {
    // Set values in a range of cells A1, A2, A3
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="A"]')
      .click()
      .type('1')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="1"] [data-field="A"]')
      .click()
      .type('1')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="2"] [data-field="A"]')
      .click()
      .type('1')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="B"]')
      .click()
      .type('1')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="1"] [data-field="B"]')
      .click()
      .type('1')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="2"] [data-field="B"]')
      .click()
      .type('1')
      .type('{enter}');

    // Perform SUM operation in cell B1
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="C"]')
      .click()
      .type('=AVG(A1..B3)')
      .type('{enter}');

    // Check the result in cell B1
    cy.get('.Spreadsheet')
      .get('[data-rowindex="0"]')
      .within(() => {
        cy.get('[data-field="C"]').within(() => {
          // Checking if the value was actually changed
          // The cells store the acutal value in the 'title' attribute so we have to check that
          cy.get('.MuiDataGrid-cellContent').should('have.attr', 'title', '1');
          //cy.get('.Spreadsheet [data-rowindex="0"] [data-field="B"]').get('[id="cell_true_display"]').should('have.attr', 'value', '=SUM(A1..A3)');
        });
      });
  });

  it('Performs combinations of operation on a range of cells', () => {
    // Set values in a range of cells A1, A2, A3
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="A"]')
      .click()
      .type('1')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="1"] [data-field="A"]')
      .click()
      .type('1')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="2"] [data-field="A"]')
      .click()
      .type('1')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="B"]')
      .click()
      .type('1')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="1"] [data-field="B"]')
      .click()
      .type('1')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="2"] [data-field="B"]')
      .click()
      .type('1')
      .type('{enter}');

    // Perform SUM operation in cell B1
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="C"]')
      .click()
      .type('=(AVG(A1..B3)/2 + REF(A1))')
      .type('{enter}');

    // Check the result in cell B1
    cy.get('.Spreadsheet')
      .get('[data-rowindex="0"]')
      .within(() => {
        cy.get('[data-field="C"]').within(() => {
          // Checking if the value was actually changed
          // The cells store the acutal value in the 'title' attribute so we have to check that
          cy.get('.MuiDataGrid-cellContent').should(
            'have.attr',
            'title',
            '1.5'
          );
          //cy.get('.Spreadsheet [data-rowindex="0"] [data-field="B"]').get('[id="cell_true_display"]').should('have.attr', 'value', '=SUM(A1..A3)');
        });
      });
  });

  it('Performs concat operation on cells REF()', () => {
    cy.get('.Spreadsheet')
      .get('[data-rowindex="0"]')
      .within(() => {
        cy.get('[data-field="A"]')
          .click({ multiple: false })
          .type('Hello')
          .type('{enter}');
        cy.get('[data-field="B"]')
          .click({ multiple: false })
          .type('World')
          .type('{enter}'); // {enter} mimics presses the enter key
        cy.get('[data-field="C"]')
          .click({ multiple: false })
          .type('=(REF(A1) + REF(B1))')
          .type('{enter}');
        cy.get('[data-field="A"]').within(() => {
          cy.get('.MuiDataGrid-cellContent').should(
            'have.attr',
            'title',
            'Hello'
          ); // Checking if the value was actually changed
        });

        cy.get('[data-field="B"]').within(() => {
          cy.get('.MuiDataGrid-cellContent').should(
            'have.attr',
            'title',
            'World'
          ); // Checking if the value was actually changed
        });
        cy.get('[data-field="C"]').within(() => {
          cy.get('.MuiDataGrid-cellContent').should(
            'have.attr',
            'title',
            'HelloWorld'
          ); // Checking if the value was actually changed
        });
      });
  });

  it('Performs SUM operation on a range of cells and the cell should update if any of the referenced cell changes value', () => {
    // Set values in a range of cells A1, A2, A3
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="A"]')
      .click()
      .type('1')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="1"] [data-field="A"]')
      .click()
      .type('2')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="2"] [data-field="A"]')
      .click()
      .type('3')
      .type('{enter}');

    // Perform SUM operation in cell B1
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="B"]')
      .click()
      .type('=SUM(A1..A3)')
      .type('{enter}');

    // Check the result in cell B1
    cy.get('.Spreadsheet')
      .get('[data-rowindex="0"]')
      .within(() => {
        cy.get('[data-field="B"]').within(() => {
          // Checking if the value was actually changed
          // The cells store the acutal value in the 'title' attribute so we have to check that
          cy.get('.MuiDataGrid-cellContent').should('have.attr', 'title', '6');
          //cy.get('.Spreadsheet [data-rowindex="0"] [data-field="B"]').get('[id="cell_true_display"]').should('have.attr', 'value', '=SUM(A1..A3)');
        });
      });
    //change value of A1
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="A"]')
      .click()
      .type('10')
      .type('{enter}');
    // Check the result in cell B1
    cy.get('.Spreadsheet')
      .get('[data-rowindex="0"]')
      .within(() => {
        cy.get('[data-field="B"]').within(() => {
          // Checking if the value was actually changed
          // The cells store the acutal value in the 'title' attribute so we have to check that
          cy.get('.MuiDataGrid-cellContent').should('have.attr', 'title', '15');
          //cy.get('.Spreadsheet [data-rowindex="0"] [data-field="B"]').get('[id="cell_true_display"]').should('have.attr', 'value', '=SUM(A1..A3)');
        });
      });

    //change value of A2
    cy.get('.Spreadsheet [data-rowindex="1"] [data-field="A"]')
      .click()
      .type('20')
      .type('{enter}');
    // Check the result in cell B1
    cy.get('.Spreadsheet')
      .get('[data-rowindex="0"]')
      .within(() => {
        cy.get('[data-field="B"]').within(() => {
          // Checking if the value was actually changed
          // The cells store the acutal value in the 'title' attribute so we have to check that
          cy.get('.MuiDataGrid-cellContent').should('have.attr', 'title', '33');
          //cy.get('.Spreadsheet [data-rowindex="0"] [data-field="B"]').get('[id="cell_true_display"]').should('have.attr', 'value', '=SUM(A1..A3)');
        });
      });

    //change value of A3
    cy.get('.Spreadsheet [data-rowindex="2"] [data-field="A"]')
      .click()
      .type('-10')
      .type('{enter}');
    // Check the result in cell B1
    cy.get('.Spreadsheet')
      .get('[data-rowindex="0"]')
      .within(() => {
        cy.get('[data-field="B"]').within(() => {
          // Checking if the value was actually changed
          // The cells store the acutal value in the 'title' attribute so we have to check that
          cy.get('.MuiDataGrid-cellContent').should('have.attr', 'title', '20');
        });
      });
  });

  it('Inserts a new row in the spreadsheet', () => {
    // Set values in a range of cells A1, A2, A3
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="A"]')
      .click()
      .type('1')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="1"] [data-field="A"]')
      .click()
      .type('2')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="2"] [data-field="A"]')
      .click()
      .type('3')
      .type('{enter}');
    // Open the dialog to edit rows and columns
    //'[id="editRowColDialog"]

    cy.get('.Spreadsheet')
      .get('[data-rowindex="0"]')
      .within(() => {
        cy.get('[data-field="id"]').click();
      });

    cy.get('[id="action: Insert Row"]').click();

    // Check if the first row (A1) is empty
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="A"]').within(() => {
      cy.get('.MuiDataGrid-cellContent').should('have.text', '');
    });

    // Check if the second row (A2) now has the value '1' (previously in A1)
    cy.get('.Spreadsheet [data-rowindex="1"] [data-field="A"]').within(() => {
      cy.get('.MuiDataGrid-cellContent').should('have.attr', 'title', '1');
    });
    // Check if the third row (A3) now has the value '2' (previously in A2)
    cy.get('.Spreadsheet [data-rowindex="2"] [data-field="A"]').within(() => {
      cy.get('.MuiDataGrid-cellContent').should('have.attr', 'title', '2');
    });

    cy.get('.Spreadsheet [data-rowindex="3"] [data-field="A"]').within(() => {
      cy.get('.MuiDataGrid-cellContent').should('have.attr', 'title', '3');
    });
  });

  it('Delete a new row in the spreadsheet', () => {
    // Set values in a range of cells A1, A2, A3
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="A"]')
      .click()
      .type('1')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="1"] [data-field="A"]')
      .click()
      .type('2')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="2"] [data-field="A"]')
      .click()
      .type('3')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="B"]')
      .click()
      .type('5')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="1"] [data-field="B"]')
      .click()
      .type('6')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="2"] [data-field="B"]')
      .click()
      .type('7')
      .type('{enter}');

    cy.get('.Spreadsheet')
      .get('[data-rowindex="0"]')
      .within(() => {
        cy.get('[data-field="id"]').click();
      });

    cy.get('[id="action: Remove Row"]').click();

    // Check if the first row (A1) is empty
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="A"]').within(() => {
      cy.get('.MuiDataGrid-cellContent').should('have.text', '2');
    });

    // Check if the second row (A2) now has the value '1' (previously in A1)
    cy.get('.Spreadsheet [data-rowindex="1"] [data-field="A"]').within(() => {
      cy.get('.MuiDataGrid-cellContent').should('have.attr', 'title', '3');
    });
    // Check if the third row (A3) now has the value '2' (previously in A2)
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="B"]').within(() => {
      cy.get('.MuiDataGrid-cellContent').should('have.attr', 'title', '6');
    });

    cy.get('.Spreadsheet [data-rowindex="1"] [data-field="B"]').within(() => {
      cy.get('.MuiDataGrid-cellContent').should('have.attr', 'title', '7');
    });
  });

  it('Inserts a new column in the spreadsheet', () => {
    // Set values in a range of cells A1, B1, C1
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="A"]')
      .click()
      .type('1')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="B"]')
      .click()
      .type('2')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="C"]')
      .click()
      .type('3')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="1"] [data-field="A"]')
      .click()
      .type('1')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="1"] [data-field="B"]')
      .click()
      .type('2')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="1"] [data-field="C"]')
      .click()
      .type('3')
      .type('{enter}');

    cy.get('.Spreadsheet')
      .get('[aria-rowindex="1"]')
      .within(() => {
        cy.get('[aria-colindex="2"]').click();
      });

    cy.get('[id="action: Insert Column"]').click();

    // Check if the first column (A1) is empty
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="A"]').within(() => {
      cy.get('.MuiDataGrid-cellContent').should('have.text', '');
    });

    cy.get('.Spreadsheet [data-rowindex="1"] [data-field="A"]').within(() => {
      cy.get('.MuiDataGrid-cellContent').should('have.text', '');
    });
  });

  it('Delete a new column in the spreadsheet', () => {
    // Set values in a range of cells A1, B1, C1
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="A"]')
      .click()
      .type('1')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="B"]')
      .click()
      .type('2')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="C"]')
      .click()
      .type('3')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="1"] [data-field="A"]')
      .click()
      .type('1')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="1"] [data-field="B"]')
      .click()
      .type('2')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="1"] [data-field="C"]')
      .click()
      .type('3')
      .type('{enter}');

    cy.get('.Spreadsheet')
      .get('[aria-rowindex="1"]')
      .within(() => {
        cy.get('[aria-colindex="2"]').click();
      });

    cy.get('[id="action: Remove Column"]').click();

    // Check if the first column (A1) is empty
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="A"]').within(() => {
      cy.get('.MuiDataGrid-cellContent').should('have.text', '2');
    });

    cy.get('.Spreadsheet [data-rowindex="1"] [data-field="A"]').within(() => {
      cy.get('.MuiDataGrid-cellContent').should('have.text', '2');
    });
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="B"]').within(() => {
      cy.get('.MuiDataGrid-cellContent').should('have.text', '3');
    });

    cy.get('.Spreadsheet [data-rowindex="1"] [data-field="B"]').within(() => {
      cy.get('.MuiDataGrid-cellContent').should('have.text', '3');
    });
  });

  it('Performs AVG operation on a range of cells and check for true value', () => {
    // Set values in a range of cells A1, A2, A3
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="A"]')
      .click()
      .type('1')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="1"] [data-field="A"]')
      .click()
      .type('1')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="2"] [data-field="A"]')
      .click()
      .type('1')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="B"]')
      .click()
      .type('1')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="1"] [data-field="B"]')
      .click()
      .type('1')
      .type('{enter}');
    cy.get('.Spreadsheet [data-rowindex="2"] [data-field="B"]')
      .click()
      .type('1')
      .type('{enter}');

    // Perform SUM operation in cell B1
    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="C"]')
      .click()
      .type('=AVG(A1..B3)')
      .type('{enter}');

    // Check the result in cell C1
    cy.get('.Spreadsheet')
      .get('[data-rowindex="0"]')
      .within(() => {
        cy.get('[data-field="C"]').within(() => {
          // Checking if the value was actually changed
          // The cells store the acutal value in the 'title' attribute so we have to check that
          cy.get('.MuiDataGrid-cellContent').should('have.attr', 'title', '1');
        });
      });

    cy.get('.Spreadsheet [data-rowindex="0"] [data-field="C"]').click();
    cy.get('[id="cell_true_display"]').should('have.value', '=AVG(A1..B3)');
  });

  // Tests create a new sheet
  it('Creates new sheet', () => {
    cy.get('[id="addSheetButton"]').click();
    cy.get('[id="selectSheet1Button"]').contains('1');
  });

  // Tests deleting a sheet
  it('Creates a sheet, then deletes the sheet', () => {
    cy.get('[id="addSheetButton"]').click();
    cy.get('[id="selectSheet1SettingsButton"]').click();
    cy.get('[id="deleteSheetButton"]').click();
    cy.get('[id="sheetSelectorSheetList"]').contains('1').should('not.exist');
  });
});
