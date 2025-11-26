# Archive Student ID Generation - Frontend vs Backend

## Summary

**Student ID generation is handled by the FRONTEND** for archive records.

## Frontend Implementation

### Manual Archive Create (`ArchiveCreate.modal.tsx`)
- **Auto-generates** `oldStudentId` when user enters full name
- Format: `TT-{First2NameInitials}-00001`
- Example: "John Doe" → `TT-JD-00001`
- If name is missing, generates: `TT-XX-00001`

### Bulk Upload (`ArchiveUpload.modal.tsx`)
- **Auto-generates** `oldStudentId` for each record if not provided in Excel
- Uses same format: `TT-{First2NameInitials}-{index+1}`
- Example: First "John Doe" → `TT-JD-00001`, Second "Jane Smith" → `TT-JS-00002`

## ID Generation Logic

```typescript
const generateStudentId = (fullname: string, index: number = 0): string => {
  if (!fullname || fullname.trim() === "") {
    return `TT-XX-${String(index + 1).padStart(5, "0")}`;
  }

  // Extract first 2 initials from full name
  const nameParts = fullname.trim().split(/\s+/);
  let initials = "";

  if (nameParts.length >= 2) {
    // Take first letter of first name and first letter of second name
    initials = (nameParts[0][0] || "").toUpperCase() + (nameParts[1][0] || "").toUpperCase();
  } else if (nameParts.length === 1) {
    // If only one name, take first 2 letters
    const name = nameParts[0];
    initials = (name[0] || "").toUpperCase() + (name[1] || "X").toUpperCase();
  }

  // Ensure we have 2 characters
  if (initials.length < 2) {
    initials = initials.padEnd(2, "X");
  }

  // Format: TT-{INITIALS}-{00001}
  const number = String(index + 1).padStart(5, "0");
  return `TT-${initials}-${number}`;
};
```

## Fields Removed from Manual Create Form

1. **`newStudentId`** - Removed (backend will auto-generate this)
2. **`userNewId`** - Removed (not needed for archive records)

## Fields in Manual Create Form

1. Center *
2. Full Name * (auto-generates oldStudentId)
3. Old Student ID (Legacy ID) * (auto-generated, can be edited)
4. User OLD ID * (auto-filled from oldStudentId if not provided)
5. Email *
6. Phone *
7. Course Enrolled *
8. Course Price *
9. Enrollment Date *
10. Birth Date *
11. Total Payment *
12. Pending Payment *
13. Status * (Dropdown: Owing, Graduated, Dropout, Active)
14. Source (Dropdown: Legacy ERP, Graduated)

## Backend Responsibility

The backend should:
- **Accept** the `oldStudentId` sent from frontend
- **Auto-generate** `newStudentId` if not provided (or if provided, use it)
- **Validate** that `oldStudentId` is unique (or handle duplicates appropriately)
- **Store** both `oldStudentId` and `newStudentId` in the database

## Notes

- Frontend generates `oldStudentId` for user convenience
- Backend can override or validate the generated ID
- For sequential numbering (00001, 00002, etc.), backend should handle this based on existing records
- Frontend uses `00001` as default for manual create, but backend should assign proper sequential numbers


