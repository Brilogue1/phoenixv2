# Phoenix App Design Specification

## Overview
Phoenix is a mobile app for managing travel itineraries, expenses, and team communication for Phoenix Direct Marketing. The app features a premium gradient design with role-based access control.

## Design Philosophy
- **Mobile portrait orientation (9:16)** - Optimized for one-handed usage
- **Flashy but professional** - Gradient backgrounds, modern cards, clean typography
- **iOS Human Interface Guidelines** - Native iOS feel with bottom navigation
- **Role-based UI** - Different views for Owners, Team Leads, and Reps

## Color Palette

### Primary Colors
- **Blue**: `#4A5FE8` (primary brand color)
- **Purple**: `#8B5CF6` (secondary accent)
- **Gradient Background**: Linear gradient from `#4A5FE8` to `#8B5CF6`

### Neutral Colors
- **Text Primary**: `#11181C` (light mode), `#ECEDEE` (dark mode)
- **Text Secondary**: `#687076` (light mode), `#9BA1A6` (dark mode)
- **Background**: `#FFFFFF` (light mode), `#151718` (dark mode)
- **Card Background**: `#FFFFFF` with subtle shadow

### Accent Colors
- **Blue Accent**: `#007AFF` (iOS blue)
- **Green (Success)**: `#34C759` (for amounts, WhatsApp)
- **Orange**: `#FF9500` (for hotel cards)
- **Red**: `#FF3B30` (for errors, logout)

## Typography

### Font Sizes
- **Title**: 32pt, bold, line-height 40pt
- **Subtitle**: 20pt, bold, line-height 28pt
- **Body**: 16pt, regular, line-height 24pt
- **Body Semibold**: 16pt, semibold, line-height 24pt
- **Caption**: 12pt, regular, line-height 16pt

### Font Family
- iOS: System (San Francisco)
- Android: Roboto
- All text uses ThemedText component for dark/light mode support

## Spacing & Layout

### Spacing Scale (8pt grid)
- **xs**: 4pt
- **sm**: 8pt
- **md**: 12pt
- **lg**: 16pt
- **xl**: 24pt
- **2xl**: 32pt

### Border Radius
- **Buttons**: 8pt
- **Cards**: 12pt
- **Bottom Sheets**: 16pt (top corners only)
- **Profile Avatar**: 50% (circular)

### Safe Areas
- Always use `useSafeAreaInsets()` for top/bottom padding
- Minimum touch target: 44pt × 44pt
- Bottom navigation respects safe area insets

## Screen List

### 1. Authentication Screens
- **Login Screen**: Email/password form with Phoenix logo
- **Sign Up Screen**: Email, password, confirm password

### 2. Home Screen (Itinerary)
**Primary Content:**
- User profile card (name, team, avatar)
- Week navigation (arrows + date range display)
- Flight information card
- Rental car information card
- Hotel/event information card (team-based)

**Key User Flows:**
- User taps left/right arrows → Navigate between weeks
- User taps profile → Opens profile/settings
- User taps hamburger menu → Opens team directory

### 3. Expenses Screen
**Primary Content:**
- Expense submission form
  - Category dropdown
  - Amount input
  - Payment method selector
  - Notes textarea
  - Receipt photo upload
  - Submit button
- Recent submissions list (with status badges)

**Key User Flows:**
- User fills form → Taps submit → Data sent to Google Sheets → Success message
- User taps recent expense → View details

### 4. Team Directory (Hamburger Menu)
**Primary Content:**
- Search bar
- Team member cards (filtered by user's team)
  - Avatar with initials
  - Name and title
  - Team badge
  - Phone number
  - WhatsApp call button
  - Email button

**Key User Flows:**
- User searches name → List filters
- User taps WhatsApp button → Opens WhatsApp with phone number
- User taps email → Opens email client

### 5. Survey Screen (iframe)
- Embedded iframe: survey.phoenixdm.co

### 6. Calculator Screen (iframe)
- Embedded iframe: calculator.phoenixdm.co

### 7. Payroll Screen
- Static content with compensation plan table
- Commission structure information
- Bonus structure details

### 8. Sales Screen (Placeholder)
- Coming soon message
- Will be populated later with sales data

## Component Specifications

### User Profile Card
- White rounded card with shadow
- Circular avatar (48pt diameter)
- Name in bold (20pt)
- Team name in gray (14pt)
- Positioned below Phoenix logo

### Week Navigation
- White pill-shaped container
- Blue gradient border
- Date range text centered (16pt, bold)
- Left/right arrow buttons (44pt touch target)
- Arrows change opacity when disabled

### Itinerary Cards
- White background, 12pt border radius
- Colored left border accent (4pt width)
  - Flight: Blue `#007AFF`
  - Rental Car: Purple `#8B5CF6`
  - Hotel: Orange `#FF9500`
- Icon + heading at top
- Data displayed in key-value pairs
- 16pt padding inside card
- 12pt margin between cards

### Bottom Navigation
- 6 tabs: Home, Survey, Calculator, Expenses, Payroll, Sales
- Icons: 24pt size
- Active tab: Blue color
- Inactive tabs: Gray color
- Labels: 10pt below icons
- Respects safe area insets

### Expense Form
- Input fields with 8pt border radius
- Light gray border
- 12pt padding inside inputs
- Labels in bold (14pt)
- Submit button: Full-width gradient blue-purple, 48pt height

### Team Member Cards
- White background, 12pt border radius
- Colored left border (team-specific color)
- Avatar on left (40pt diameter)
- Name and title stacked
- WhatsApp button: Green `#34C759`, rounded
- Email button: Gray, rounded

## Access Control UI Behavior

### Owner View
- Sees ALL teams in team directory
- Can switch between teams in itinerary (dropdown selector)
- All data visible

### Team Lead View
- Sees only their team in team directory
- Can see all team members' itineraries
- Team selector shows only their team

### Rep View
- Sees only their team members in directory
- Can only see their own itinerary
- No team selector

## Animations & Interactions

### Tap Feedback
- All buttons use haptic feedback (light impact)
- Buttons scale down to 0.95 on press
- Opacity reduces to 0.8 on press

### Page Transitions
- Slide from right for navigation
- Slide from bottom for modals
- Fade for tab switches

### Loading States
- Skeleton screens for data loading
- Spinner for form submissions
- Pull-to-refresh on itinerary screen

## Icons

### Tab Bar Icons (SF Symbols / Material Icons)
- Home: `house.fill` / `home`
- Survey: `doc.text.fill` / `assignment`
- Calculator: `plusminus.circle.fill` / `calculate`
- Expenses: `dollarsign.circle.fill` / `receipt`
- Payroll: `banknote.fill` / `attach-money`
- Sales: `chart.bar.fill` / `trending-up`

### Action Icons
- WhatsApp: Custom WhatsApp logo (green)
- Email: `envelope.fill` / `email`
- Menu: `line.3.horizontal` / `menu`
- Arrow Left: `chevron.left` / `chevron-left`
- Arrow Right: `chevron.right` / `chevron-right`

## Responsive Behavior
- All layouts adapt to different screen sizes
- Minimum width: 320pt (iPhone SE)
- Maximum width: 428pt (iPhone Pro Max)
- Cards stack vertically on all sizes
- Text scales with accessibility settings
