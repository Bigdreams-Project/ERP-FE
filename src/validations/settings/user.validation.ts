import * as yup from "yup";

export const userSchema = yup.object().shape({
  firstname: yup.string().required("Firstname is required"),
  lastname: yup.string().required("Lastname is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must have at least 8 characters.")
    .matches(/[a-z]/, "Password must contain a lowercase letter.")
    .matches(/[A-Z]/, "Password must contain an uppercase letter.")
    .matches(/\d/, "Password must contain a number.")
    .matches(/[^a-zA-Z0-9]/, "Password must contain a symbol.")
    .required("Password is required."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  role: yup.string().required("Role is required"),
  status: yup.string().required("Status is required"),
  centers: yup
    .array()
    .of(yup.string().required())
    .min(1, "Select at least one center")
    .required("Centers are required"),
});
