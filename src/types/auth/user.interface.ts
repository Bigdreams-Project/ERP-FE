export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  status: string;
  role: string;
  centers: any[];
  createdAt: string;
  requestedAt: string;
  approvedAt: string;
  rejectedAt: string;
  updatedAt: string;
}
