import * as yup from "yup";

export const courseSchema = yup.object().shape({
  code: yup.string().required("Course code is required"),
  name: yup.string().required("Course name is required"),
  type: yup.string().required("Course type is required"),
  duration: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Duration is required")
    .min(1, "Duration must be at least 1 month"),
  lumpSumFee: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Lump sum fee is required")
    .min(0, "Fee must be a positive number"),
  baseFee: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Base enrollment fee is required")
    .min(0, "Fee must be a positive number"),
  maxInstallments: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Max installments is required")
    .min(1, "Installments must be at least 1"),
  costPerInstallment: yup.number().nullable().notRequired() as yup.NumberSchema<
    number | null
  >,
  centers: yup
    .array()
    .of(yup.string().required())
    .required()
    .min(1, "At least one center must be selected"),
  status: yup.string().required("Course status is required"),
  leads: yup
    .array()
    .of(
      yup.object().shape({
        fullname: yup.string().required("Full name is required"),
        email: yup
          .string()
          .email("Invalid email format")
          .required("Email is required"),
        phone: yup
          .string()
          .required("Phone number is required")
          .matches(
            /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
            "Phone number format: (XXX) XXX-XXXX"
          ),
        address: yup.string().required("Address is required"),
        parentName: yup.string().required("Parent's name is required"),
        parentPhone: yup
          .string()
          .required("Parent's phone number is required")
          .matches(
            /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
            "Phone number format: (XXX) XXX-XXXX"
          ),
        parentEmail: yup
          .string()
          .email("Invalid email format")
          .nullable()
          .notRequired() as yup.StringSchema<string | null>,
        course: yup.string().required("Course of interest is required"),
        enquiryDate: yup.string().required("Enquiry date is required"),
        source: yup.string().required("Source is required"),
        status: yup.string().required("Status is required"),
        nextFollowup: yup.string().required("Next follow-up date is required"),
        studyType: yup.string().required("Study type is required"),
        note: yup.string().required("Study type is required"),
      })
    )
    .required()
    .min(1, "At least one lead must be selected"),
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
