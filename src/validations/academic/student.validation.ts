import * as yup from "yup";

export const enrollmentSchema = yup.object().shape({
  leadId: yup.string().optional().nullable().notRequired() as yup.StringSchema<
    string | null
  >,
  fullName: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^0\d{10}$/,
      "Phone number must be 11 digits and start with 0 (e.g., 07033880063)"
    ),
  address: yup.string().required("Home address is required"),
  status: yup
    .string()
    .optional()
    .nullable()
    .notRequired() as yup.StringSchema<string>,
  centerId: yup
    .string()
    .optional()
    .nullable()
    .notRequired() as yup.StringSchema<string>,
  enrolledDate: yup.string().required("Enrolled date is required"),
  birthDate: yup.string().required("Birth date enrolled is required"),
  guardianName: yup.string().required("Guardian name is required"),
  guardianPhone: yup
    .string()
    .required("Guardian phone is required")
    .matches(
      /^0\d{10}$/,
      "Phone number must be 11 digits and start with 0 (e.g., 07033880063)"
    ),
  guardianEmail: yup
    .string()
    .email("Invalid email format")
    .nullable()
    .notRequired() as yup.StringSchema<string | null>,
  guardianAddress: yup.string().required("Guardian address is required"),
  courseFee: yup.string().nullable().notRequired() as yup.StringSchema<
    string | null
  >,
  lumpSumFee: yup.string().nullable().notRequired() as yup.StringSchema<
    string | null
  >,
  numberOfInstallments: yup
    .string()
    .nullable()
    .notRequired() as yup.StringSchema<string | null>,
  courseId: yup.string().required("Course of interest is required"),
  batchId: yup
    .string()
    .optional()
    .nullable()
    .notRequired() as yup.StringSchema<string | null>,
  paymentPlan: yup.string().required("Payment plan is required"),
  notes: yup
    .string()
    .optional()
    .nullable()
    .notRequired() as yup.StringSchema<string>,
});
