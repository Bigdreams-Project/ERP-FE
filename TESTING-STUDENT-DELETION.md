# Testing Student Deletion Feature (Frontend Only)

## Build Status
✅ **Build successful** - All code compiles without errors

## What to Test

### 1. **UI Components Visibility**
- Navigate to `/dashboard/academic/students`
- The delete button should only appear in the Actions dropdown for ADMIN users
- For non-ADMIN users, the delete button should not be visible

### 2. **Student Delete Modal**
- Click the "Delete" button in the Actions dropdown (as ADMIN)
- You should see a two-step modal:
  - **Step 1**: Choose between "Archive (Soft Delete)" or "Permanently Remove (Hard Delete)"
  - **Step 2**: Confirmation screen with warnings

### 3. **Modal Features**
- Student information should be displayed (name, email, student ID)
- For hard delete, warnings should appear if:
  - Student has payment records
  - Student has course enrollments
  - Test email detection (test@example.com, er@gmail.com)

### 4. **Student Details Page**
- Navigate to a student detail page: `/dashboard/academic/students/[id]`
- If you're ADMIN, you should see a "Delete" button in the header
- If student is archived (has `deletedAt`), you should see an "Archived" badge
- Edit and Record Payment buttons should be disabled for archived students

### 5. **Filtering (Frontend Safety)**
- Soft-deleted students should be filtered out from:
  - Student list table
  - Batch rosters
  - Batch student counts

## Expected Behavior (Without Backend)

Since the backend isn't implemented yet, you'll see:

1. **API Calls Will Fail**: When you try to delete, you'll get error messages (this is expected)
2. **Error Handling**: The app should show error toasts but not crash
3. **UI Should Still Work**: All UI components should render correctly

## Testing Checklist

- [ ] Dev server starts without errors
- [ ] Student list page loads
- [ ] Delete button appears only for ADMIN (check browser console for role check)
- [ ] Delete modal opens and shows two-step process
- [ ] Modal displays student information correctly
- [ ] Hard delete warnings appear when applicable
- [ ] Student details page shows delete button (ADMIN only)
- [ ] Archived badge appears for soft-deleted students
- [ ] Edit/Payment buttons are disabled for archived students
- [ ] No console errors (except expected API failures)

## Notes

- The `useIsAdmin` hook will fail silently if backend is unavailable (this is intentional)
- All delete operations will fail until backend endpoints are implemented
- Frontend filtering of soft-deleted students works independently of backend

## Next Steps

Once backend is ready:
1. Implement the endpoints as specified in the plan
2. Test the full flow end-to-end
3. Verify soft-deleted students are hidden from all views
4. Test hard delete restrictions (no financial activity)

