import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address.")
    .required("Email is required."),
  password: yup
    .string()
    .min(8, "Password must have at least 8 characters.")
    .matches(/[a-z]/, "Password must contain a lowercase letter.")
    .matches(/[A-Z]/, "Password must contain an uppercase letter.")
    .matches(/\d/, "Password must contain a number.")
    .matches(/[^a-zA-Z0-9]/, "Password must contain a symbol.")
    .required("Password is required."),
});
