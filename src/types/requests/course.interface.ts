export interface CreateCourse {
  id: string;
  name: string;
  type: string;
  duration: number;
  oldId?: string;
}
 
export interface UpdateCourse {
  id?: string;
  name: string;
  type: string;
  duration: number;
  oldId?: string;
}

export interface BulkUploadCourseRecord {
  oldId: string;
  title: string;
  duration: number;
  amount?: number;
}

export interface BulkUploadCoursesRequest {
  records: BulkUploadCourseRecord[];
}

export interface BulkUploadCoursesResponse {
  success: number;
  failed: number;
  skipped: number;
  errors: Array<{
    row: number;
    oldId?: string;
    title?: string;
    error: string;
  }>;
  skippedRecords: Array<{
    row: number;
    oldId?: string;
    title?: string;
    reason: string;
  }>;
  total: number;
}

export interface BulkUploadRegularCourseRecord {
  title: string;
  duration: number;
  course_type: string;
  amount?: number;
}

export interface BulkUploadRegularCoursesRequest {
  records: BulkUploadRegularCourseRecord[];
}