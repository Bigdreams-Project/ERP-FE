export interface IRegisterUser {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  company: string | null;
  job: string | null;
}
