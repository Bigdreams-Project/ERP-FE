# Archive Feature - RBAC Implementation Guide

## Overview

The Archive feature is designed with **center-scoped RBAC** in mind. All archive records **MUST** have a `centerId` field to enable proper filtering when non-admin users access the archive.

## Current Implementation (Admin Only)

Currently, all archive operations are **Admin-only**. This is intentional for the initial release.

## Future RBAC Implementation

When implementing RBAC for non-admin users, follow these guidelines:

### 1. Database Schema Requirements

**ArchiveRecord MUST have:**
- `centerId` (REQUIRED, NOT NULL) - Foreign key to Center table
- All archive records must have a valid `centerId` set

### 2. API Endpoint Filtering

#### GET /archive (List Archive Records)

**Current:** Admin sees all records
**Future RBAC:**
```typescript
// Pseudo-code for backend implementation
if (user.role === 'ADMIN') {
  // Return all archive records (no filtering)
  return getAllArchiveRecords();
} else {
  // Filter by user's center
  return getArchiveRecordsByCenter(user.centerId);
}
```

**SQL Query Example:**
```sql
-- Admin: No WHERE clause
SELECT * FROM archive_records WHERE ...;

-- Non-Admin: Filter by centerId
SELECT * FROM archive_records WHERE centerId = :userCenterId AND ...;
```

#### GET /archive/:id (Single Archive Record)

**Future RBAC:**
```typescript
if (user.role === 'ADMIN') {
  // Admin can view any record
  return getArchiveRecordById(id);
} else {
  // Non-admin can only view records from their center
  return getArchiveRecordByIdAndCenter(id, user.centerId);
}
```

**SQL Query Example:**
```sql
-- Non-Admin: Must verify centerId matches
SELECT * FROM archive_records 
WHERE id = :id AND centerId = :userCenterId;
```

#### POST /archive (Create Archive Record)

**Future RBAC:**
```typescript
if (user.role === 'ADMIN') {
  // Admin can create for any center
  // Use centerId from payload
  return createArchiveRecord(payload);
} else {
  // Non-admin can only create for their own center
  // Override centerId to user's center
  payload.centerId = user.centerId;
  return createArchiveRecord(payload);
}
```

#### POST /archive/bulk-upload

**Future RBAC:**
```typescript
if (user.role === 'ADMIN') {
  // Admin can upload for any center (centerId in payload)
  return bulkUploadArchive(payload);
} else {
  // Non-admin: Override all records to their center
  payload.records.forEach(record => {
    record.centerId = user.centerId;
  });
  return bulkUploadArchive(payload);
}
```

#### POST /archive/from-student/:studentId

**CRITICAL:** This endpoint MUST capture `centerId` from the student record:

```typescript
// Backend implementation MUST do:
const student = await getStudentById(studentId);
const archiveRecord = {
  ...mapStudentToArchive(student),
  centerId: student.centerId, // ⭐ CRITICAL: Preserve student's centerId
};
await createArchiveRecord(archiveRecord);
await deleteStudent(studentId);
```

**Why:** When archiving a student, the archive record must maintain the same `centerId` as the original student for proper RBAC filtering.

#### POST /archive/restore/:archiveId

**CRITICAL:** This endpoint MUST preserve `centerId` when restoring:

```typescript
// Backend implementation MUST do:
const archiveRecord = await getArchiveRecordById(archiveId);
const student = {
  ...mapArchiveToStudent(archiveRecord),
  centerId: archiveRecord.centerId, // ⭐ CRITICAL: Preserve archive's centerId
};
await createStudent(student);
await deleteArchiveRecord(archiveId);
```

**Why:** The restored student must have the same `centerId` as the archive record to maintain center association.

#### PATCH /archive/:id (Update Archive Record)

**Future RBAC:**
```typescript
if (user.role === 'ADMIN') {
  // Admin can update any record
  return updateArchiveRecord(id, payload);
} else {
  // Non-admin can only update records from their center
  // Prevent changing centerId
  if (payload.centerId && payload.centerId !== user.centerId) {
    throw new Error("Cannot change centerId");
  }
  payload.centerId = user.centerId; // Ensure it matches user's center
  return updateArchiveRecord(id, payload);
}
```

#### DELETE /archive/:id

**Future RBAC:**
```typescript
if (user.role === 'ADMIN') {
  // Admin can delete any record
  return deleteArchiveRecord(id);
} else {
  // Non-admin can only delete records from their center
  return deleteArchiveRecordByIdAndCenter(id, user.centerId);
}
```

### 3. Frontend Implementation Status

✅ **Already Implemented:**
- `centerId` is a **required field** in all archive forms
- Archive Create modal has center dropdown (Admin can select any center)
- Archive Upload modal assigns `centerId` to all uploaded records
- All API routes validate `centerId` is present
- TypeScript interfaces require `centerId`

✅ **Ready for RBAC:**
- Frontend passes `centerId` in all create/update operations
- Frontend can easily filter by `centerId` when needed
- Archive table can be filtered by center in the future

### 4. Backend Requirements Checklist

- [ ] **Database:** Ensure `centerId` column exists and is NOT NULL
- [ ] **Validation:** Validate `centerId` exists in Center table
- [ ] **Archive Student:** Capture `student.centerId` when archiving
- [ ] **Restore Student:** Preserve `archiveRecord.centerId` when restoring
- [ ] **Bulk Upload:** Validate all records have valid `centerId`
- [ ] **API Filtering:** Implement center-based filtering for non-admin users
- [ ] **Authorization:** Check user role and centerId before operations

### 5. Testing Checklist

When implementing RBAC, test:

- [ ] Admin can view all archive records (no filtering)
- [ ] Non-admin can only view records from their center
- [ ] Non-admin cannot view records from other centers
- [ ] Non-admin can only create records for their center
- [ ] Non-admin cannot change `centerId` when updating
- [ ] Archiving a student preserves `centerId`
- [ ] Restoring a student preserves `centerId`
- [ ] Bulk upload assigns correct `centerId` for non-admin users

### 6. Security Considerations

1. **Never trust client-side `centerId`** - Always validate/override based on user role
2. **Admin bypass** - Admin users should bypass center filtering
3. **Data isolation** - Non-admin users must never see data from other centers
4. **Audit trail** - Log which center each archive record belongs to

## Summary

The Archive feature is **fully prepared for RBAC implementation**. All records have `centerId` captured, and the frontend is ready. The backend only needs to:

1. Add center-based filtering to GET endpoints
2. Override/validate `centerId` in POST/PATCH endpoints based on user role
3. Ensure `centerId` is preserved when archiving/restoring students

The foundation is solid - just add the filtering logic!


