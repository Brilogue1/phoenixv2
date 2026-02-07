/**
 * Submit expense via Vercel proxy (which calls Apps Script)
 * This avoids CORS issues with Google Apps Script
 */
export async function submitExpense(expense: {
  employeeName: string;
  employeeEmail: string;
  team: string;
  date?: string;
  category: string;
  amount: number;
  paymentMethod?: string;
  notes?: string;
  description?: string;
  receiptUrl?: string;
  receiptImageUri?: string;
}) {
  try {
    console.log('[submitExpense] Starting submission:', expense);

    let base64Image = '';

    // Convert image to base64 if provided
    if (expense.receiptImageUri) {
      console.log('[submitExpense] Processing receipt image...');
      try {
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
        
        base64Image = imageData;
        console.log('[submitExpense] Image converted to base64');
      } catch (imageError) {
        console.error('[submitExpense] Failed to process image:', imageError);
        // Continue without image
      }
    }

    // Prepare data for Apps Script
    const requestData = {
      employeeName: expense.employeeName,
      employeeEmail: expense.employeeEmail,
      team: expense.team,
      date: expense.date || new Date().toISOString().split('T')[0],
      category: expense.category,
      amount: expense.amount,
      description: expense.description || expense.notes || '',
      receiptImageBase64: base64Image
    };

    console.log('[submitExpense] Sending to proxy endpoint...');
    
    // Call our Vercel proxy endpoint instead of Apps Script directly
    const response = await fetch('/api/submit-expense', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[submitExpense] Proxy error:', errorText);
      return {
        success: false,
        message: 'Failed to submit expense'
      };
    }

    const result = await response.json();
    console.log('[submitExpense] Success:', result);

    return {
      success: result.success || true,
      message: result.message || 'Expense submitted successfully!'
    };

  } catch (error) {
    console.error('[submitExpense] Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit expense'
    };
  }
}
