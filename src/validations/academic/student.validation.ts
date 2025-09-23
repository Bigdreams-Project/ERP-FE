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
      /^\+\d{1,3} \d{3} \d{3}-\d{4}$/,
      "Phone number must be in the format +234 815 815-9170"
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
      /^\+\d{1,3} \d{3} \d{3}-\d{4}$/,
      "Phone number must be in the format +234 815 815-9170"
    ),
  guardianEmail: yup
    .string()
    .email("Invalid email format")
    .nullable()
    .notRequired() as yup.StringSchema<string | null>,
  guardianAddress: yup.string().required("Guardian address is required"),
  lumpSumFee: yup.number().nullable().notRequired() as yup.NumberSchema<
    number | null
  >,
  numberOfInstallments: yup
    .number()
    .nullable()
    .notRequired() as yup.NumberSchema<number | null>,
  courseId: yup.string().required("Course of interest is required"),
  batchId: yup
    .string()
    .optional()
    .nullable()
    .notRequired() as yup.StringSchema<string>,
  paymentPlanId: yup
    .string()
    .optional()
    .nullable()
    .notRequired() as yup.StringSchema<string>,
  notes: yup
    .string()
    .optional()
    .nullable()
    .notRequired() as yup.StringSchema<string>,
});
