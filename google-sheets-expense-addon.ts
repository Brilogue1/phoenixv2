// Add this to your existing google-sheets.ts file

import { uploadReceiptImage } from './google-drive-upload';

export interface ExpenseSubmission {
  employeeName: string;
  employeeEmail: string;
  team: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  receiptImageUri?: string;
}

/**
 * Submit an expense to the Expenses sheet
 * Uploads receipt image to Google Drive and saves link to Column I
 */
export async function submitExpense(expense: ExpenseSubmission): Promise<{ success: boolean; message?: string }> {
  try {
    console.log('[submitExpense] Submitting expense:', expense);

    let driveLink = '';

    // Upload receipt image to Google Drive if provided
    if (expense.receiptImageUri) {
      console.log('[submitExpense] Uploading receipt image to Drive...');
      try {
        // Convert image URI to base64 if needed
        let imageData = expense.receiptImageUri;
        
        // If it's a file URI (not base64), we need to fetch it first
        if (expense.receiptImageUri.startsWith('file://') || !expense.receiptImageUri.startsWith('data:')) {
          const response = await fetch(expense.receiptImageUri);
          const blob = await response.blob();
          
          // Convert blob to base64
          const reader = new FileReader();
          imageData = await new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        }

        driveLink = await uploadReceiptImage(imageData, expense.date);
        console.log('[submitExpense] Image uploaded, Drive link:', driveLink);
      } catch (uploadError) {
        console.error('[submitExpense] Failed to upload image:', uploadError);
        return {
          success: false,
          message: 'Failed to upload receipt image. Please try again.'
        };
      }
    }

    // Prepare data for Google Sheets
    // Columns: A=Employee Name, B=Email, C=Team, D=Date, E=Category, F=Amount, G=Description, H=Status, I=Receipt Link
    const rowData = [
      expense.employeeName,
      expense.employeeEmail,
      expense.team,
      expense.date,
      expense.category,
      expense.amount.toFixed(2),
      expense.description,
      'Pending', // Status
      driveLink  // Receipt Link (Column I)
    ];

    // Append to Expenses sheet using Google Sheets API
    const sheetId = SHEET_ID;
    const sheetName = 'Expenses';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}:append?valueInputOption=USER_ENTERED&key=${GOOGLE_API_KEY}`;

    console.log('[submitExpense] Appending to sheet...');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowData]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[submitExpense] Sheets API error:', errorText);
      return {
        success: false,
        message: 'Failed to save expense to sheet'
      };
    }

    const result = await response.json();
    console.log('[submitExpense] Success:', result);

    return {
      success: true,
      message: 'Expense submitted successfully!'
    };

  } catch (error) {
    console.error('[submitExpense] Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit expense'
    };
  }
}

// Add this constant at the top of the file if not already present
const GOOGLE_API_KEY = 'AIzaSyAXsWtZb0eNjfJg178m9_XOF9fLYdXh-ew';
