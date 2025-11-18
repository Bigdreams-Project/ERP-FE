#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Checks git status and provides deployment information
 */

const { execSync } = require('child_process');

console.log('🔍 Checking deployment status...\n');

try {
  // Get current branch
  const branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
  console.log(`📌 Current branch: ${branch}`);

  // Get latest commit
  const latestCommit = execSync('git log -1 --oneline', { encoding: 'utf-8' }).trim();
  console.log(`📝 Latest commit: ${latestCommit}`);

  // Get remote URL
  const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
  console.log(`🔗 Remote: ${remoteUrl}`);

  // Check if branch is pushed
  const status = execSync('git status -sb', { encoding: 'utf-8' }).trim();
  const isAhead = status.includes('ahead');
  const isBehind = status.includes('behind');

  console.log(`\n📊 Git Status:`);
  if (isAhead) {
    console.log('⚠️  Local branch is ahead of remote - commits need to be pushed');
  } else if (isBehind) {
    console.log('⚠️  Local branch is behind remote - pull needed');
  } else {
    console.log('✅ Branch is up to date with remote');
  }

  console.log(`\n🚀 Deployment Instructions:`);
  console.log(`1. Go to Vercel Dashboard: https://vercel.com/dashboard`);
  console.log(`2. Select your project`);
  console.log(`3. Go to "Deployments" tab`);
  console.log(`4. Click "Redeploy" on the latest deployment`);
  console.log(`   OR`);
  console.log(`5. Go to "Settings" → "Git"`);
  console.log(`6. Verify "${branch}" is connected as production branch`);
  console.log(`7. Check webhook status in GitHub: Settings → Webhooks`);

  console.log(`\n📦 Latest commits on ${branch}:`);
  const commits = execSync('git log -5 --oneline', { encoding: 'utf-8' }).trim();
  console.log(commits);

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

