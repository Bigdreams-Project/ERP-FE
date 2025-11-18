# Deployment Guide

## Current Status
- **Production Branch**: `epic/academic-module`
- **Latest Commit**: `3532ded` - "chore: trigger Vercel deployment for Payment Type fix"

## Manual Deployment Trigger

If Vercel is not automatically deploying after pushing commits, use one of these methods:

### Method 1: Vercel Dashboard (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to **Deployments** tab
4. Find the latest deployment
5. Click the **"..."** menu → **"Redeploy"**
6. Select the branch: `epic/academic-module`
7. Click **"Redeploy"**

### Method 2: Vercel CLI
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link project (if not already linked)
vercel link

# Deploy to production
vercel --prod
```

### Method 3: GitHub Actions
1. Go to GitHub repository
2. Navigate to **Actions** tab
3. Select **"Trigger Vercel Deployment"** workflow
4. Click **"Run workflow"**
5. Select branch: `epic/academic-module`
6. Click **"Run workflow"**

## Troubleshooting

### Verify Webhook Configuration
Run the webhook verification tool:
```bash
npm run verify-webhook
```

This will provide:
- Direct links to check webhook status
- Step-by-step verification instructions
- Common issues and fixes
- Manual testing options

### Check Webhook Status
1. Go to GitHub repository → **Settings** → **Webhooks**
   - Direct link: https://github.com/Tec-Terminal/Tec-Terminal-Frontend-2.0/settings/hooks
2. Look for Vercel webhook (URL contains `vercel.com`)
3. Verify it's **Active** (green checkmark)
4. Check **Recent Deliveries** tab for recent activity
5. Look for any failed deliveries (red X)

### Verify Branch Connection
1. Go to Vercel Dashboard → Your Project → **Settings** → **Git**
2. Verify `epic/academic-module` is listed and connected
3. Check if it's set as the **Production Branch**
4. Ensure repository connection is active

### Check Deployment Logs
1. Go to Vercel Dashboard → **Deployments**
2. Check for any failed deployments
3. Review build logs for errors
4. Verify latest commits triggered deployments

### Fix Webhook Issues
See detailed guide: `scripts/fix-webhook.md`

## Quick Commands

```bash
# Check deployment status
npm run check-deployment

# View recent commits
git log --oneline -5

# Check branch status
git status

# Push latest changes
git push origin epic/academic-module
```

## Recent Changes
- ✅ Fixed duplicate Payment Type field ID conflict
- ✅ Added Payment Type selection (Current Price/Old Price)
- ✅ Added Center field to student details
- ✅ Fixed NaN handling in payment displays
- ✅ Fixed date validation issues

