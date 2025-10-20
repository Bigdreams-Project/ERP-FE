import * as yup from "yup";

export const bankSchema = yup.object().shape({
  bankName: yup.string().required("Bank Name is required"),
  accountNumber: yup.string().required("Account Number is required"),
  accountName: yup.string().required("Account Name is required"),
  balance: yup.number().required("Balance is required"),
});

export const centerSchema = yup.object().shape({
  name: yup.string().required("Center name is required"),
  location: yup.string().required("Location is required"),
  address: yup.string().required("Center address is required"),
  managerId: yup.string().required("Center Manager name is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^0\d{10}$/,
      "Phone number must be 11 digits and start with 0 (e.g., 07033880063)"
    ),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email address is required"),
  status: yup
    .mixed<"ACTIVE" | "IN_SETUP" | "SUSPENDED" | "CLOSED">()
    .oneOf(["ACTIVE", "IN_SETUP", "SUSPENDED", "CLOSED"], "Invalid status")
    .required("Status is required"),
  type: yup
    .mixed<"OWNED" | "PARTNERED">()
    .oneOf(["OWNED", "PARTNERED"], "Invalid type")
    .required("Type is required"),
  document: yup
    .mixed()
    .test("required", "You need to provide a file", (value) => {
      return value instanceof FileList && value.length > 0;
    })
    .test("fileSize", "The file is too large (max 2MB)", (value) => {
      return value instanceof FileList && value.length > 0
        ? value[0].size <= 2000000
        : true;
    })
    .optional()
    .nullable()
    .notRequired() as yup.MixedSchema<FileList | null>,
  banks: yup.array().of(bankSchema).min(1, "At least one bank is required.")
    .required("Banks are required"),
});
