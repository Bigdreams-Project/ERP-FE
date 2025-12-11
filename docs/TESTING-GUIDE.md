# Testing Guide for Payment Type Feature

## How to Test Locally

### 1. Start Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000`

### 2. Test Payment Type Feature

#### Step 1: Navigate to Students Section
- Login to the application
- Go to **Academic** → **Students** tab
- Click the **"Enroll Student"** button (usually on the far right)

#### Step 2: Test Payment Type Selection

**Test Case 1: Current Price**
1. Fill in student basic information (Name, Phone, Email, etc.)
2. Select a **Course** (Graphic, Web, or Data)
3. After selecting a course, verify:
   - ✅ **"Payment Type"** dropdown appears
   - ✅ Options: "Select Payment Type", "Current Price", "Old Price"
4. Select **"Current Price"**
5. Verify:
   - ✅ **"Course Fee"** field appears
   - ✅ Course fee is displayed as **readonly** (grayed out)
   - ✅ Fee shows correct amount:
     - Graphic: ₦500,000
     - Web: ₦750,000
     - Data: ₦600,000
   - ✅ Fee is formatted with commas (₦500,000)

**Test Case 2: Old Price**
1. Select a **Course**
2. Select **"Old Price"** from Payment Type
3. Verify:
   - ✅ **"Course Fee"** field appears
   - ✅ Field is **editable** (not grayed out)
   - ✅ Placeholder shows: "Enter old fee..."
4. Enter a custom fee (e.g., 400000)
5. Verify:
   - ✅ Only numeric values are accepted
   - ✅ Lump Sum/Installment amounts recalculate based on custom fee

#### Step 3: Test Form Submission
1. Complete all required fields
2. Select Payment Plan (Lump Sum or Installment)
3. Enter Amount Paid
4. Click **"Enroll"** button
5. Verify:
   - ✅ Student is enrolled successfully
   - ✅ Success toast message appears
   - ✅ Modal closes

#### Step 4: Test Student Details View
1. Click on an enrolled student to view details
2. Verify:
   - ✅ **Center** field is displayed
   - ✅ **Course** name is displayed correctly
   - ✅ Payment history shows correctly
   - ✅ No "Invalid" dates
   - ✅ No NaN values in payment displays

### 3. Test Edge Cases

**Edge Case 1: No Course Selected**
- Verify Payment Type dropdown does NOT appear until course is selected

**Edge Case 2: Switch Between Payment Types**
- Select "Current Price" → verify readonly fee
- Change to "Old Price" → verify editable field appears
- Change back to "Current Price" → verify readonly fee returns

**Edge Case 3: Invalid Old Price Entry**
- Enter non-numeric characters → should be filtered out
- Leave empty → should use base fee as fallback

**Edge Case 4: Course Fee Recalculation**
- Select "Old Price" and enter custom fee
- Change Payment Plan (Lump Sum ↔ Installment)
- Verify amounts recalculate correctly

### 4. Build Test
```bash
npm run build
```
- Verify no TypeScript errors
- Verify no build errors
- All files compile successfully

## Expected Behavior Summary

✅ Payment Type dropdown appears after course selection
✅ Current Price shows readonly, formatted fee
✅ Old Price shows editable field with placeholder
✅ Course Fee field only appears when Payment Type is selected
✅ Form submission works correctly
✅ Student details view shows Center and Course correctly
✅ No console errors
✅ No build errors

## Issues to Report

If you encounter:
- Payment Type dropdown not appearing
- Course Fee not displaying correctly
- Form submission errors
- Build/TypeScript errors
- Missing fields in student details view

Note the exact steps to reproduce and any error messages.

