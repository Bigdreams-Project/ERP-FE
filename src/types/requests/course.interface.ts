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
