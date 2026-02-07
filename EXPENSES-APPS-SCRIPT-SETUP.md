# Google Apps Script Expense Solution - Complete Setup Guide

## 🎯 What This Does:
- Users submit expenses with receipt photos in the app
- Photo uploads to your Google Drive folder automatically
- Expense data saves to Google Sheets with Drive link
- No OAuth needed - uses Google Apps Script!

---

## 📋 STEP 1: Deploy the Google Apps Script

### 1.1 Open Apps Script Editor
1. Go to your Google Sheet: https://docs.google.com/spreadsheets/d/1gi2N5tDW98zRPjKcSNHAuEH57XYW8uufbTjXbHUCIOI
2. Click **Extensions** → **Apps Script**
3. Delete any existing code in the editor

### 1.2 Paste the Script
1. Open the file: `Google-Apps-Script-Expense-Submission.js`
2. Copy ALL the code
3. Paste it into the Apps Script editor
4. Click the **💾 Save** icon (or Ctrl+S)
5. Name the project: "Phoenix Expense Submission"

### 1.3 Deploy as Web App
1. Click **Deploy** (top right) → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **"Web app"**
4. Fill in the settings:
   - **Description:** "Expense submission endpoint"
   - **Execute as:** "Me (your email)"
   - **Who has access:** "Anyone"
5. Click **Deploy**
6. Click **Authorize access**
7. Choose your Google account
8. Click **Advanced** → **Go to Phoenix Expense Submission (unsafe)**
9. Click **Allow**

### 1.4 Copy the Web App URL
After deployment, you'll see a URL like:
```
https://script.google.com/macros/s/AKfycby.../exec
```

**COPY THIS URL!** You'll need it in the next step.

---

## 📋 STEP 2: Update Your App Code

### 2.1 Add Environment Variable

You need to add the Apps Script URL to your project.

**Create a file:** `.env` in your project root (if it doesn't exist)

**Add this line:**
```
EXPO_PUBLIC_EXPENSE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

Replace `YOUR_SCRIPT_ID` with the actual URL you copied!

**For Vercel deployment:**
1. Go to: https://vercel.com/bris-projects-3537f019/phoenixv2/settings/environment-variables
2. Add new variable:
   - **Name:** `EXPO_PUBLIC_EXPENSE_SCRIPT_URL`
   - **Value:** Your Apps Script URL
   - **Environments:** Production, Preview, Development (check all)
3. Click **Save**

### 2.2 Update google-sheets.ts

Replace your `lib/google-sheets.ts` file with the new version:
- File: `google-sheets-COMPLETE.ts`
- Location: `lib/google-sheets.ts`

### 2.3 Deploy

```bash
git add .
git commit -m "Add Google Apps Script expense submission"
git push
```

Wait for Vercel to deploy (~2 minutes)

---

## 📋 STEP 3: Create Expenses Sheet (if needed)

The script will auto-create the Expenses sheet, but you can create it manually:

1. Open your Google Sheet
2. Click the **+** at the bottom to add a new sheet
3. Name it: **"Expenses"**
4. Add these column headers in Row 1:
   - A: Employee Name
   - B: Email
   - C: Team
   - D: Date
   - E: Category
   - F: Amount
   - G: Description
   - H: Status
   - I: Receipt Link

---

## 🧪 STEP 4: Test It!

### 4.1 Test the Apps Script Directly

In the Apps Script editor:
1. Select the function: `testSubmitExpense`
2. Click **Run** (▶️)
3. Check the **Execution log** - should say "Test result: ..."
4. Check your Expenses sheet - should have a new row!

### 4.2 Test in the App

1. Go to https://test.phoenixdm.co
2. Log in
3. Go to **Expenses** tab
4. Fill out the form
5. Upload a receipt photo
6. Click **Submit Expense**
7. Should see "Success!" message
8. Check:
   - ✅ Google Sheet has new expense row
   - ✅ Column I has Google Drive link
   - ✅ Clicking link shows the receipt image

---

## 🐛 Troubleshooting

### Error: "Expense script URL not configured"
**Solution:** Make sure you added `EXPO_PUBLIC_EXPENSE_SCRIPT_URL` to:
- Your `.env` file (for local)
- Vercel environment variables (for production)
- Then redeploy

### Error: "Authorization required"
**Solution:** 
1. Go back to Apps Script
2. Click **Deploy** → **Manage deployments**
3. Click the **pencil icon** to edit
4. Make sure "Who has access" is set to **"Anyone"**
5. Click **Deploy**

### Receipt uploads but link is empty
**Solution:** Check that the Drive folder ID is correct:
- Open the script in Apps Script
- Line 13: `const DRIVE_FOLDER_ID = '15EyjD0VWOXjs8qSOYGpjDoi80fJmXUh3';`
- Verify this matches your folder ID

### Script runs but nothing saves
**Solution:**
1. In Apps Script, click **Executions** (left sidebar)
2. Find the failed execution
3. Click on it to see the error
4. Common fix: Make sure sheet name is exactly "Expenses" (case-sensitive)

---

## 📁 Files Included:

1. **Google-Apps-Script-Expense-Submission.js** - The Apps Script code
2. **google-sheets-COMPLETE.ts** - Updated google-sheets.ts file
3. **EXPENSES-APPS-SCRIPT-SETUP.md** - This guide

---

## ✅ Final Checklist:

- [ ] Deployed Google Apps Script as web app
- [ ] Copied the web app URL
- [ ] Added EXPO_PUBLIC_EXPENSE_SCRIPT_URL to environment variables
- [ ] Updated lib/google-sheets.ts
- [ ] Pushed to GitHub
- [ ] Waited for Vercel deployment
- [ ] Tested expense submission
- [ ] Verified receipt link in sheet
- [ ] Clicked link to view uploaded image

---

## 🎉 Done!

Your expense system is now fully functional with:
- ✅ Automatic receipt uploads to Google Drive
- ✅ Expense data in Google Sheets
- ✅ Shareable links in Column I
- ✅ No OAuth complexity
- ✅ Completely free!

Need help? Check the Apps Script **Execution log** for detailed error messages!
