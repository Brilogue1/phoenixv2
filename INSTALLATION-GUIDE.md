# Phoenix DM - File Installation Guide

## 📦 What's in the ZIP

This ZIP contains **9 code files** and **3 instruction files**.

---

## 📁 Where Each File Goes

### Code Files (9 files to copy):

```
phoenix-app/                                    ← Your project root
│
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx                        ← Replace this file ✏️
│   │   └── index.tsx                          ← Replace this file ✏️
│   │
│   ├── login.tsx                              ← Replace this file ✏️
│   └── app.config.ts                          ← Replace this file ✏️
│
├── lib/
│   └── google-sheets.ts                       ← Replace this file ✏️
│
├── components/
│   └── user-profile-selector.tsx              ← Replace this file ✏️
│
└── public/
    ├── manifest.json                          ← Replace this file ✏️
    ├── app.html                               ← NEW FILE - Add this ➕
    └── _headers                               ← NEW FILE - Add this ➕
```

### Instruction Files (3 files - for reference):
- `README-FIXES.md` - Complete guide with troubleshooting
- `QUICK-SUMMARY.md` - Quick checklist
- `ANDROID-INSTRUCTIONS.md` - Android-specific cache clearing

---

## 🚀 Quick Install Steps

### Step 1: Extract the ZIP
Unzip `phoenix-fixes.zip` to a temporary folder

### Step 2: Copy Files to Your Project

**Option A - Command Line (Mac/Linux):**
```bash
# Navigate to where you extracted the ZIP
cd ~/Downloads/phoenix-fixes  # (or wherever you extracted it)

# Copy to your project (adjust path to your project)
cp _layout.tsx /path/to/phoenix-app/app/(tabs)/_layout.tsx
cp index.tsx /path/to/phoenix-app/app/(tabs)/index.tsx
cp login.tsx /path/to/phoenix-app/app/login.tsx
cp app.config.ts /path/to/phoenix-app/app.config.ts
cp google-sheets.ts /path/to/phoenix-app/lib/google-sheets.ts
cp user-profile-selector.tsx /path/to/phoenix-app/components/user-profile-selector.tsx
cp manifest.json /path/to/phoenix-app/public/manifest.json
cp app.html /path/to/phoenix-app/public/app.html
cp _headers /path/to/phoenix-app/public/_headers
```

**Option B - Manually:**
1. Open the extracted folder
2. Open your project folder in another window
3. Drag and drop each file to its correct location (see folder structure above)
4. Confirm "Replace" when asked for existing files

### Step 3: Push to GitHub
```bash
cd /path/to/phoenix-app
git add .
git commit -m "Fix icons, add logout, and improve caching"
git push
```

### Step 4: Wait for Vercel
- Go to https://vercel.com/bris-projects-3537f019/phoenixv2
- Wait for deployment to complete (~2 minutes)
- Look for green checkmark ✅

### Step 5: Test!
- Visit https://test.phoenixdm.co/
- Bottom icons should be visible in purple
- Logout button should appear on home screen
- Everyone should see their own profile by default

---

## ✅ What's Fixed

1. **Bottom Nav Icons** - Always visible in purple (light purple when inactive, bright purple when active)
2. **Logout Button** - Arrow icon next to profile on home screen
3. **Default Profile** - Everyone starts on their own profile
4. **Google Sheets Refresh** - New employees show immediately
5. **PWA Icon** - Fixed purple "P" issue (requires cache clear on device)

---

## 🔧 If Something Goes Wrong

**Icons still not showing?**
- Check that `_layout.tsx` is in the correct folder: `app/(tabs)/_layout.tsx`
- Make sure Vercel deployment finished successfully
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

**Can't find the (tabs) folder?**
- The folder name is literally "(tabs)" with parentheses
- Full path: `app/(tabs)/_layout.tsx`

**Files won't replace?**
- Make sure you have write permissions
- Close any editors that have the files open
- Try manually deleting the old file first, then copy the new one

---

## 📱 For the PWA Icon Issue

After deploying, you need to clear cache on your device:

**Android:**
1. Remove app from home screen
2. Chrome → Settings → Privacy → Clear browsing data (All time)
3. **Restart phone**
4. Visit `https://test.phoenixdm.co/?v=3`
5. Add to home screen
6. Phoenix bird should appear!

Read `ANDROID-INSTRUCTIONS.md` for detailed steps.

---

## 📚 Need More Help?

- Read `README-FIXES.md` for detailed explanations
- Read `QUICK-SUMMARY.md` for a quick checklist
- Check Vercel deployment logs if build fails

---

## Summary of Changes

| File | What Changed |
|------|--------------|
| _layout.tsx | Added icons, made them always purple |
| index.tsx | Added logout button, default profile |
| login.tsx | Sets user's own profile on login |
| google-sheets.ts | Cache-busting for fresh data |
| user-profile-selector.tsx | Ensures fresh employee list |
| manifest.json | PWA icon cache-busting |
| app.html | PWA meta tags for iOS |
| _headers | Prevents PWA asset caching |
| app.config.ts | Uses custom HTML template |

Good luck! 🚀
