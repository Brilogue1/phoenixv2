# Render Deployment Guide (Pre-built Approach)

This guide explains how to deploy the Phoenix DM app to Render using pre-built files.

## Why Pre-built?

Expo's Metro bundler has issues in CI/CD environments (hangs during `expo export`). By building locally in the Manus sandbox and committing the built files, we bypass this issue entirely.

## Files Committed

- `dist-web/` - Pre-built Expo web app (static files)
- `dist/` - Pre-built server bundle (Node.js)

## Render Configuration

### Build Command
```bash
echo "Using pre-built files, no build needed"
```

### Start Command
```bash
node dist/index.js
```

### Environment Variables
Make sure these are set in Render:
- `DATABASE_URL` - Internal Database URL from your Render PostgreSQL
- `NODE_ENV=production`
- `PORT=10000`
- `GOOGLE_SHEET_ID` - Your Google Sheets ID

## Deployment Steps

1. **Build locally** (already done in Manus sandbox):
   ```bash
   pnpm build
   ```

2. **Commit built files**:
   ```bash
   git add dist dist-web .gitignore
   git commit -m "Add pre-built files for deployment"
   git push origin main
   ```

3. **Update Render settings**:
   - Go to your web service settings
   - Update Build Command to: `echo "Using pre-built files, no build needed"`
   - Keep Start Command as: `node dist/index.js`
   - Save and deploy

4. **Verify deployment**:
   - Check logs for `[api] server listening on port 10000`
   - Visit your Render URL
   - Test the app functionality

## Updating the App

When you make code changes:

1. Build in Manus sandbox: `pnpm build`
2. Commit the updated `dist` and `dist-web` folders
3. Push to GitHub
4. Render auto-deploys

## Custom Domain

Once deployed successfully:
1. Go to Render → Your Service → Settings → Custom Domains
2. Add `app.phoenixdm.co`
3. Update your DNS records as instructed by Render

## OAuth Configuration

After deployment, update OAuth settings:
1. Set redirect URI to your production domain
2. Update environment variables if needed
