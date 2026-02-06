# Google Drive Expenses Upload - Complete Guide

## ✅ What This Does:
When a user submits an expense with a receipt photo:
1. Photo uploads to your Google Drive folder
2. Gets a shareable link
3. Link saves to Column I in Expenses sheet
4. Everything else saves normally (Date, Amount, Category, etc.)

---

## 📋 STEP 1: Make Drive Folder Writable (REQUIRED)

You MUST do this first or uploads will fail:

1. **Go to your Expenses folder:**
   https://drive.google.com/drive/folders/15EyjD0VWOXjs8qSOYGpjDoi80fJmXUh3

2. **Click "Share" button** (top right)

3. **Change settings:**
   - Click "Change to anyone with the link"
   - Change dropdown from "Viewer" to **"Editor"**
   - Click "Done"

This allows the app to upload files.

---

## 📁 FILES TO UPLOAD:

### 1. **google-drive-upload.ts** → `lib/google-drive-upload.ts`
Handles the Drive upload logic

### 2. **google-sheets-expense-addon.ts** → ADD TO EXISTING `lib/google-sheets.ts`
This is NOT a separate file! You need to:
- Open your existing `lib/google-sheets.ts`
- Add the `submitExpense` function from this file
- Add the import: `import { uploadReceiptImage } from './google-drive-upload';`
- Add the constant: `const GOOGLE_API_KEY = 'AIzaSyAXsWtZb0eNjfJg178m9_XOF9fLYdXh-ew';`

### 3. **expenses.tsx** → `app/(tabs)/expenses.tsx`
The UI is unchanged, but the backend now uploads to Drive

---

## 🔧 HOW TO INTEGRATE:

Since `google-sheets-expense-addon.ts` is not a standalone file, here's what to do:

### Option A: If submitExpense doesn't exist yet
Just copy the entire `submitExpense` function from `google-sheets-expense-addon.ts` and paste it into your `lib/google-sheets.ts` file.

### Option B: If submitExpense already exists
Replace the existing `submitExpense` function with the new one from `google-sheets-expense-addon.ts`.

### Don't Forget:
Add these to the top of `lib/google-sheets.ts`:
```typescript
import { uploadReceiptImage } from './google-drive-upload';

const GOOGLE_API_KEY = 'AIzaSyAXsWtZb0eNjfJg178m9_XOF9fLYdXh-ew';
```

---

## 📊 GOOGLE SHEETS STRUCTURE:

Your **Expenses** sheet should have these columns:
- **Column A:** Employee Name
- **Column B:** Email
- **Column C:** Team
- **Column D:** Date
- **Column E:** Category
- **Column F:** Amount
- **Column G:** Description
- **Column H:** Status (auto-filled as "Pending")
- **Column I:** Receipt Link (auto-filled with Drive link) ← NEW!

---

## 🧪 TESTING AFTER DEPLOYMENT:

1. **Log in to the app**
2. **Go to Expenses tab**
3. **Fill out an expense:**
   - Enter amount, category, description
   - Click "Take Photo" or "Choose from Library"
   - Select/take a receipt photo
4. **Click "Submit Expense"**
5. **Check:**
   - ✅ Green success message
   - ✅ Google Sheet has new row
   - ✅ Column I has Drive link
   - ✅ Clicking link opens the receipt image

---

## 🐛 TROUBLESHOOTING:

### Error: "Failed to upload receipt image"
**Solution:** Make sure you made the Drive folder publicly writable (Step 1)

### Receipt uploads but link is empty in sheet
**Solution:** Check that Column I exists in your Expenses sheet

### Image shows as file:// or data:
**Solution:** Normal - the upload function converts it properly

### "Permission denied" error
**Solution:** 
1. Check Drive folder is set to "Editor" not "Viewer"
2. Verify folder ID is correct: 15EyjD0VWOXjs8qSOYGpjDoi80fJmXUh3

---

## 📸 HOW IT WORKS:

```
User selects photo
     ↓
Photo stored temporarily in app
     ↓
User clicks "Submit Expense"
     ↓
1. Photo uploads to Drive folder
2. Drive returns shareable link
3. Expense data + link saves to Sheet Column I
     ↓
Success! User sees confirmation
```

---

## 🔐 SECURITY NOTE:

Currently using **public folder** (Option A) for quick testing.

For production, consider:
- Creating a service account
- Restricting folder access
- Using OAuth for user-specific uploads

This current setup works but allows anyone with the folder link to upload files.

---

## ✅ DEPLOYMENT CHECKLIST:

- [ ] Made Drive folder publicly writable
- [ ] Added `google-drive-upload.ts` to `lib/`
- [ ] Updated `lib/google-sheets.ts` with new `submitExpense` function
- [ ] Added import and API key constant to `google-sheets.ts`
- [ ] Replaced `app/(tabs)/expenses.tsx`
- [ ] Pushed to GitHub
- [ ] Waited for Vercel deployment
- [ ] Tested expense submission
- [ ] Verified link in Column I
- [ ] Clicked link to view receipt

---

Need help? Check the console logs for `[DriveUpload]` and `[submitExpense]` messages!
