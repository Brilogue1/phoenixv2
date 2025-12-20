// Google Apps Script for Phoenix App - Expense Submission
// This script receives expense data from the mobile app and writes it to the Expenses sheet

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Get or create the Expenses sheet
    let expensesSheet = ss.getSheetByName('Expenses');
    if (!expensesSheet) {
      expensesSheet = ss.insertSheet('Expenses');
      // Add headers
      expensesSheet.appendRow([
        'Timestamp',
        'Employee Name',
        'Employee Email',
        'Team',
        'Expense Category',
        'Amount',
        'Payment Method',
        'Notes',
        'Receipt URL',
        'Status'
      ]);
    }
    
    // Prepare the row data
    const timestamp = new Date();
    const rowData = [
      timestamp,
      data.employeeName || '',
      data.employeeEmail || '',
      data.team || '',
      data.category || '',
      data.amount || '',
      data.paymentMethod || '',
      data.notes || '',
      data.receiptUrl || '',
      'Pending' // Default status
    ];
    
    // Append the data to the sheet
    expensesSheet.appendRow(rowData);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Expense submitted successfully',
      timestamp: timestamp.toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error submitting expense: ' + error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function (optional - for testing in the script editor)
function testDoPost() {
  const testData = {
    employeeName: 'Test User',
    employeeEmail: 'test@example.com',
    team: 'KYT2',
    category: 'Meals',
    amount: '50.00',
    paymentMethod: 'AMEX 2004',
    notes: 'Team dinner',
    receiptUrl: 'https://example.com/receipt.jpg'
  };
  
  const e = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(e);
  Logger.log(result.getContent());
}
