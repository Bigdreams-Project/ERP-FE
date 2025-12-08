# Transaction Approval - Backend Implementation Guide

## Overview

This guide implements a transaction approval workflow. Finance officers can approve transactions from the transaction details page, with an optional approval note. This approval process is separate from payment approval and is specifically for transaction verification.

## Workflow Summary

1. **Transaction Approval:**
   - Finance officer views transaction details
   - Clicks "Approve Transaction" button
   - Modal opens with optional approval notes field
   - Transaction status changes to "approved"
   - Approval is logged with timestamp and approver information

## Database Schema Updates

### 1. Update Payment/Transaction Model

Add approval tracking fields to the payments/transactions table:

```sql
-- Add approval fields to payments table
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS approved_by VARCHAR(255),
ADD COLUMN IF NOT EXISTS approved_at DATETIME,
ADD COLUMN IF NOT EXISTS approval_notes TEXT,
ADD INDEX idx_approval_status (approval_status),
ADD INDEX idx_approved_by (approved_by);

-- Foreign key for approved_by
ALTER TABLE payments
ADD CONSTRAINT fk_payment_approved_by 
FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL;
```

**Note:** If you already have a `status` field for payment approval (from the student approval workflow), you can either:
- Use the existing `status` field and add `approval_notes`, `approved_by`, `approved_at` separately
- Or create a separate `approval_status` field for transaction-level approval

## API Endpoints

### 1. Approve Transaction

**Endpoint:** `PATCH /payments/:id/approve` or `PATCH /transactions/:id/approve`

**Description:** Approves a transaction, marking it as verified and approved by a finance officer.

**Authorization:** Finance Officer or higher

**Request Body:**
```json
{
  "notes": "Payment verified. Receipt confirmed." // Optional
}
```

**Response:**
```json
{
  "id": "payment_123",
  "approval_status": "approved",
  "approved_by": "user_finance_001",
  "approved_at": "2025-01-15T11:00:00Z",
  "approval_notes": "Payment verified. Receipt confirmed.",
  "amount": 10000,
  "student": {
    "id": "student_123",
    "fullName": "John Doe"
  },
  // ... other payment fields
}
```

**Implementation:**

```typescript
// payment.controller.ts
@Patch(':id/approve')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('financeOfficer', 'coo', 'ceo')
async approveTransaction(
  @Param('id') paymentId: string,
  @Body() approveDto: ApproveTransactionDto,
  @Request() req: any,
): Promise<Payment> {
  return this.paymentService.approveTransaction(
    paymentId,
    req.user.id,
    approveDto.notes,
  );
}
```

```typescript
// payment.service.ts
async approveTransaction(
  paymentId: string,
  userId: string,
  notes?: string,
): Promise<Payment> {
  const payment = await this.paymentRepository.findOne({
    where: { id: paymentId },
    relations: ['student', 'course', 'bank'],
  });

  if (!payment) {
    throw new NotFoundException('Transaction not found');
  }

  if (payment.approval_status === 'approved') {
    throw new BadRequestException('Transaction is already approved');
  }

  // Update payment approval status
  await this.paymentRepository.update(paymentId, {
    approval_status: 'approved',
    approved_by: userId,
    approved_at: new Date(),
    approval_notes: notes || null,
  });

  const updatedPayment = await this.paymentRepository.findOne({
    where: { id: paymentId },
    relations: ['student', 'course', 'bank', 'approvedBy'],
  });

  // Optional: Send notification to student
  await this.notifyStudentOfApproval(updatedPayment);

  // Optional: Log approval event
  await this.auditLogService.log({
    action: 'transaction_approved',
    entityType: 'payment',
    entityId: paymentId,
    userId,
    metadata: {
      amount: payment.amount,
      studentId: payment.student?.id,
      notes,
    },
  });

  return updatedPayment;
}

private async notifyStudentOfApproval(payment: Payment): Promise<void> {
  if (!payment.student?.userId) {
    return;
  }

  await this.notificationService.create({
    userId: payment.student.userId,
    type: 'transaction_approved',
    title: 'Transaction Approved',
    message: `Your payment of ₦${payment.amount.toLocaleString()} has been approved.`,
    link: `/dashboard/finance/payments/${payment.id}`,
    metadata: {
      paymentId: payment.id,
      amount: payment.amount,
    },
  });
}
```

### 2. Get Transaction (Update Existing)

**Endpoint:** `GET /payments/:id` or `GET /transactions/:id`

**Updated Response:** Include approval fields in the response:

```json
{
  "id": "payment_123",
  "amount": 10000,
  "approval_status": "approved",
  "approved_by": "user_finance_001",
  "approved_at": "2025-01-15T11:00:00Z",
  "approval_notes": "Payment verified. Receipt confirmed.",
  "approvedBy": {
    "id": "user_finance_001",
    "fullName": "Jane Finance",
    "email": "jane@example.com"
  },
  // ... other payment fields
}
```

### 3. List Transactions (Update Existing)

**Endpoint:** `GET /payments` or `GET /transactions`

**Query Parameters:**
- `approval_status` (optional): Filter by approval status (`pending`, `approved`, `rejected`)

**Example:**
```
GET /payments?approval_status=approved
```

## DTOs

### ApproveTransactionDto

```typescript
// dto/approve-transaction.dto.ts
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ApproveTransactionDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Approval notes must not exceed 1000 characters' })
  notes?: string;
}
```

## Frontend API Route

Create the Next.js API route to proxy the request:

**File:** `src/app/api/transactions/[transaction]/approve/route.ts`

```typescript
import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ transaction: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { transaction: transactionId } = await params;
    const body = await request.json();

    const response = await axios.patch(
      `${AuthRoutes.BASE_URL}/payments/${transactionId}/approve`,
      body,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to approve transaction:", error);
    if (error.response) {
      return NextResponse.json(
        { error: error.response.data?.message || "Failed to approve transaction" },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to approve transaction" },
      { status: 500 }
    );
  }
}
```

## Migration Script

```sql
-- Migration: Add transaction approval tracking

-- 1. Add approval fields to payments table
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS approved_by VARCHAR(255),
ADD COLUMN IF NOT EXISTS approved_at DATETIME,
ADD COLUMN IF NOT EXISTS approval_notes TEXT;

-- 2. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_approval_status ON payments(approval_status);
CREATE INDEX IF NOT EXISTS idx_payment_approved_by ON payments(approved_by);

-- 3. Add foreign key constraint
ALTER TABLE payments
ADD CONSTRAINT fk_payment_approved_by 
FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL;

-- 4. Set existing payments to 'pending' if null
UPDATE payments 
SET approval_status = 'pending' 
WHERE approval_status IS NULL;
```

## Business Logic

### Approval Rules

1. **Authorization:**
   - Only finance officers, COO, and CEO can approve transactions
   - Users cannot approve their own transactions (if applicable)

2. **Status Validation:**
   - Cannot approve already approved transactions
   - Cannot approve rejected transactions (unless re-approval is allowed)

3. **Audit Trail:**
   - All approvals must be logged with:
     - Who approved (user ID)
     - When approved (timestamp)
     - Approval notes (if provided)

4. **Notifications:**
   - Optional: Notify student when transaction is approved
   - Optional: Notify center manager

## Testing Checklist

### Transaction Approval
- [ ] Finance officer can approve pending transactions
- [ ] Approval modal opens with optional notes field
- [ ] Transaction status changes to "approved" after approval
- [ ] Approval notes are saved correctly
- [ ] Approved by and approved at fields are populated
- [ ] Cannot approve already approved transactions
- [ ] Non-finance officers cannot approve transactions
- [ ] Approval is logged in audit trail

### Edge Cases
- [ ] Empty approval notes (should be allowed)
- [ ] Very long approval notes (should be truncated or validated)
- [ ] Transaction not found (should return 404)
- [ ] Unauthorized access (should return 403)
- [ ] Network errors (should show appropriate error message)

## Frontend Integration Notes

The frontend has been updated to:
1. Show "Approve Transaction" button in AdditionalActions component
2. Open TransactionApprovalModal on button click
3. Submit approval with optional notes
4. Show success/error messages
5. Refresh transaction data after approval

Backend should:
1. Validate user permissions
2. Update transaction approval status
3. Store approval notes, approver, and timestamp
4. Return updated transaction data
5. Send notifications (optional)

## Security Considerations

1. **Authorization:**
   - Use role-based access control (RBAC)
   - Verify user has finance officer role or higher
   - Consider adding IP restrictions for sensitive operations

2. **Validation:**
   - Validate transaction exists before approval
   - Check current approval status
   - Validate approval notes length (max 1000 characters)

3. **Audit Trail:**
   - Log all approval actions
   - Track who approved what and when
   - Store approval notes for audit purposes

4. **Data Integrity:**
   - Use database transactions for atomic updates
   - Ensure foreign key constraints are enforced
   - Handle concurrent approval attempts

## Notification Templates

### Transaction Approved (Student)
```
Title: Transaction Approved
Message: Your payment of ₦{amount} has been approved.
Link: /dashboard/finance/payments/{paymentId}
```

## Summary

This implementation provides:
1. ✅ Transaction approval endpoint
2. ✅ Optional approval notes field
3. ✅ Approval status tracking
4. ✅ Approver and timestamp tracking
5. ✅ Proper authorization and validation
6. ✅ Audit trail support
7. ✅ Frontend integration with modal

The approval workflow is separate from payment approval and focuses on transaction verification by finance officers.

