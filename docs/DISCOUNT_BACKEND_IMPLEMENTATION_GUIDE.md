# Student Discounts Backend Implementation Guide

This guide provides detailed instructions for implementing the student discounts feature on the backend.

## Overview

The discount feature allows authorized users to request discounts for students' course fees. These requests require CEO approval before being applied. Once approved, the discount reduces the amount the student is expected to pay.

## Database Schema

### DiscountRequests Table

```sql
CREATE TABLE discount_requests (
  id VARCHAR(255) PRIMARY KEY,
  student_id VARCHAR(255) NOT NULL,
  course_id VARCHAR(255) NOT NULL,
  payment_plan_id VARCHAR(255),
  requested_by VARCHAR(255) NOT NULL,
  discount_type ENUM('percentage', 'fixed_amount') NOT NULL,
  discount_value DECIMAL(10, 2) NOT NULL,
  original_amount DECIMAL(10, 2) NOT NULL,
  discounted_amount DECIMAL(10, 2) NOT NULL,
  reason TEXT NOT NULL,
  notes TEXT,
  status ENUM('pending', 'approved', 'rejected', 'applied', 'cancelled') DEFAULT 'pending',
  approved_by VARCHAR(255),
  approved_at DATETIME,
  applied_at DATETIME,
  rejection_reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (payment_plan_id) REFERENCES payment_plans(id) ON DELETE SET NULL,
  FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,

  INDEX idx_student_id (student_id),
  INDEX idx_course_id (course_id),
  INDEX idx_status (status),
  INDEX idx_requested_by (requested_by),
  INDEX idx_approved_by (approved_by)
);
```

## API Endpoints

### 1. Get All Discount Requests

**Endpoint:** `GET /api/discounts`

**Headers:**

- `X-Center-Id` (optional): Filter by center ID

**Response:**

```json
[
  {
    "id": "discount_123",
    "studentId": "student_456",
    "student": {
      "id": "student_456",
      "fullName": "John Doe",
      ...
    },
    "courseId": "course_789",
    "course": {
      "id": "course_789",
      "name": "Web Development",
      ...
    },
    "paymentPlanId": "plan_101",
    "requestedBy": "user_202",
    "requestedByName": "Jane Smith",
    "discountType": "percentage",
    "discountValue": 15.0,
    "originalAmount": 750000.00,
    "discountedAmount": 637500.00,
    "reason": "Financial hardship",
    "notes": "Student has demonstrated need",
    "status": "pending",
    "approvedBy": null,
    "approvedByName": null,
    "approvedAt": null,
    "appliedAt": null,
    "rejectionReason": null,
    "createdAt": "2025-12-03T10:00:00Z",
    "updatedAt": "2025-12-03T10:00:00Z"
  }
]
```

**Business Logic:**

- Filter by center if `X-Center-Id` header is provided
- Include related student, course, and user data
- Sort by creation date (newest first)

### 2. Get Single Discount Request

**Endpoint:** `GET /api/discounts/:id`

**Response:**

```json
{
  "id": "discount_123",
  ...
}
```

### 3. Create Discount Request

**Endpoint:** `POST /api/discounts`

**Request Body:**

```json
{
  "studentId": "student_456",
  "courseId": "course_789",
  "paymentPlanId": "plan_101",
  "discountType": "percentage",
  "discountValue": 15.0,
  "reason": "Financial hardship",
  "notes": "Student has demonstrated need"
}
```

**Validation:**

- `studentId`, `courseId`, `discountType`, `discountValue`, `reason` are required
- `discountType` must be either "percentage" or "fixed_amount"
- If `discountType` is "percentage", `discountValue` must be between 0 and 100
- If `discountType` is "fixed_amount", `discountValue` must be positive and less than or equal to the original course fee
- `paymentPlanId` is optional

**Business Logic:**

1. Fetch the student's payment plan for the course
2. Get the original amount from the payment plan
3. Calculate the discounted amount:
   - If percentage: `discountedAmount = originalAmount * (1 - discountValue / 100)`
   - If fixed: `discountedAmount = originalAmount - discountValue`
4. Create discount request with status "pending"
5. Set `requestedBy` to the current user's ID
6. Store `originalAmount` and `discountedAmount`

**Response:**

```json
{
  "id": "discount_123",
  "status": "pending",
  ...
}
```

### 4. Approve Discount Request

**Endpoint:** `PATCH /api/discounts/:id/approve`

**Authorization:** Only users with role "CEO"

**Request Body:**

```json
{
  "notes": "Approved based on financial assessment"
}
```

**Business Logic:**

1. Verify the user has CEO role
2. Check discount request exists and is in "pending" status
3. Update status to "approved"
4. Set `approvedBy` to current user's ID
5. Set `approvedAt` to current timestamp
6. Apply the discount to the student's payment plan:
   - Update the payment plan's `amount` to `discountedAmount`
   - Recalculate `pending` amount: `pending = discountedAmount - paid`
   - Update `balance` if applicable
7. Set status to "applied"
8. Set `appliedAt` to current timestamp
9. Create audit log entry

**Response:**

```json
{
  "id": "discount_123",
  "status": "applied",
  "approvedBy": "user_ceo_001",
  "approvedAt": "2025-12-03T11:00:00Z",
  "appliedAt": "2025-12-03T11:00:00Z",
  ...
}
```

### 5. Reject Discount Request

**Endpoint:** `PATCH /api/discounts/:id/reject`

**Authorization:** Only users with role "CEO"

**Request Body:**

```json
{
  "rejectionReason": "Does not meet discount criteria"
}
```

**Business Logic:**

1. Verify the user has CEO role
2. Check discount request exists and is in "pending" status
3. Update status to "rejected"
4. Set `approvedBy` to current user's ID (for tracking who rejected)
5. Set `approvedAt` to current timestamp
6. Set `rejectionReason`
7. Create audit log entry

**Response:**

```json
{
  "id": "discount_123",
  "status": "rejected",
  "approvedBy": "user_ceo_001",
  "approvedAt": "2025-12-03T11:00:00Z",
  "rejectionReason": "Does not meet discount criteria",
  ...
}
```

## Backend Service Functions

### Network Functions (lib/network.ts)

```typescript
// Get all discount requests
export async function getDiscounts(
  centerId?: string
): Promise<DiscountRequest[]> {
  // Implementation:
  // 1. Build query with optional center filter
  // 2. Join with students, courses, users tables
  // 3. Return array of discount requests
}

// Get single discount request
export async function getDiscountById(
  id: string
): Promise<DiscountRequest | null> {
  // Implementation:
  // 1. Query discount request by ID
  // 2. Include related data (student, course, users)
  // 3. Return discount request or null
}

// Create discount request
export async function createDiscount(
  payload: CreateDiscountRequest,
  requestedBy: string
): Promise<DiscountRequest> {
  // Implementation:
  // 1. Validate payload
  // 2. Fetch payment plan to get original amount
  // 3. Calculate discounted amount
  // 4. Create discount request record
  // 5. Return created discount request
}

// Approve discount request
export async function approveDiscount(
  id: string,
  approvedBy: string,
  notes?: string
): Promise<DiscountRequest> {
  // Implementation:
  // 1. Verify user is CEO
  // 2. Fetch discount request
  // 3. Update status to "approved"
  // 4. Apply discount to payment plan
  // 5. Update status to "applied"
  // 6. Return updated discount request
}

// Reject discount request
export async function rejectDiscount(
  id: string,
  rejectedBy: string,
  rejectionReason: string
): Promise<DiscountRequest> {
  // Implementation:
  // 1. Verify user is CEO
  // 2. Fetch discount request
  // 3. Update status to "rejected"
  // 4. Set rejection reason
  // 5. Return updated discount request
}
```

## Applying Discounts to Payment Plans

When a discount is approved, it must be applied to the student's payment plan:

```typescript
async function applyDiscountToPaymentPlan(
  discountRequest: DiscountRequest
): Promise<void> {
  // 1. Fetch the payment plan
  const paymentPlan = await getPaymentPlanById(discountRequest.paymentPlanId);

  // 2. Calculate new amounts
  const originalAmount = paymentPlan.amount;
  const newAmount = discountRequest.discountedAmount;
  const paid = paymentPlan.paid;
  const newPending = newAmount - paid;

  // 3. Update payment plan
  await updatePaymentPlan(discountRequest.paymentPlanId, {
    amount: newAmount,
    pending: newPending,
    // Update balance if applicable
    balance: newPending,
  });

  // 4. Create audit log
  await createAuditLog({
    action: "discount_applied",
    entityType: "payment_plan",
    entityId: paymentPlan.id,
    userId: discountRequest.approvedBy,
    details: {
      originalAmount,
      discountedAmount: newAmount,
      discountId: discountRequest.id,
    },
  });
}
```

## Authorization

- **Create Discount Request:** Any authenticated user (typically finance officers, center managers, etc.)
- **Approve/Reject Discount:** Only users with role "CEO"
- **View Discounts:** Users can view discounts for their center (filtered by `X-Center-Id` header)

## Status Flow

```
pending → approved → applied
pending → rejected
```

- **pending:** Initial state when request is created
- **approved:** CEO has approved the request
- **applied:** Discount has been applied to the payment plan
- **rejected:** CEO has rejected the request
- **cancelled:** Request was cancelled (optional, for future use)

## Error Handling

- Return appropriate HTTP status codes (400, 401, 403, 404, 500)
- Provide clear error messages
- Log errors for debugging
- Validate all input data
- Handle database transaction failures

## Testing Checklist

- [ ] Create discount request with percentage discount
- [ ] Create discount request with fixed amount discount
- [ ] Validate discount value limits (percentage 0-100%, fixed amount <= original fee)
- [ ] CEO can approve discount request
- [ ] CEO can reject discount request
- [ ] Non-CEO users cannot approve/reject
- [ ] Discount is correctly applied to payment plan when approved
- [ ] Payment plan amounts are recalculated correctly
- [ ] Discount requests are filtered by center
- [ ] Audit logs are created for approval/rejection
- [ ] Error handling for invalid requests

## Additional Considerations

1. **Notification System:** Send notifications when:

   - Discount request is created (to CEO)
   - Discount request is approved/rejected (to requester and student)

2. **Reporting:** Track discount statistics:

   - Total discounts given
   - Average discount percentage
   - Discounts by course
   - Discounts by center

3. **History:** Maintain a history of all discount requests for audit purposes

4. **Validation:** Ensure discounts don't result in negative amounts

5. **Multiple Discounts:** Consider if a student can have multiple discounts (current implementation assumes one discount per payment plan)



