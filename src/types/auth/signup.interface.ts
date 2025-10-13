export interface IRegisterUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  company: string | null;
  job: string | null;
}

export interface CreateUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  status: string;
  centers: string[];
}

export interface UpdateUser {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  status: string;
  centers: string[];
}
