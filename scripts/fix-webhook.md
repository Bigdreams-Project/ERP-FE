# Fixing Vercel Webhook Configuration

## Quick Fix Guide

### Step 1: Verify GitHub Webhook

1. Go to: `https://github.com/Tec-Terminal/Tec-Terminal-Frontend-2.0/settings/hooks`
2. Look for Vercel webhook (URL contains `vercel.com`)
3. Check status:
   - ✅ **Active** = Working
   - ❌ **Inactive** = Needs fixing

### Step 2: Re-create Webhook (if needed)

#### Option A: Through Vercel (Recommended)
1. Go to Vercel Dashboard → Your Project
2. Settings → Git
3. Click "Disconnect" then "Connect Git Repository"
4. Select your repository
5. Vercel will automatically create the webhook

#### Option B: Manual GitHub Webhook
1. Go to GitHub → Settings → Webhooks
2. Click "Add webhook"
3. Payload URL: `https://api.vercel.com/v1/integrations/deploy/[YOUR_PROJECT_ID]`
   - Get this from Vercel Settings → Git
4. Content type: `application/json`
5. Secret: Get from Vercel Settings → Git
6. Events: Select "Just the push event"
7. Active: ✅ Checked
8. Click "Add webhook"

### Step 3: Verify Branch Connection

1. Vercel Dashboard → Settings → Git
2. Verify `epic/academic-module` is listed
3. Check "Production Branch" setting
4. Ensure it's set to `epic/academic-module`

### Step 4: Test Webhook

```bash
# Create test commit
git commit --allow-empty -m "test: verify webhook"
git push origin epic/academic-module

# Check Vercel dashboard for new deployment
```

### Step 5: Check Webhook Deliveries

1. GitHub → Settings → Webhooks
2. Click on Vercel webhook
3. Go to "Recent Deliveries" tab
4. Check for:
   - ✅ Green checkmarks = Success
   - ❌ Red X = Failed (click to see error)

## Common Errors

### Error: "Webhook not found"
- **Fix**: Re-create webhook through Vercel Settings → Git

### Error: "Invalid signature"
- **Fix**: Secret mismatch - re-sync in Vercel Settings → Git

### Error: "Branch not found"
- **Fix**: Ensure branch exists and is connected in Vercel

### Error: "Permission denied"
- **Fix**: Check GitHub repository permissions for Vercel integration

## Manual Deployment (Workaround)

If webhook continues to fail:

1. Vercel Dashboard → Deployments
2. Click "..." on any deployment
3. Select "Redeploy"
4. Choose branch: `epic/academic-module`
5. Click "Redeploy"

This bypasses the webhook and deploys directly.

