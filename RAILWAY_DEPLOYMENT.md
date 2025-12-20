# Phoenix DM - Railway Deployment Guide

This guide will help you deploy Phoenix DM to Railway with your custom domain (app.phoenixdm.co).

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Account**: You'll need to push the code to GitHub first
3. **Custom Domain**: app.phoenixdm.co (you already have this)
4. **Google Sheets**: Your existing sheet with Employees, Flights, Hotels, Sales, Updates tabs

---

## Step 1: Push Code to GitHub

### 1.1 Download Your Project Files
Download all files from the Manus project to your local computer.

### 1.2 Create GitHub Repository
1. Go to [github.com](https://github.com) and create a new repository
2. Name it `phoenix-dm-app` (or whatever you prefer)
3. Make it **Private** (recommended for business apps)
4. Don't initialize with README (we already have files)

### 1.3 Push Code to GitHub
```bash
cd phoenix-dm-app  # Your downloaded project folder
git init
git add .
git commit -m "Initial commit - Phoenix DM app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/phoenix-dm-app.git
git push -u origin main
```

---

## Step 2: Deploy to Railway

### 2.1 Create New Project
1. Go to [railway.app](https://railway.app/new)
2. Click **"Deploy from GitHub repo"**
3. Connect your GitHub account if not already connected
4. Select your `phoenix-dm-app` repository

### 2.2 Configure Build Settings
Railway should auto-detect the Node.js/Expo setup. If not:
- **Build Command**: `pnpm install && pnpm build`
- **Start Command**: `pnpm start`
- **Port**: Railway will auto-assign (usually 3000 or 8080)

---

## Step 3: Add Environment Variables

In Railway project settings, add these environment variables:

### Required Variables

```bash
# Node Environment
NODE_ENV=production

# App Configuration
EXPO_PORT=8081

# Google Sheets (Public - Read Only)
# Your sheet is already public, so no API key needed for read operations
# The app uses direct CSV export URLs

# OAuth Configuration (Manus OAuth)
# These are provided by Manus - you'll need to contact Manus support
# or set up your own OAuth provider
OAUTH_CLIENT_ID=your_oauth_client_id
OAUTH_CLIENT_SECRET=your_oauth_client_secret
OAUTH_REDIRECT_URI=https://your-railway-domain.railway.app/api/auth/callback

# Session Secret (generate a random string)
SESSION_SECRET=your_random_secret_here_make_it_long_and_random

# Database (Railway provides PostgreSQL)
# Add a PostgreSQL database in Railway, it will auto-populate DATABASE_URL
DATABASE_URL=postgresql://...

# App URL (will be your Railway domain initially, then your custom domain)
APP_URL=https://your-railway-domain.railway.app
```

### How to Generate SESSION_SECRET
Run this in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 4: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database" → "PostgreSQL"**
3. Railway will automatically create `DATABASE_URL` environment variable
4. Run database migrations (Railway should do this automatically on deploy)

---

## Step 5: Configure OAuth

### Option A: Use Manus OAuth (Recommended for now)
Contact Manus support to get OAuth credentials for your production domain.

### Option B: Set Up Your Own OAuth
If you want independent authentication:
1. Set up Auth0, Clerk, or similar
2. Update the OAuth configuration in the code
3. Add the new OAuth credentials to Railway environment variables

---

## Step 6: Connect Custom Domain

### 6.1 Get Railway Domain
After deployment, Railway gives you a domain like:
`phoenix-dm-production.up.railway.app`

### 6.2 Add Custom Domain in Railway
1. Go to your Railway project **Settings**
2. Click **"Domains"**
3. Click **"Custom Domain"**
4. Enter: `app.phoenixdm.co`

### 6.3 Update DNS Settings
Railway will show you what DNS records to add:

**For app.phoenixdm.co:**
- Type: **CNAME**
- Name: **app**
- Value: **your-project.up.railway.app** (provided by Railway)
- TTL: **3600**

Add this in your DNS provider (GoDaddy, Cloudflare, Namecheap, etc.)

### 6.4 Update Environment Variables
Once your custom domain is working, update in Railway:
```bash
APP_URL=https://app.phoenixdm.co
OAUTH_REDIRECT_URI=https://app.phoenixdm.co/api/auth/callback
```

---

## Step 7: Test Deployment

### 7.1 Check Health
Visit: `https://app.phoenixdm.co`

You should see the Phoenix DM app with the purple gradient.

### 7.2 Test Features
- ✅ Login with employee email
- ✅ View Home tab (flights, hotels, rental cars)
- ✅ Check Sales tab (month navigation)
- ✅ Test Updates banner (add a test update in Google Sheets)
- ✅ Try Survey and Calculator iframes
- ✅ Test "Add to Home Screen" on mobile

### 7.3 Test Access Control
- Login with an email NOT on your Employees sheet
- Should see "Access Denied" screen
- Logout button should work

---

## Step 8: Monitor and Maintain

### View Logs
In Railway dashboard:
1. Click your project
2. Go to **"Deployments"**
3. Click latest deployment
4. View **"Logs"** tab

### Redeploy
Railway auto-deploys when you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push
```

Railway will automatically rebuild and redeploy.

---

## Troubleshooting

### App Won't Start
- Check Railway logs for errors
- Verify all environment variables are set
- Make sure `pnpm build` succeeded

### Login Not Working
- Verify `OAUTH_REDIRECT_URI` matches your domain
- Check OAuth credentials are correct
- Ensure `SESSION_SECRET` is set

### Google Sheets Not Loading
- Verify your Google Sheet is published to web
- Check sheet ID in code matches your sheet
- Test sheet URL directly in browser

### Database Errors
- Verify `DATABASE_URL` is set
- Check if migrations ran successfully
- View Railway logs for SQL errors

---

## Cost Estimate

**Railway Pricing:**
- **Hobby Plan**: $5/month (500 hours execution time)
- **Pro Plan**: $20/month (unlimited execution time)

For a small team app, the Hobby plan should be sufficient.

---

## Support

If you run into issues:
1. Check Railway logs first
2. Verify all environment variables
3. Test the Manus dev URL to confirm it's not a code issue
4. Contact Railway support or Manus support for OAuth issues

---

## Next Steps After Deployment

1. **Share with team**: Send `app.phoenixdm.co` to employees
2. **Add more data**: Update Google Sheets with more months of sales data
3. **Monitor usage**: Check Railway dashboard for performance
4. **Add features**: Connect Expenses form to Google Sheets, add YTD sales summary

---

**Questions?** Refer back to this guide or check the Railway documentation at [docs.railway.app](https://docs.railway.app).
