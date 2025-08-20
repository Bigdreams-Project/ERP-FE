import * as yup from "yup";

export const courseSchema = yup.object().shape({
  courseCode: yup.string().required("Course code is required"),
  courseName: yup.string().required("Course name is required"),
  courseType: yup.string().required("Course type is required"),
  durationMonths: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Duration is required")
    .min(1, "Duration must be at least 1 month"),
  lumpSumFee: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Lump sum fee is required")
    .min(0, "Fee must be a positive number"),
  baseEnrollmentFee: yup
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
});
