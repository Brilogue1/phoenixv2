# Phoenix DM - File Installation Guide

## 📦 What's in the ZIP

This ZIP contains **10 code files** and **1 instruction file**.

---

## 📁 Where Each File Goes

### Code Files (10 files to copy):

```
phoenix-app/                                    ← Your project root
│
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx                        ← Replace this file ✏️
│   │   ├── index.tsx                          ← Replace this file ✏️
│   │   └── sales.tsx                          ← Replace this file ✏️ (NEW)
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

---

## 🚀 Quick Install Steps

### Step 1: Extract the ZIP
Unzip `phoenix-fixes.zip` to a temporary folder

### Step 2: Copy Files to Your Project
Just drag and drop each file to its correct location (see folder structure above)

### Step 3: Push to GitHub
```bash
git add .
git commit -m "Add auto-refresh and fix all issues"
git push
```

### Step 4: Wait for Vercel (~2 minutes)

---

## ✅ What's Fixed

1. **Bottom Nav Icons** - Always visible in purple
2. **Logout Button** - "Logout" text button on home screen
3. **Default Profile** - Everyone starts on their own profile
4. **Google Sheets** - Reads from "Logins" sheet with correct columns (all 22 employees!)
5. **Auto-Refresh Every 2 Minutes** ⭐ - Home and Sales screens automatically check for new data
6. **PWA Icon** - Fixed purple "P" issue

---

## 🔄 Auto-Refresh Feature (NEW!)

### What Auto-Refreshes:
- **Home Screen:** Flights, Hotels, Rental Cars - Every 2 minutes
- **Sales Screen:** Sales data - Every 2 minutes

### Timeline:
- Add data to Google Sheet
- Wait up to 2 minutes
- Data appears automatically! (Or pull down to refresh immediately)

---

## 📊 Data Refresh Timeline

| Action | When It Appears |
|--------|----------------|
| Add flight/hotel/rental | Within 2 minutes or pull to refresh |
| Add sales figure | Within 2 minutes or pull to refresh |
| Add new employee | Immediately when opening profile selector |
| Change password | Immediately on next login |

Good luck! 🚀
