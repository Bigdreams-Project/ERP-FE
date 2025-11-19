#!/usr/bin/env node

/**
 * Check and report potential merge conflicts in files
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const filesToCheck = [
  'src/components/modals/academic/StudentModal.tsx',
  'src/components/academic/tables/Leads.table.tsx',
  'src/components/modals/academic/AddPaymentModal.tsx',
  'src/components/modals/academic/StudentEditModal.tsx',
  'src/content/dashboard/academic/students/StudentDetails.tsx',
  'src/content/dashboard/academic/students/index.tsx',
  'src/app/dashboard/academic/students/[student]/page.tsx',
  'src/lib/network.ts',
];

console.log('🔍 Checking for merge conflicts and issues...\n');

let hasIssues = false;

filesToCheck.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    hasIssues = true;
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check for conflict markers
  if (content.includes('<<<<<<< HEAD') || 
      content.includes('=======') || 
      content.includes('>>>>>>> ')) {
    console.log(`❌ CONFLICT MARKERS FOUND in: ${file}`);
    hasIssues = true;
    
    // Count conflict markers
    const headCount = (content.match(/<<<<<<< HEAD/g) || []).length;
    const equalCount = (content.match(/=======/g) || []).length;
    const arrowCount = (content.match(/>>>>>>> /g) || []).length;
    
    console.log(`   - <<<<<<< HEAD: ${headCount}`);
    console.log(`   - =======: ${equalCount}`);
    console.log(`   - >>>>>>> : ${arrowCount}`);
  } else {
    console.log(`✅ ${file}`);
  }
});

console.log('\n' + '='.repeat(50));

if (hasIssues) {
  console.log('\n❌ Issues found! Please resolve conflicts.');
  process.exit(1);
} else {
  console.log('\n✅ No conflict markers found in checked files.');
  process.exit(0);
}

