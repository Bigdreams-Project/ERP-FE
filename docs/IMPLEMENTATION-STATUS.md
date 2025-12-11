# Deletion Feature Implementation Status

## ✅ Completed

### 1. **Interfaces Updated**
- ✅ Student - `deletedAt` field added
- ✅ Lead - `deletedAt` field added
- ✅ Center - `deletedAt` field added
- ✅ Course - `deletedAt` field added
- ✅ Batch - `deletedAt` field added

### 2. **Delete Modal Component**
- ✅ `EntityDeleteModal.tsx` - Reusable modal for all entity types
- ✅ Two-step confirmation (soft/hard delete choice)
- ✅ Warnings for related data
- ✅ Test email detection

### 3. **Network Functions**
- ✅ Server-side: `softDelete*` and `hardDelete*` for all entities
- ✅ Client-side: `softDelete*Client` and `hardDelete*Client` for all entities
- ✅ Updated `get*` functions to filter soft-deleted items

### 4. **API Route Handlers**
- ✅ `/api/students/[id]/route.ts` - PATCH (soft) and DELETE (hard)
- ✅ `/api/leads/[id]/route.ts` - PATCH (soft) and DELETE (hard)
- ✅ `/api/centers/[id]/route.ts` - PATCH (soft) and DELETE (hard)
- ✅ `/api/courses/[id]/route.ts` - PATCH (soft) and DELETE (hard)
- ✅ `/api/batches/[id]/route.ts` - PATCH (soft) and DELETE (hard)
- ✅ All routes verify ADMIN role

### 5. **Table Components**
- ✅ Students.table.tsx - Updated with delete button (ADMIN only)
- ✅ Leads.table.tsx - Updated with delete button (ADMIN only)
- ⏳ Center.table.tsx - Needs update
- ⏳ Courses.table.tsx - Needs update
- ⏳ Batches.table.tsx - Needs update

## 🔄 Remaining Work

### Table Components to Update:
1. **Center.table.tsx** - Add:
   - Import `EntityDeleteModal`, `useIsAdmin`, delete functions
   - Filter soft-deleted centers
   - Add delete button (ADMIN only)
   - Replace `DeleteModal` with `EntityDeleteModal`

2. **Courses.table.tsx** - Add:
   - Import `EntityDeleteModal`, `useIsAdmin`, delete functions
   - Filter soft-deleted courses
   - Add delete button (ADMIN only)
   - Replace `DeleteModal` with `EntityDeleteModal`

3. **Batches.table.tsx** - Add:
   - Import `EntityDeleteModal`, `useIsAdmin`, delete functions
   - Filter soft-deleted batches
   - Add delete button (ADMIN only)
   - Replace `DeleteModal` with `EntityDeleteModal`

### Pattern to Follow:
```typescript
// 1. Add imports
import EntityDeleteModal from "@/components/modals/academic/EntityDeleteModal";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { softDelete*Client, hardDelete*Client } from "@/lib/client-network";

// 2. Add hooks
const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();

// 3. Filter soft-deleted items
const activeItems = useMemo(() => {
  return data.filter((item) => !item.deletedAt);
}, [data]);

// 4. Add delete handlers
const handleSoftDelete = async (id: string) => { ... };
const handleHardDelete = async (id: string) => { ... };

// 5. Show delete button (ADMIN only)
{isAdmin && !isAdminLoading && (
  <button onClick={() => handleDelete(item)}>Delete</button>
)}

// 6. Replace DeleteModal with EntityDeleteModal
<EntityDeleteModal
  entityType="Center|Course|Batch"
  entity={selectedItem}
  onSoftDelete={handleSoftDelete}
  onHardDelete={handleHardDelete}
/>
```

## Backend Requirements

All entities need the same backend implementation as Students:
- Soft delete endpoint: `PATCH /{entity}/{id}` with `{ deletedAt: timestamp }`
- Hard delete endpoint: `DELETE /{entity}/{id}?hard=true`
- GET endpoints filter `deletedAt IS NOT NULL` by default
- ADMIN role verification on delete endpoints
- `deletedAt: DateTime | null` field in database schema

