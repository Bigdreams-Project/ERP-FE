export interface IRegisterUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  company: string | null;
  job: string | null;
}
