/**
 * Google Apps Script for Phoenix DM Expense Submission
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1gi2N5tDW98zRPjKcSNHAuEH57XYW8uufbTjXbHUCIOI
 * 2. Go to Extensions → Apps Script
 * 3. Delete any existing code
 * 4. Paste this entire script
 * 5. Click "Deploy" → "New deployment"
 * 6. Choose type: "Web app"
 * 7. Execute as: "Me"
 * 8. Who has access: "Anyone"
 * 9. Click "Deploy"
 * 10. Copy the Web App URL - you'll need it!
 */

// Your Google Drive folder ID for receipts
const DRIVE_FOLDER_ID = '15EyjD0VWOXjs8qSOYGpjDoi80fJmXUh3';

/**
 * Handle POST requests for expense submission
 */
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    Logger.log('Received expense submission:', data);
    
    let driveLink = '';
    
    // Upload receipt image to Google Drive if provided
    if (data.receiptImageBase64) {
      Logger.log('Uploading receipt image to Drive...');
      driveLink = uploadImageToDrive(data.receiptImageBase64, data.date);
      Logger.log('Upload successful:', driveLink);
    }
    
    // Get the Expenses sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let expensesSheet = ss.getSheetByName('Expenses');
    
    // Create the Expenses sheet if it doesn't exist
    if (!expensesSheet) {
      expensesSheet = ss.insertSheet('Expenses');
      // Add headers
      expensesSheet.appendRow([
        'Employee Name',
        'Email',
        'Team',
        'Date',
        'Category',
        'Amount',
        'Description',
        'Status',
        'Receipt Link'
      ]);
    }
    
    // Append the expense data
    expensesSheet.appendRow([
      data.employeeName,
      data.employeeEmail,
      data.team,
      data.date,
      data.category,
      data.amount,
      data.description || '',
      'Pending',
      driveLink
    ]);
    
    Logger.log('Expense saved successfully');
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Expense submitted successfully',
      driveLink: driveLink
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error:', error.toString());
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Upload base64 image to Google Drive
 */
function uploadImageToDrive(base64Data, expenseDate) {
  try {
    // Remove data URL prefix if present (data:image/jpeg;base64,)
    const base64Image = base64Data.split(',')[1] || base64Data;
    
    // Convert base64 to blob
    const blob = Utilities.newBlob(
      Utilities.base64Decode(base64Image),
      'image/jpeg',
      `receipt_${expenseDate}_${new Date().getTime()}.jpg`
    );
    
    // Get the folder
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    
    // Create the file
    const file = folder.createFile(blob);
    
    // Make it publicly viewable
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // Return the shareable link
    return file.getUrl();
    
  } catch (error) {
    Logger.log('Drive upload error:', error.toString());
    throw new Error('Failed to upload image: ' + error.toString());
  }
}

/**
 * Test function to verify the script works
 */
function testSubmitExpense() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        employeeName: 'Test User',
        employeeEmail: 'test@example.com',
        team: 'KYT2',
        date: '2026-02-06',
        category: 'Meals',
        amount: 25.50,
        description: 'Team lunch',
        receiptImageBase64: '' // Leave empty for test without image
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log('Test result:', result.getContent());
}
