# Quick Webhook Fix Guide

## 🚨 If Deployments Aren't Triggering Automatically

### Step 1: Run Verification Tool
```bash
npm run verify-webhook
```

### Step 2: Check GitHub Webhook (2 minutes)
1. Go to: https://github.com/Tec-Terminal/Tec-Terminal-Frontend-2.0/settings/hooks
2. Find webhook with `vercel.com` in URL
3. Check status:
   - ✅ **Active** = Good
   - ❌ **Inactive** = Go to Step 3

### Step 3: Re-create Webhook (5 minutes)
**Easiest Method:**
1. Vercel Dashboard → Your Project
2. Settings → Git
3. Click **"Disconnect"** then **"Connect Git Repository"**
4. Select repository
5. Vercel auto-creates webhook ✅

### Step 4: Verify Branch (1 minute)
1. Vercel Dashboard → Settings → Git
2. Ensure `epic/academic-module` is connected
3. Set as **Production Branch** if needed

### Step 5: Test (1 minute)
```bash
git commit --allow-empty -m "test: webhook"
git push origin epic/academic-module
```
Then check Vercel dashboard for new deployment.

## ⚡ Quick Manual Deploy (Bypass Webhook)
If webhook still doesn't work:
1. Vercel Dashboard → Deployments
2. Click **"..."** → **"Redeploy"**
3. Select branch: `epic/academic-module`
4. Click **"Redeploy"**

## 📞 Still Not Working?
1. Check `scripts/fix-webhook.md` for detailed troubleshooting
2. Review webhook delivery logs in GitHub
3. Check Vercel build logs for errors
4. Verify branch protection rules aren't blocking

