# FINAL FILES - Installation Guide

## All 11 Files to Upload:

### In `app/(tabs)/` folder:
1. **_layout.tsx** - Purple icons, always visible
2. **index.tsx** - Logout button, auto-refresh, default profile
3. **sales.tsx** - Auto-refresh, debugging logs

### In `app/` folder:
4. **login.tsx** - Sets default profile on login
5. **app.config.ts** - Web config

### In `lib/` folder:
6. **google-sheets.ts** - Reads "Logins" sheet, cache-busting, debugging logs

### In `components/` folder:
7. **user-profile-selector.tsx** - Fresh employee data with debugging logs

### In `public/` folder:
8. **manifest.json** - PWA icon fix
9. **app.html** - PWA meta tags (NEW)
10. **_headers** - Cache prevention (NEW)
11. **payroll.tsx** - Fixed text visibility

---

## Quick Upload:

1. Extract this ZIP
2. Copy each file to the correct folder in your project
3. Push to GitHub:
   ```bash
   git add .
   git commit -m "Final fixes - logout, icons, auto-refresh, debugging"
   git push
   ```
4. Wait for Vercel (2 min)
5. Hard refresh browser (Ctrl+Shift+R)

---

## What's Fixed:

✅ Logout button (visible text button)
✅ Purple bottom nav icons (always visible)
✅ Auto-refresh every 2 minutes
✅ Reads from "Logins" sheet
✅ All 20 employees (with debugging to find missing ones)
✅ Default to own profile
✅ Payroll text visibility
✅ PWA icon caching

---

## After Deploy:

Open console (F12) and click profile card - you'll see:
```
[UserProfileSelector] Fetching employees...
[fetchEmployees] Total rows from sheet: X
[fetchEmployees] Row X OK: Name (email)
```

This will show you which employees are loading!
