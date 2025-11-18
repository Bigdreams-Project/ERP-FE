#!/usr/bin/env node

/**
 * Vercel Webhook Verification Script
 * Helps verify and troubleshoot Vercel webhook configuration
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔍 Vercel Webhook Verification Tool\n');
console.log('='.repeat(50));

// Get repository information
try {
  const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
  const repoMatch = remoteUrl.match(/github\.com[\/:]([\w\-]+\/[\w\-]+)(?:\.git)?/);
  const repo = repoMatch ? repoMatch[1] : 'unknown';
  
  console.log('\n📦 Repository Information:');
  console.log(`   Repository: ${repo}`);
  console.log(`   Remote URL: ${remoteUrl}`);
  
  const currentBranch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
  console.log(`   Current Branch: ${currentBranch}`);
  
  const latestCommit = execSync('git log -1 --oneline', { encoding: 'utf-8' }).trim();
  console.log(`   Latest Commit: ${latestCommit}`);
  
  console.log('\n' + '='.repeat(50));
  console.log('\n✅ Manual Verification Steps:\n');
  
  console.log('1️⃣  CHECK GITHUB WEBHOOK CONFIGURATION:');
  console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   📍 URL: https://github.com/${repo}/settings/hooks`);
  console.log('   Steps:');
  console.log('   • Look for webhook with URL containing "vercel.com"');
  console.log('   • Verify Status is "Active" (green checkmark)');
  console.log('   • Check "Recent Deliveries" tab for recent activity');
  console.log('   • Verify events: push, pull_request (if enabled)');
  console.log('   • Check for any failed deliveries (red X)');
  
  console.log('\n2️⃣  CHECK VERCEL PROJECT SETTINGS:');
  console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('   📍 URL: https://vercel.com/dashboard');
  console.log('   Steps:');
  console.log('   • Select your project');
  console.log('   • Go to Settings → Git');
  console.log(`   • Verify "${currentBranch}" branch is connected`);
  console.log('   • Check if it\'s set as "Production Branch"');
  console.log('   • Verify repository connection is active');
  
  console.log('\n3️⃣  CHECK VERCEL DEPLOYMENT LOGS:');
  console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('   📍 URL: https://vercel.com/dashboard → Deployments');
  console.log('   Steps:');
  console.log('   • Look for deployments from recent commits');
  console.log('   • Check if latest commit triggered a deployment');
  console.log('   • Review build logs for any errors');
  console.log('   • Check deployment status (Ready, Building, Error)');
  
  console.log('\n4️⃣  COMMON ISSUES & FIXES:');
  console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('   ❌ Webhook not receiving events:');
  console.log('      → Re-create webhook in Vercel Settings → Git');
  console.log('      → Or manually add webhook in GitHub Settings → Webhooks');
  console.log('');
  console.log('   ❌ Branch not connected in Vercel:');
  console.log('      → Go to Vercel Settings → Git');
  console.log('      → Click "Connect Git Repository" if needed');
  console.log(`      → Ensure "${currentBranch}" is selected`);
  console.log('');
  console.log('   ❌ Webhook secret mismatch:');
  console.log('      → Vercel and GitHub webhook secret must match');
  console.log('      → Check in both Vercel and GitHub settings');
  console.log('');
  console.log('   ❌ Branch protection rules:');
  console.log('      → Check if branch has protection rules');
  console.log('      → Ensure Vercel has permission to push/deploy');
  
  console.log('\n5️⃣  TEST WEBHOOK MANUALLY:');
  console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('   Option A: Create empty commit to trigger webhook');
  console.log('      git commit --allow-empty -m "test: trigger webhook"');
  console.log(`      git push origin ${currentBranch}`);
  console.log('');
  console.log('   Option B: Manually trigger in Vercel Dashboard');
  console.log('      → Go to Deployments → Click "Redeploy"');
  console.log('      → Select latest commit → Deploy');
  console.log('');
  console.log('   Option C: Use GitHub Actions workflow');
  console.log('      → Go to Actions → "Trigger Vercel Deployment"');
  console.log('      → Run workflow manually');
  
  console.log('\n' + '='.repeat(50));
  console.log('\n📋 Quick Links:');
  console.log(`   GitHub Webhooks: https://github.com/${repo}/settings/hooks`);
  console.log('   Vercel Dashboard: https://vercel.com/dashboard');
  console.log(`   GitHub Repository: https://github.com/${repo}`);
  
  console.log('\n💡 Tip: If webhook is not working, you can always manually');
  console.log('   trigger deployments from the Vercel dashboard.\n');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

