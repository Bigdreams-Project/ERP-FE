import { IBank } from "../finance/bank.interface";

export interface CreateCenter {
  name: string;
  location: string;
  email: string;
  managerId: string;
  phone: string;
  address: string;
  status: string;
  type: string;
  document?: FileList | null;
  banks: IBank[]
}

export interface UpdateCenter {
  id: string; 
  name: string;
  location: string;
  email: string;
  managerId: string;
  phone: string;
  address: string;
  status: string;
  type: string;
  document?: FileList | null;
  banks: IBank[]
  updatedAt?: string;          
}
