import * as yup from "yup";

export const enrollmentSchema = yup.object().shape({
  leadId: yup.string().optional().nullable().notRequired() as yup.StringSchema<
    string | null
  >,
  fullName: yup.string().required("Full name is required"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^\+\d{1,3} \d{3} \d{3}-\d{4}$/,
      "Phone number must be in the format +234 815 815-9170"
    ),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  homeAddress: yup.string().required("Home address is required"),
  parentName: yup.string().required("Parent/Guardian name is required"),
  parentPhone: yup
    .string()
    .required("Parent/Guardian phone is required")
    .matches(
      /^\+\d{1,3} \d{3} \d{3}-\d{4}$/,
      "Phone number must be in the format +234 815 815-9170"
    ),
  parentEmail: yup
    .string()
    .email("Invalid email format")
    .nullable()
    .notRequired() as yup.StringSchema<string | null>,
  courseOfInterest: yup.string().required("Course of interest is required"),
  batch: yup.string().required("Batch is required"),
  paymentPlan: yup
    .string()
    .oneOf(["Lump Sum", "Installments"])
    .required("Payment plan is required"),
  lumpSum: yup
    .number()
    .transform((value) =>
      isNaN(value) || value === null || value === undefined ? null : value
    )
    .when("paymentPlan", {
      is: "Lump Sum",
      then: (schema) =>
        schema
          .required("Lump sum is required")
          .min(0, "Lump sum must be a positive number"),
      otherwise: (schema) => schema.nullable().optional(),
    })
    .nullable()
    .notRequired() as yup.NumberSchema<number | null>,
  numberOfInstallments: yup
    .number()
    .transform((value) =>
      isNaN(value) || value === null || value === undefined ? null : value
    )
    .when("paymentPlan", {
      is: "Installments",
      then: (schema) =>
        schema
          .required("Number of installments is required")
          .min(1, "Must be at least 1 installment"),
      otherwise: (schema) => schema.nullable().optional(),
    })
    .nullable()
    .notRequired() as yup.NumberSchema<number | null>,
  comments: yup
    .string()
    .optional()
    .nullable()
    .notRequired() as yup.StringSchema<string | null>,
});
