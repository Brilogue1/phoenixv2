# Google Apps Script Setup Instructions

Follow these steps to set up the expense submission endpoint for the Phoenix app.

## Step 1: Open Apps Script Editor

1. Go to your Google Sheet: https://docs.google.com/spreadsheets/d/1gi2N5tDW98zRPjKcSNHAuEH57XYW8uufbTjXbHUCIOI/edit
2. Click **Extensions** in the top menu
3. Click **Apps Script**
4. A new tab will open with the Apps Script editor

## Step 2: Add the Script Code

1. You'll see a default `Code.gs` file with some placeholder code
2. **Delete all the existing code** in the editor
3. **Copy the entire code** from the `google-apps-script.js` file I provided
4. **Paste it** into the editor
5. Click the **Save** icon (💾) or press `Ctrl+S` (Windows) / `Cmd+S` (Mac)
6. Give your project a name: **"Phoenix Expense API"**

## Step 3: Deploy as Web App

1. Click the **Deploy** button (top right, looks like a rocket 🚀)
2. Select **"New deployment"**
3. Click the gear icon ⚙️ next to "Select type"
4. Choose **"Web app"**
5. Fill in the deployment settings:
   - **Description**: `Phoenix expense submission endpoint`
   - **Execute as**: Select **"Me (your email)"**
   - **Who has access**: Select **"Anyone"** (this allows the app to send data)
6. Click **"Deploy"**
7. You may see a warning about authorization - click **"Authorize access"**
8. Select your Google account
9. Click **"Advanced"** (if you see a warning)
10. Click **"Go to Phoenix Expense API (unsafe)"** - this is safe, it's your own script
11. Click **"Allow"**

## Step 4: Copy the Web App URL

1. After deployment, you'll see a **"Web app URL"**
2. It will look like: `https://script.google.com/macros/s/AKfycby.../exec`
3. **Copy this entire URL** - you'll need to provide it to me
4. Click **"Done"**

## Step 5: Test the Script (Optional)

1. In the Apps Script editor, select the function dropdown (top toolbar)
2. Choose **"testDoPost"**
3. Click the **Run** button (▶️)
4. Check your Google Sheet - you should see a new "Expenses" sheet with a test entry
5. If it works, you can delete the test row

## Step 6: Provide the URL

Once you have the Web App URL, send it to me and I'll configure the Phoenix app to use it for expense submissions.

The URL should look like:
```
https://script.google.com/macros/s/AKfycby[LONG_STRING_HERE]/exec
```

## Troubleshooting

### "Authorization required" error
- Make sure you clicked "Authorize access" during deployment
- Try deploying again and follow the authorization steps

### "Script not found" error
- Make sure you saved the script before deploying
- Check that you're logged into the correct Google account

### Expenses not appearing in sheet
- Check that the "Expenses" sheet was created
- Run the testDoPost function to verify the script works
- Check the Apps Script execution logs (View → Logs)

## Security Note

The web app URL is public but requires knowledge of the exact URL to use. Only share this URL with the Phoenix app - don't post it publicly. If you ever need to revoke access, you can:
1. Go to Apps Script editor
2. Click Deploy → Manage deployments
3. Click the three dots (⋮) next to your deployment
4. Click "Archive" to disable it
