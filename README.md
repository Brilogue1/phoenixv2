# Phoenix DM - Team Management App

A Progressive Web App (PWA) for Phoenix Direct Marketing team management, built with Expo, React Native, and Google Sheets integration.

## Features

- ✅ **Home Tab**: View travel itinerary (flights, hotels, rental cars) by week
- ✅ **Survey Tab**: Embedded GHL survey
- ✅ **Calculator Tab**: Timeshare calculator
- ✅ **Expenses Tab**: Submit expense reports with photos
- ✅ **Payroll Tab**: View commission structure and bonus program
- ✅ **Sales Tab**: Track sales performance by month with team rankings
- ✅ **Updates Banner**: Red notification system for team announcements
- ✅ **Access Control**: Employee verification via Google Sheets
- ✅ **PWA Support**: Add to home screen like a native app
- ✅ **Role-Based Access**: Owner sees all, Team Leads see team, Reps see own data

## Tech Stack

- **Frontend**: React Native (Expo SDK 54), TypeScript, React 19
- **Backend**: Node.js, Express, tRPC
- **Database**: PostgreSQL (via Drizzle ORM)
- **Authentication**: OAuth 2.0
- **Data Source**: Google Sheets (public CSV export)
- **Styling**: React Native StyleSheet with gradient backgrounds

## Quick Start (Development)

### Prerequisites
- Node.js 22+
- pnpm 9+

### Install Dependencies
```bash
pnpm install
```

### Run Development Server
```bash
pnpm dev
```

This starts:
- Backend server on port 3000
- Expo Metro bundler on port 8081
- Web app at http://localhost:8081

### Access the App
- **Web**: Open http://localhost:8081 in browser
- **Mobile**: Scan QR code with Expo Go app

## Project Structure

```
phoenix-app/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home (itinerary)
│   │   ├── survey.tsx     # Survey iframe
│   │   ├── calculator.tsx # Calculator iframe
│   │   ├── expenses.tsx   # Expense submission
│   │   ├── payroll.tsx    # Payroll info
│   │   └── sales.tsx      # Sales dashboard
│   └── oauth/             # OAuth callback
├── components/            # Reusable components
│   ├── gradient-background.tsx
│   ├── notification-banner.tsx
│   ├── access-denied.tsx
│   └── ui/               # UI components
├── lib/                  # Utilities
│   └── google-sheets.ts  # Google Sheets integration
├── hooks/                # Custom React hooks
│   ├── use-auth.ts
│   └── use-user-profile.ts
├── server/               # Backend API
│   └── _core/           # Server core
├── constants/            # App constants
│   └── theme.ts         # Colors and fonts
└── assets/              # Images and icons
```

## Google Sheets Integration

The app pulls data from a public Google Sheet with these tabs:

- **Employees**: Name, Email, Role, Team
- **Flights**: Week, Rep, Date, Confirmation, Arrival/Departure, Cost
- **Rental Cars**: Week, Rep, Date, Vendor, Confirmation, Pickup/Return
- **Hotel Info**: Week, Team, Hotel Name, Address, Check-in/Check-out
- **Sales**: Date, Team, Rep Name, Rep Email, Client, Sale Price, Commission
- **Updates**: ID, Message, Target (All/Team/Email), Date

### Sheet Format
The sheet must be published to web (File → Share → Publish to web → CSV).

Sheet ID: `1gi2N5tDW98zRPjKcSNHAuEH57XYW8uufbTjXbHUCIOI`

## Deployment

See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed deployment instructions to Railway with custom domain.

### Quick Deploy to Railway
1. Push code to GitHub
2. Connect GitHub repo to Railway
3. Add environment variables (see deployment guide)
4. Add PostgreSQL database
5. Connect custom domain (app.phoenixdm.co)

## Environment Variables

Required environment variables for production:

```bash
NODE_ENV=production
EXPO_PORT=8081
OAUTH_CLIENT_ID=your_oauth_client_id
OAUTH_CLIENT_SECRET=your_oauth_client_secret
OAUTH_REDIRECT_URI=https://app.phoenixdm.co/api/auth/callback
SESSION_SECRET=your_random_secret
DATABASE_URL=postgresql://...
APP_URL=https://app.phoenixdm.co
```

## PWA Configuration

The app is configured as a PWA with:
- **Name**: Phoenix DM
- **Theme Color**: #5B6FED (purple-blue)
- **Icons**: Phoenix logo (192x192, 512x512)
- **Display**: Standalone
- **Orientation**: Portrait

Users can "Add to Home Screen" from their mobile browser.

## Access Control

Only users whose email exists in the Employees sheet can access the app. Unauthorized users see an "Access Denied" screen with logout option.

## Updates Banner System

Admins can add notifications in the Updates sheet:
- **Target "All"**: Shows to everyone
- **Target "KYT2"**: Shows only to KYT2 team members
- **Target "email@example.com"**: Shows only to specific user

Users can dismiss notifications, which are stored locally via AsyncStorage.

## Development Notes

- **Hot Reload**: Changes auto-reload in development
- **TypeScript**: Strict mode enabled
- **Linting**: ESLint with Expo config
- **Testing**: Vitest configured (run with `pnpm test`)

## Support

For issues or questions:
- Check the deployment guide
- Review Railway logs
- Verify Google Sheets are published
- Confirm environment variables are set

## License

Proprietary - Phoenix Direct Marketing

---

**Built with ❤️ for the Phoenix DM team**
