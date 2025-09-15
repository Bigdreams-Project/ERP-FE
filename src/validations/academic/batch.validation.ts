import * as yup from "yup";
 
export const batchSchema = yup.object().shape({
  code: yup.string().required("Batch code is required"),
  course: yup.string().required("Course is required"),
  startDate: yup.string().required("Start date is required"),
  endDate: yup.string().required("End date is required"),
  createdDate: yup.string().required("Created date is required"),
  duration: yup.string().required("Duration is required"),
  status: yup.string().required("Status is required"),
  schedule: yup
    .array()
    .of(
      yup
        .object()
        .shape({
          day: yup.string().required("Day of the week is required"),
          startTime: yup.string().required("Start time is required"),
          endTime: yup.string().required("End time is required"),
          duration: yup
            .number()
            .required("Duration is required")
            .min(1, "Duration must be at least 1 hour"),
        })
        .required()
    )
    .required()
    .min(1, "At least one class schedule is required"),
  faculty: yup.string().required("Faculty is required"),
  students: yup
    .array()
    .of(
      yup.object().shape({
        studentId: yup
          .string()
          .optional()
          .nullable()
          .notRequired() as yup.StringSchema<string | null>,
        leadId: yup
          .string()
          .optional()
          .nullable()
          .notRequired() as yup.StringSchema<string | null>,
        fullName: yup.string().required("Full name is required"),
        phone: yup
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
        address: yup.string().required("Home address is required"),
        parentGuardianName: yup
          .string()
          .required("Parent/Guardian name is required"),
        parentGuardianPhone: yup
          .string()
          .required("Parent/Guardian phone is required")
          .matches(
            /^\+\d{1,3} \d{3} \d{3}-\d{4}$/,
            "Phone number must be in the format +234 815 815-9170"
          ),
        parentGuardianEmail: yup
          .string()
          .email("Invalid email format")
          .nullable()
          .notRequired() as yup.StringSchema<string | null>,
        courseEnrolled: yup.string().required("Course of interest is required"),
        dateEnrolled: yup.string().required("Date enrolled is required"),
        batch: yup
          .string()
          .optional()
          .nullable()
          .notRequired() as yup.StringSchema<string>,
        status: yup
          .string()
          .optional()
          .nullable()
          .notRequired() as yup.StringSchema<string>,
        paymentPlan: yup.string().required(),
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
      })
    )
    .required()
    .min(1, "At least one student must be selected"),
});
