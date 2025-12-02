# Archive Feature - Backend API Specification

## Overview

This document specifies the backend API endpoints required for the Archive feature. The Archive feature allows moving students between the Student table and Archive table (MOVE operations, not copy + soft-delete).

## Database Schema

### StudentArchive Table

```prisma
model StudentArchive {
  id            String   @id @default(uuid())
  centerId      String   // REQUIRED - for RBAC
  userOldId     String
  userNewId     String?
  fullname      String
  email         String
  phone         String
  courseEnrolled String
  coursePrice   Float
  enrollmentDate DateTime
  birthDate     DateTime
  oldStudentId  String
  newStudentId  String?
  totalPayment  Float    @default(0)
  pendingPayment Float   @default(0)
  status        String
  source        String?  @default("legacy_erp") // "legacy_erp" | "graduated"
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([centerId]) // CRITICAL for RBAC
  @@index([userOldId])
  @@index([oldStudentId])
  @@index([email])
  @@index([phone])
  @@map("student_archive")
}
```

## API Endpoints

### 1. POST `/archive` - Create Single Archive Record

**Purpose**: Create a single archive record manually (form-based entry)

**Authentication**: Admin only

**Request Body**:
```typescript
{
  centerId: string;          // REQUIRED
  userOldId: string;         // REQUIRED
  userNewId: string | null;
  fullname: string;          // REQUIRED
  email: string;             // REQUIRED (valid email)
  phone: string;             // REQUIRED
  courseEnrolled: string;    // REQUIRED
  coursePrice: number;       // REQUIRED (>= 0)
  enrollmentDate: string;    // REQUIRED (ISO date string)
  birthDate: string;         // REQUIRED (ISO date string)
  oldStudentId: string;     // REQUIRED
  newStudentId: string | null;
  totalPayment: number;      // REQUIRED (>= 0)
  pendingPayment: number;    // REQUIRED (>= 0)
  status: string;            // REQUIRED
  source: "legacy_erp" | "graduated" | null;
}
```

**Response** (201 Created):
```typescript
{
  id: string;
  centerId: string;
  userOldId: string;
  userNewId: string | null;
  fullname: string;
  email: string;
  phone: string;
  courseEnrolled: string;
  coursePrice: number;
  enrollmentDate: string;
  birthDate: string;
  oldStudentId: string;
  newStudentId: string | null;
  totalPayment: number;
  pendingPayment: number;
  status: string;
  source: string | null;
  createdAt: string;
  updatedAt: string;
}
```

**Validation**:
- All required fields must be present
- `email` must be valid email format
- `coursePrice`, `totalPayment`, `pendingPayment` must be >= 0
- `centerId` must exist in Center table
- `source` must be one of: "legacy_erp", "graduated", or null

---

### 2. POST `/archive/from-student/:studentId` - Archive Student (MOVE)

**Purpose**: Move a student from Student table to Archive table (hard delete student, create archive record)

**Authentication**: Admin only

**URL Parameters**:
- `studentId` (string, required) - The ID of the student to archive

**Request Body**: Empty object `{}`

**Business Logic**:
1. Fetch student record by `studentId`
2. Validate student exists and is not already archived
3. Map Student fields to ArchiveRecord fields (see mapping below)
4. Create ArchiveRecord in database
5. **Hard delete** Student record from database (not soft delete)
6. Handle related data (payments, batches) - preserve references or handle gracefully
7. Return created ArchiveRecord

**Student to ArchiveRecord Mapping**:
```typescript
{
  centerId: student.centerId,                    // REQUIRED
  userOldId: student.id,                          // Use student.id as userOldId
  userNewId: student.id,                          // Use student.id as userNewId
  fullname: student.fullName,                     // Map fullName -> fullname
  email: student.email,
  phone: student.phone,
  courseEnrolled: student.courses[0]?.name || "", // Get first course name, or empty string
  coursePrice: calculateCoursePrice(student),    // Calculate from student.courses or courseAssignments
  enrollmentDate: student.enrolledDate,          // Map enrolledDate -> enrollmentDate
  birthDate: student.birthDate,
  oldStudentId: student.studentId || "",         // Use student.studentId, or empty string if null
  newStudentId: student.studentId || null,       // Use student.studentId, or null if null
  totalPayment: calculateTotalPayment(student),  // Sum of student.payments (if available)
  pendingPayment: calculatePendingPayment(student), // coursePrice - totalPayment
  status: student.status || "archived",          // Use student.status, or "archived" as default
  source: "graduated"                            // Set source to "graduated" for archived students
}
```

**Helper Functions Needed**:
```typescript
function calculateCoursePrice(student: Student): number {
  // Option 1: From courseAssignments
  if (student.courses?.[0]?.courseAssignments?.[0]?.baseFee) {
    return student.courses[0].courseAssignments[0].baseFee;
  }
  
  // Option 2: From course name (fallback)
  const courseName = student.courses?.[0]?.name?.toLowerCase() || "";
  const fees: { [key: string]: number } = {
    graphic: 500000,
    web: 750000,
    data: 600000,
  };
  for (const [key, value] of Object.entries(fees)) {
    if (courseName.includes(key)) return value;
  }
  
  // Option 3: Default
  return 0;
}

function calculateTotalPayment(student: Student): number {
  if (!student.payments || student.payments.length === 0) return 0;
  return student.payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
}

function calculatePendingPayment(student: Student, coursePrice: number): number {
  const totalPayment = calculateTotalPayment(student);
  return Math.max(0, coursePrice - totalPayment);
}
```

**Response** (200 OK):
```typescript
{
  id: string;
  centerId: string;
  userOldId: string;
  userNewId: string | null;
  fullname: string;
  email: string;
  phone: string;
  courseEnrolled: string;
  coursePrice: number;
  enrollmentDate: string;
  birthDate: string;
  oldStudentId: string;
  newStudentId: string | null;
  totalPayment: number;
  pendingPayment: number;
  status: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}
```

**Error Responses**:
- `404 Not Found`: Student not found
- `400 Bad Request`: Student already archived or invalid data
- `403 Forbidden`: Not admin
- `500 Internal Server Error`: Server error

---

### 3. POST `/archive/restore/:archiveId` - Restore Student (MOVE)

**Purpose**: Move an archive record back to Student table (hard delete archive, create student record)

**Authentication**: Admin only

**URL Parameters**:
- `archiveId` (string, required) - The ID of the archive record to restore

**Request Body**: Empty object `{}`

**Business Logic**:
1. Fetch archive record by `archiveId`
2. Validate archive record exists
3. Map ArchiveRecord fields to Student fields (see mapping below)
4. Create Student record in database
5. **Hard delete** ArchiveRecord from database
6. Recreate necessary relationships (center, course assignments, etc.)
7. Return created Student record

**ArchiveRecord to Student Mapping**:
```typescript
{
  id: generateUUID(),                              // Generate new UUID
  studentId: archiveRecord.newStudentId || archiveRecord.oldStudentId || null,
  leadId: null,                                    // Set to null (no lead reference)
  fullName: archiveRecord.fullname,                // Map fullname -> fullName
  phone: archiveRecord.phone,
  email: archiveRecord.email,
  image: "",                                       // Set to empty string (no image)
  address: "",                                     // Set to empty string (not in archive)
  birthDate: archiveRecord.birthDate,
  centerId: archiveRecord.centerId,               // REQUIRED
  enrolledDate: archiveRecord.enrollmentDate,     // Map enrollmentDate -> enrolledDate
  status: archiveRecord.status || "active",        // Use archive status, or "active" as default
  paymentPlan: "lumpsum",                          // Default payment plan
  lumpSum: null,                                   // Set to null
  numberOfInstallments: null,                       // Set to null
  comments: null,                                  // Set to null
  guardians: [],                                  // Empty array (guardian data not in archive)
  courses: [],                                     // Will need to be recreated based on courseEnrolled
  batches: [],                                    // Empty array (batch assignments not in archive)
  notes: [],                                       // Empty array
  payments: [],                                   // Empty array (payment history not restored)
  deletedAt: null,                                 // Set to null (not soft-deleted)
  createdAt: new Date().toISOString(),
}
```

**Course Assignment Logic**:
After creating the Student record, you may need to:
1. Find the Course by name (from `archiveRecord.courseEnrolled`)
2. Create a CourseAssignment linking the Student to the Course
3. Set the baseFee to `archiveRecord.coursePrice`

**Response** (200 OK):
```typescript
{
  id: string;
  studentId: string | null;
  leadId: string | null;
  fullName: string;
  phone: string;
  email: string;
  image: string;
  address: string;
  birthDate: string;
  centerId: string;
  enrolledDate: string;
  status: string;
  paymentPlan: string;
  lumpSum: number | null;
  numberOfInstallments: number | null;
  comments: string | null;
  guardians: Guardian[];
  courses: Course[];
  batches: StudentBatch[];
  notes: StudentNote[];
  payments: Payment[];
  deletedAt: string | null;
  createdAt: string;
}
```

**Error Responses**:
- `404 Not Found`: Archive record not found
- `400 Bad Request`: Invalid data or student already exists
- `403 Forbidden`: Not admin
- `500 Internal Server Error`: Server error

---

### 4. GET `/archive` - Fetch Archive Records

**Purpose**: Get paginated list of archive records

**Authentication**: Admin only (for now, admin sees ALL records; future: center-filtered for non-admin)

**Query Parameters**:
- `page` (number, optional, default: 1) - Page number
- `limit` (number, optional, default: 10) - Records per page
- `search` (string, optional) - Search query (searches: fullname, email, phone, userOldId, oldStudentId)

**Response** (200 OK):
```typescript
{
  data: ArchiveRecord[];
  total: number;        // Total number of records
  page: number;         // Current page
  limit: number;        // Records per page
}
```

**Filtering Logic** (Future RBAC):
- Admin: Returns ALL records (no center filtering)
- Non-admin: Returns only records where `centerId` matches user's allowed centers

---

### 5. POST `/archive/bulk-upload` - Bulk Upload Archive Records

**Purpose**: Upload multiple archive records from Excel/CSV file

**Authentication**: Admin only

**Request Body**:
```typescript
{
  centerId: string;      // REQUIRED - All records will be assigned to this center
  records: ArchiveRecord[]; // Array of archive records (without id, createdAt, updatedAt)
}
```

**Response** (200 OK):
```typescript
{
  success: number;       // Number of successfully created records
  failed: number;        // Number of failed records
  errors?: Array<{       // Optional: Details of failed records
    row: number;         // Row number in the upload
    error: string;       // Error message
  }>;
}
```

**Validation**:
- Validate each record in the array
- All records must have valid `centerId`
- Continue processing even if some records fail
- Return summary of successes and failures

---

### 6. PATCH `/archive/:id` - Update Archive Record

**Purpose**: Update an existing archive record

**Authentication**: Admin only

**URL Parameters**:
- `id` (string, required) - The ID of the archive record to update

**Request Body**:
```typescript
{
  centerId?: string;
  userOldId?: string;
  userNewId?: string | null;
  fullname?: string;
  email?: string;
  phone?: string;
  courseEnrolled?: string;
  coursePrice?: number;
  enrollmentDate?: string;
  birthDate?: string;
  oldStudentId?: string;
  newStudentId?: string | null;
  totalPayment?: number;
  pendingPayment?: number;
  status?: string;
  source?: "legacy_erp" | "graduated" | null;
}
```

**Response** (200 OK): Updated ArchiveRecord object

---

### 7. DELETE `/archive/:id` - Delete Archive Record

**Purpose**: Hard delete an archive record

**Authentication**: Admin only

**URL Parameters**:
- `id` (string, required) - The ID of the archive record to delete

**Request Body**: None

**Response** (200 OK):
```typescript
{
  message: "Archive record deleted successfully";
}
```

---

## Authentication & Authorization

All endpoints require:
1. Valid JWT token in `Authorization: Bearer <token>` header
2. Admin role check (for now, all endpoints are admin-only)

**Future RBAC Implementation**:
- Non-admin users will only see archive records where `centerId` matches their allowed centers
- Admin users bypass center filtering and see all records

---

## Error Handling

All endpoints should return consistent error responses:

**401 Unauthorized**:
```typescript
{
  error: "Unauthorized"
}
```

**403 Forbidden**:
```typescript
{
  error: "Forbidden: Admin access required"
}
```

**404 Not Found**:
```typescript
{
  error: "Student not found" // or "Archive record not found"
}
```

**400 Bad Request**:
```typescript
{
  error: "Validation error message",
  details?: { /* field-specific errors */ }
}
```

**500 Internal Server Error**:
```typescript
{
  error: "Internal server error"
}
```

---

## Data Mapping Examples

### Example: Archive Student

**Input** (Student record):
```json
{
  "id": "student-123",
  "studentId": "STU-001",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "birthDate": "2000-01-01",
  "enrolledDate": "2023-09-01",
  "centerId": "center-456",
  "status": "active",
  "courses": [
    {
      "name": "Web Development",
      "courseAssignments": [
        { "baseFee": 750000 }
      ]
    }
  ],
  "payments": [
    { "amount": 250000 },
    { "amount": 300000 }
  ]
}
```

**Output** (ArchiveRecord):
```json
{
  "id": "archive-789",
  "centerId": "center-456",
  "userOldId": "student-123",
  "userNewId": "student-123",
  "fullname": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "courseEnrolled": "Web Development",
  "coursePrice": 750000,
  "enrollmentDate": "2023-09-01",
  "birthDate": "2000-01-01",
  "oldStudentId": "STU-001",
  "newStudentId": "STU-001",
  "totalPayment": 550000,
  "pendingPayment": 200000,
  "status": "active",
  "source": "graduated",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Example: Restore Student

**Input** (ArchiveRecord):
```json
{
  "id": "archive-789",
  "centerId": "center-456",
  "userOldId": "student-123",
  "userNewId": "student-123",
  "fullname": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "courseEnrolled": "Web Development",
  "coursePrice": 750000,
  "enrollmentDate": "2023-09-01",
  "birthDate": "2000-01-01",
  "oldStudentId": "STU-001",
  "newStudentId": "STU-001",
  "totalPayment": 550000,
  "pendingPayment": 200000,
  "status": "active",
  "source": "graduated"
}
```

**Output** (Student record):
```json
{
  "id": "student-new-456",
  "studentId": "STU-001",
  "leadId": null,
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "image": "",
  "address": "",
  "birthDate": "2000-01-01",
  "centerId": "center-456",
  "enrolledDate": "2023-09-01",
  "status": "active",
  "paymentPlan": "lumpsum",
  "lumpSum": null,
  "numberOfInstallments": null,
  "comments": null,
  "guardians": [],
  "courses": [],
  "batches": [],
  "notes": [],
  "payments": [],
  "deletedAt": null,
  "createdAt": "2024-01-15T11:00:00Z"
}
```

---

## Implementation Priority

1. **High Priority**:
   - POST `/archive/from-student/:studentId` (Archive Student)
   - POST `/archive/restore/:archiveId` (Restore Student)
   - POST `/archive` (Create single record)
   - GET `/archive` (Fetch records with pagination)

2. **Medium Priority**:
   - POST `/archive/bulk-upload` (Bulk upload)
   - PATCH `/archive/:id` (Update record)

3. **Low Priority**:
   - DELETE `/archive/:id` (Delete record)

---

## Testing Checklist

- [ ] Archive student creates ArchiveRecord correctly
- [ ] Archive student hard-deletes Student record
- [ ] Restore student creates Student record correctly
- [ ] Restore student hard-deletes ArchiveRecord
- [ ] Course price calculation works correctly
- [ ] Payment calculations work correctly
- [ ] Admin-only access enforced
- [ ] Error handling works for all edge cases
- [ ] Pagination works correctly
- [ ] Search functionality works correctly

---

## Notes

1. **MOVE Operation**: Archive and Restore are MOVE operations, not copy operations. Records are physically moved between tables.

2. **Hard Delete**: Both Archive and Restore operations use hard delete (permanent deletion), not soft delete.

3. **Data Loss**: When archiving, some Student data may be lost if not mapped to ArchiveRecord (e.g., guardians, notes, batch assignments). Consider if this is acceptable or if additional fields need to be added to ArchiveRecord.

4. **Course Assignment**: When restoring, you may need to recreate course assignments. Consider how to handle this - should the course be automatically assigned based on `courseEnrolled`?

5. **Payment History**: Payment history is not restored when restoring a student. Consider if this is acceptable or if payment records should be preserved separately.

---

## Contact

For questions or clarifications, please contact the frontend team or refer to the frontend implementation in:
- `src/app/api/archive/` - Next.js API routes (proxy to backend)
- `src/lib/network.ts` - Server-side network functions
- `src/lib/client-network.ts` - Client-side network functions

