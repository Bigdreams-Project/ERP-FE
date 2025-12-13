# Backend Refund Request Validation Fixes

## Problem
Frontend receives "Validation failed" error when submitting refund requests. The error message is too generic and doesn't provide specific validation details.

## Frontend Payload Structure

The frontend sends the following payload to `POST /refunds`:

```typescript
{
  paymentId: string;        // Required - ID of the payment/transaction
  amount: number;          // Required - Refund amount (must be > 0 and <= payment.amount)
  reason: RefundReason;     // Required - One of: "student_withdrawal", "course_cancellation", "payment_error", "duplicate_payment", "service_issue", "other"
  reasonDescription?: string; // Optional - Required if reason === "other"
  notes?: string;           // Optional - Additional notes
}
```

## Backend Validation Requirements

### 1. Required Field Validation

**All fields must be present and valid:**

```typescript
// Pseudo-code validation
if (!payload.paymentId || typeof payload.paymentId !== 'string') {
  return res.status(400).json({
    error: "Validation failed",
    message: "paymentId is required and must be a string",
    details: {
      paymentId: "paymentId is required"
    }
  });
}

if (!payload.amount || typeof payload.amount !== 'number') {
  return res.status(400).json({
    error: "Validation failed",
    message: "amount is required and must be a number",
    details: {
      amount: "amount is required and must be a number"
    }
  });
}

if (!payload.reason || typeof payload.reason !== 'string') {
  return res.status(400).json({
    error: "Validation failed",
    message: "reason is required and must be a string",
    details: {
      reason: "reason is required"
    }
  });
}
```

### 2. Payment ID Validation

**The payment must exist in the database:**

```typescript
const payment = await Payment.findById(payload.paymentId);
if (!payment) {
  return res.status(404).json({
    error: "Validation failed",
    message: "Payment not found",
    details: {
      paymentId: "Payment with this ID does not exist"
    }
  });
}
```

### 3. Amount Validation

**The refund amount must be valid:**

```typescript
if (payload.amount <= 0) {
  return res.status(400).json({
    error: "Validation failed",
    message: "Refund amount must be greater than 0",
    details: {
      amount: "Refund amount must be greater than 0"
    }
  });
}

if (payload.amount > payment.amount) {
  return res.status(400).json({
    error: "Validation failed",
    message: "Refund amount cannot exceed payment amount",
    details: {
      amount: `Refund amount (${payload.amount}) exceeds payment amount (${payment.amount})`
    }
  });
}
```

### 4. Reason Validation

**The reason must be a valid enum value:**

```typescript
const validReasons = [
  "student_withdrawal",
  "course_cancellation",
  "payment_error",
  "duplicate_payment",
  "service_issue",
  "other"
];

if (!validReasons.includes(payload.reason)) {
  return res.status(400).json({
    error: "Validation failed",
    message: "Invalid refund reason",
    details: {
      reason: `Reason must be one of: ${validReasons.join(", ")}`
    }
  });
}
```

### 5. Reason Description Validation

**If reason is "other", reasonDescription is required:**

```typescript
if (payload.reason === "other" && (!payload.reasonDescription || payload.reasonDescription.trim() === "")) {
  return res.status(400).json({
    error: "Validation failed",
    message: "reasonDescription is required when reason is 'other'",
    details: {
      reasonDescription: "reasonDescription is required when reason is 'other'"
    }
  });
}
```

### 6. Duplicate Refund Check

**Prevent duplicate refund requests for the same payment:**

```typescript
const existingRefund = await RefundRequest.findOne({
  paymentId: payload.paymentId,
  status: { $in: ["REQUESTED", "APPROVED"] } // Check for pending or approved refunds
});

if (existingRefund) {
  return res.status(400).json({
    error: "Validation failed",
    message: "A refund request already exists for this payment",
    details: {
      paymentId: "A refund request with status REQUESTED or APPROVED already exists for this payment"
    }
  });
}
```

### 7. Auto-populate Fields

**Backend should auto-populate these fields from the JWT token:**

```typescript
// Extract from JWT token (already available in auth middleware)
const requestedBy = req.user.id; // User ID from JWT
const studentId = payment.studentId; // From the payment record

// Set default status
const status = "REQUESTED"; // Default status for new refund requests
```

## Complete Backend Validation Example

```typescript
// POST /refunds
async function createRefundRequest(req, res) {
  try {
    const payload = req.body;
    const userId = req.user.id; // From JWT auth middleware

    // 1. Validate required fields
    if (!payload.paymentId) {
      return res.status(400).json({
        error: "Validation failed",
        message: "paymentId is required",
        details: { paymentId: "paymentId is required" }
      });
    }

    if (typeof payload.amount !== 'number' || payload.amount <= 0) {
      return res.status(400).json({
        error: "Validation failed",
        message: "amount must be a positive number",
        details: { amount: "amount must be a positive number" }
      });
    }

    if (!payload.reason) {
      return res.status(400).json({
        error: "Validation failed",
        message: "reason is required",
        details: { reason: "reason is required" }
      });
    }

    // 2. Validate payment exists
    const payment = await Payment.findById(payload.paymentId);
    if (!payment) {
      return res.status(404).json({
        error: "Validation failed",
        message: "Payment not found",
        details: { paymentId: "Payment with this ID does not exist" }
      });
    }

    // 3. Validate amount doesn't exceed payment amount
    if (payload.amount > payment.amount) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Refund amount cannot exceed payment amount",
        details: {
          amount: `Refund amount (${payload.amount}) exceeds payment amount (${payment.amount})`
        }
      });
    }

    // 4. Validate reason enum
    const validReasons = [
      "student_withdrawal",
      "course_cancellation",
      "payment_error",
      "duplicate_payment",
      "service_issue",
      "other"
    ];
    if (!validReasons.includes(payload.reason)) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Invalid refund reason",
        details: {
          reason: `Reason must be one of: ${validReasons.join(", ")}`
        }
      });
    }

    // 5. Validate reasonDescription if reason is "other"
    if (payload.reason === "other" && (!payload.reasonDescription || payload.reasonDescription.trim() === "")) {
      return res.status(400).json({
        error: "Validation failed",
        message: "reasonDescription is required when reason is 'other'",
        details: {
          reasonDescription: "reasonDescription is required when reason is 'other'"
        }
      });
    }

    // 6. Check for duplicate refund requests
    const existingRefund = await RefundRequest.findOne({
      paymentId: payload.paymentId,
      status: { $in: ["REQUESTED", "APPROVED"] }
    });

    if (existingRefund) {
      return res.status(400).json({
        error: "Validation failed",
        message: "A refund request already exists for this payment",
        details: {
          paymentId: "A refund request with status REQUESTED or APPROVED already exists for this payment"
        }
      });
    }

    // 7. Create refund request
    const refundRequest = await RefundRequest.create({
      paymentId: payload.paymentId,
      studentId: payment.studentId, // Auto-populate from payment
      requestedBy: userId, // Auto-populate from JWT
      amount: payload.amount,
      reason: payload.reason,
      reasonDescription: payload.reasonDescription || null,
      notes: payload.notes || null,
      status: "REQUESTED", // Default status
    });

    return res.status(201).json(refundRequest);
  } catch (error) {
    console.error("Error creating refund request:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
}
```

## Database Schema Requirements

The `RefundRequest` table should have these fields:

```sql
CREATE TABLE refund_requests (
  id VARCHAR PRIMARY KEY,
  paymentId VARCHAR NOT NULL,
  studentId VARCHAR NOT NULL,
  requestedBy VARCHAR NOT NULL, -- User ID from JWT
  amount DECIMAL(10,2) NOT NULL,
  reason VARCHAR NOT NULL,
  reasonDescription VARCHAR NULL,
  status VARCHAR NOT NULL DEFAULT 'REQUESTED',
  approvedBy VARCHAR NULL,
  approvedAt TIMESTAMP NULL,
  processedAt TIMESTAMP NULL,
  rejectionReason VARCHAR NULL,
  notes VARCHAR NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (paymentId) REFERENCES payments(id),
  FOREIGN KEY (studentId) REFERENCES students(id),
  FOREIGN KEY (requestedBy) REFERENCES users(id)
);
```

## Status Values

The backend should use these status values (matching frontend enum):

- `REQUESTED` - Initial status when refund is created
- `APPROVED` - When approved by CEO/ADMIN/Regional Manager
- `REJECTED` - When rejected by CEO/ADMIN/Regional Manager
- `COMPLETED` - When refund has been processed/completed

## Error Response Format

All validation errors should follow this format:

```json
{
  "error": "Validation failed",
  "message": "Human-readable error message",
  "details": {
    "fieldName": "Specific error message for this field"
  }
}
```

This allows the frontend to display specific field-level errors to the user.

## Testing Checklist

1. ✅ Missing paymentId → Should return 400 with field-specific error
2. ✅ Invalid paymentId (doesn't exist) → Should return 404
3. ✅ Missing amount → Should return 400 with field-specific error
4. ✅ Amount <= 0 → Should return 400 with field-specific error
5. ✅ Amount > payment.amount → Should return 400 with field-specific error
6. ✅ Missing reason → Should return 400 with field-specific error
7. ✅ Invalid reason enum value → Should return 400 with field-specific error
8. ✅ Reason = "other" without reasonDescription → Should return 400 with field-specific error
9. ✅ Duplicate refund request → Should return 400 with appropriate message
10. ✅ Valid request → Should return 201 with created refund request

