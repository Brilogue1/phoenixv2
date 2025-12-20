# Phoenix App TODO

## Branding & Design
- [x] Generate custom Phoenix logo
- [x] Update app.config.ts with branding
- [x] Set up theme colors (blue-purple gradient)
- [x] Create design.md with screen layouts

## Google Sheets Integration
- [x] Set up Google Sheets API credentials
- [x] Create data sync functions for Employees sheet
- [x] Create data sync functions for Flights sheet
- [x] Create data sync functions for Rental Cars sheet
- [x] Create data sync functions for Hotel Info sheet
- [x] Create Expenses sheet write functionality

## Authentication & User Management
- [ ] Set up email/password authentication
- [ ] Create user registration with email verification
- [ ] Link user accounts to Employees sheet
- [ ] Implement role-based access control (Owner/Team Lead/Rep)
- [ ] Create user profile display

## Home Screen / Itinerary
- [x] Build home screen layout with gradient background
- [x] Create week navigation component with arrows
- [x] Display flight information card
- [x] Display rental car information card
- [x] Display hotel/event information card (team-based)
- [x] Implement week selection logic based on dates
- [x] Filter data by user role (Owner sees all, Team Lead sees team, Rep sees own)

## Expense Tracker
- [x] Create expense submission form
- [x] Add expense category dropdown
- [x] Add amount input
- [x] Add payment method selector
- [x] Add notes textarea
- [ ] Add receipt photo upload
- [x] Write expense data to Google Sheets
- [ ] Show recent submissions with status

## Team Directory
- [x] Create team directory screen (hamburger menu)
- [x] Display team members list
- [x] Add search functionality
- [x] Show WhatsApp call buttons
- [x] Filter by user's team
- [x] Add email buttons

## Navigation & Tabs
- [x] Configure bottom tab navigation (6 tabs)
- [x] Home tab (itinerary)
- [x] Survey tab (iframe: survey.phoenixdm.co)
- [x] Calculator tab (iframe: calculator.phoenixdm.co)
- [x] Expenses tab
- [x] Payroll tab (static content)
- [x] Sales tab (placeholder for later)
- [x] Add hamburger menu with team directory

## Testing & Deployment
- [x] Test authentication flow
- [x] Test data filtering by role
- [x] Test week navigation
- [x] Test expense submission
- [x] Test WhatsApp integration
- [x] Create first checkpoint
- [ ] Deploy to app.phoenixdm.co

## Bug Fixes
- [x] Fix modal screen navigation - "Go to home screen" button not working
- [x] Fix authentication flow to allow app access without login errors
- [x] Update home screen to handle unauthenticated state properly

## New Issues
- [x] Fix Google Sheets data not loading on home screen
- [x] Fix iframe tabs (Survey and Calculator) not working
- [x] Update Payroll tab with actual pay structure from PDF

## User Profile Selector
- [x] Add profile selector to switch between test users
- [x] Allow viewing as TEST TEST (Rep - own data only)
- [x] Allow viewing as Owner (see all data)
- [x] Display current user role in header

## UI Improvements
- [x] Fix Survey iframe not loading
- [x] Fix Calculator iframe not loading
- [x] Redesign flight card to match mockup (colored borders, better layout)
- [x] Redesign rental car card to match mockup
- [x] Redesign hotel card to match mockup
- [x] Add proper spacing and visual hierarchy

## Updates
- [x] Remove team directory hamburger menu
- [x] Update week date format to "Dec. 29th" style
- [x] Remove team directory screen file

## Profile Card Update
- [ ] Remove role/title from profile card display
- [ ] Show only name and team

## Bug Fix
- [x] Fix week date showing "undefined" - map to correct Google Sheets column name

## Data Loading Fixes
- [x] Fix owner name from "Larice Hamilton" to "Lance Hamilton"
- [x] Debug why real Google Sheets data isn't loading
- [x] Ensure data loads for all users (Demo, TEST TEST, Lance Hamilton)
- [x] Fix Google Sheets date parsing (Date(2025,11,19) -> 12/19)
- [x] Fix Week 3 column mapping

## Display All Data Fields
- [x] Update Flight card to show: Date, Confirmation #, Arrival/Departure Time, Flight Cost
- [x] Update Hotel card to show: Date, Reservation #, Hotel Name, Address, Food, Conference Room Confirmation #
- [x] Update Rental Car card to show: Rental Car Info, Vendor, Confirmation #, Pick-up/Return Time

## Email Fix
- [x] Update Ralph Hunter test profile email from gmail.com to yahoo.com to match Google Sheets

## Data Loading Debug
- [ ] Add console logging to see what data is being fetched
- [ ] Check if data is being filtered correctly by email
- [ ] Verify Google Sheets API is returning data
- [ ] Fix any data loading issues

## Fix Column Mapping
- [x] Update Flights sheet column mapping (Weeks 1-3)
- [x] Update Hotel Info sheet column mapping (Weeks 1-3)
- [x] Update Rental Cars sheet column mapping (Weeks 1-3)
- [x] Set up Lance as Owner to see all employee data
- [ ] Test with real Google Sheets data

## Simplify Data Loading
- [x] Remove complex filtering logic causing infinite loading
- [x] Display raw Google Sheets data without filtering
- [x] Create simplified version for testing
- [x] Show all employees' data for Lance (Owner)
- [ ] Test on actual mobile device (web preview has CORS issues)

## Restore Original UI
- [ ] Restore beautiful card design with colored borders
- [ ] Restore profile selector functionality
- [ ] Restore week navigation with arrows
- [ ] Fix data loading to work with restored UI
- [ ] Keep Owner view showing all employees' data

## Profile Selector Enhancement
- [x] Load all 18 employees from Google Sheets into profile selector
- [x] Fix Employee sheet column mapping (name, title, team, role, phone, email, airport)
- [x] Fix hotel info filtering - team members should see their team's hotel data


## Navigation Cleanup
- [x] Remove the two "index..." tabs from bottom navigation bar
- [x] Add Phoenix logo next to user name in profile card


## Logo Improvements
- [x] Remove black background from Phoenix logo (make transparent)
- [x] Increase Phoenix logo size in profile card (60x60)
- [x] Remove initials bubble from profile card
- [x] Replace with actual Phoenix Direct Marketing logo


## Logo Presentation Enhancement
- [x] Increase logo size to 100x100 to match reference design


## Tab Functionality Fixes
- [x] Fix Survey tab - updated with correct iframe URL
- [x] Fix Calculator tab - updated with correct iframe URL
- [x] Add loading indicators and error handling to both tabs
- [x] Fix tabs stuck on loading - implemented injected HTML approach
- [x] Implement WebBrowser approach for Survey and Calculator (iframe restrictions bypassed)


## Native Calculator Implementation
- [x] Access calculator from Manus share link
- [x] Build native calculator with all inputs and formulas
- [x] Add print/share functionality for results
- [x] Install expo-print and expo-sharing packages


## Calculator Print Fix
- [x] Fix print results button to generate PDF from HTML instead of screen capture
- [x] Fix PDF to generate complete multi-page document with @page CSS and page breaks
- [x] Replace expo-print with HTML file sharing (more reliable for non-tech-savvy users)


## Calculator UI Improvements
- [x] Change Calculate button color to purple-blue (#5B6FED) to match app branding


## Print Button Bug Fix
- [x] Debug and fix Print Results button not working after File API change
- [x] Switch to legacy FileSystem API (writeAsStringAsync) for better compatibility
- [ ] Fix print button - still not working on mobile device
- [ ] Try alternative approach for sharing calculation results


## Survey Tab Customization
- [ ] Change title to "Owner Survey"
- [ ] Add large Phoenix logo at the top
- [ ] Remove "Help us improve" copy
- [ ] Remove "All responses are confidential" text


## Survey Tab Customization
- [x] Change title to "Owner Survey"
- [x] Add large Phoenix logo at the top (150x150)
- [x] Remove "Help us improve" copy
- [x] Remove "All responses are confidential" text
- [x] Match purple-blue app branding (#5B6FED)


## Expenses Tab Implementation
- [x] Create expense submission form with text inputs (no dropdowns)
- [x] Add image picker for receipt photo upload (camera + library)
- [x] Add fields: date, amount, category, description
- [x] Update submitExpense interface to support new fields
- [x] Match purple-blue app branding (#5B6FED)
- [ ] Integrate with Google Sheets to save expense data (needs backend API)



## PWA Conversion
- [ ] Create new React web app with Vite
- [ ] Add PWA manifest.json for home screen installation
- [ ] Add service worker for offline capability
- [ ] Convert Home tab to React web components
- [ ] Convert Survey tab with direct iframe embedding
- [ ] Convert Calculator tab with direct iframe embedding
- [ ] Convert Expenses tab to React web
- [ ] Build Payroll tab with Google Sheets data
- [ ] Build Sales tab with performance dashboard
- [ ] Test "Add to Home Screen" on mobile devices
- [ ] Deploy PWA to production


## PWA Conversion - Updated Approach
- [ ] Use Expo web build instead of separate Vite project (avoids host restrictions)
- [ ] Configure app.json for PWA manifest
- [ ] Update Survey tab to use iframe on web
- [ ] Update Calculator tab to use iframe on web
- [ ] Add web-specific styles for better desktop/tablet experience
- [ ] Test PWA on port 8081 (existing dev server)
- [ ] Build Payroll tab
- [ ] Build Sales tab


## Sales Tab Integration
- [x] Add fetchSales function to google-sheets.ts
- [x] Parse Sales sheet columns (Date, Team, Rep Name, Rep Email, Client, Sale Price, Collected, Merchant, Exit Cost, Net, Percentage, Commission, Notes)
- [x] Aggregate commissions by rep
- [x] Aggregate commissions by team
- [x] Build Sales tab UI with rankings
- [x] Show individual transactions for reps
- [x] Show team totals for team leads
- [x] Show all rankings for owner


## Sales Month Navigation
- [x] Add month state and navigation UI (arrows like week navigation)
- [x] Parse date column to extract month
- [x] Filter sales data by selected month
- [x] Show month name in navigation (e.g., "October 2025")
- [x] Auto-detect available months from data
- [x] Fix date parsing for Google Sheets format (YYYY,M,D)


## Background Styling for Consistency
- [x] Add gradient background to Survey tab
- [x] Add gradient background to Calculator tab
- [x] Add gradient background to Expenses tab
- [x] Match purple theme from other tabs


## Updates Banner System
- [x] Create Updates sheet in Google Sheets with columns: ID, Message, Target (All/Team/Email), Date
- [x] Add fetchUpdates function to google-sheets.ts
- [x] Build NotificationBanner component with red styling
- [x] Add dismiss functionality with AsyncStorage
- [x] Integrate banner into Home screen
- [x] Add targeting logic (All, specific team, specific user)
- [x] Show banner until user dismisses it


## Debug Updates Banner
- [x] Add console logging to see if Updates are loading
- [x] Verify Updates sheet name matches exactly
- [x] Check if updates state is being set correctly
- [x] Verify targeting logic is working
- [x] Add temporary debug display to show updates count
- [x] Fixed: Row 2 had formatting issue, recreated and now works


## Access Control
- [x] Check if logged-in user email exists in Employees sheet
- [x] Show Access Denied screen if not authorized
- [x] Allow logout for unauthorized users
- [ ] Test with authorized and unauthorized emails
- [x] Update app name to Phoenix DM in app.config.ts


## Web Export for Custom Domain
- [ ] Run expo export for web
- [ ] Package build files
- [ ] Create deployment instructions
- [ ] Provide hosting recommendations

## Railway Deployment
- [x] Create railway.json configuration
- [x] Document required environment variables
- [x] Add Procfile for Railway
- [x] Create deployment guide
- [ ] Test production build


## Railway Build Fix
- [x] Update package.json build command
- [x] Fix esbuild configuration
- [ ] Push fix to GitHub
- [ ] Redeploy on Railway


## Login System Bug Fix
- [x] Fix auth.ts to read from "Logins" tab instead of "Sheet2"
- [x] Add console logging to debug login validation
- [ ] Test login with bri@investorplug.io and password Phoenix123!
- [ ] Verify role-based access control works after login


## Role-Based Access Control Update
- [x] Create role-utils.ts helper functions for role checking
- [x] Update role checking to treat VO, Owner, CEO, COO, Director as full access roles
- [x] Update UserProfileSelector to show all profiles for executive roles
- [x] Update home screen profile selector visibility for executive roles
- [x] Update sales.tsx to use role-utils
- [ ] Test with different executive role titles


## React Hooks Error Fix
- [x] Fix "Rendered more hooks than during the previous render" error in TabLayout
- [x] Moved useColorScheme and useSafeAreaInsets to top of component
- [x] Ensure all hooks are called in the same order every render (before any returns)
