import { ArchiveRecord } from "../academic/archive.interface";

export interface CreateArchiveRecord extends Omit<ArchiveRecord, "id" | "createdAt" | "updatedAt"> {}

export interface UpdateArchiveRecord extends Partial<Omit<ArchiveRecord, "id" | "createdAt" | "updatedAt">> {
  id: string;
}

export interface BulkUploadArchiveRequest {
  records: ArchiveRecord[];
}

export interface ArchiveRecordsResponse {
  data: ArchiveRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface BulkUploadArchiveResponse {
  success: number;
  failed: number;
  errors?: Array<{
    row: number;
    error: string;
  }>;
}

