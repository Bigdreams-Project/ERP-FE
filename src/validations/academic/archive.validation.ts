import * as yup from "yup";

export const archiveRecordSchema = yup.object().shape({
  centerId: yup.string().required("Center ID is required"),
  userOldId: yup.string().required("User Old ID is required"),
  userNewId: yup
    .string()
    .nullable()
    .notRequired() as yup.StringSchema<string | null>,
  fullname: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  courseEnrolled: yup.string().required("Course enrolled is required"),
  coursePrice: yup
    .number()
    .required("Course price is required")
    .min(0, "Course price must be positive"),
  enrollmentDate: yup.string().required("Enrollment date is required"),
  birthDate: yup.string().required("Birth date is required"),
  oldStudentId: yup.string().required("Old Student ID is required"),
  newStudentId: yup
    .string()
    .nullable()
    .notRequired() as yup.StringSchema<string | null>,
  totalPayment: yup
    .number()
    .required("Total payment is required")
    .min(0, "Total payment must be positive")
    .default(0),
  pendingPayment: yup
    .number()
    .required("Pending payment is required")
    .min(0, "Pending payment must be positive")
    .default(0),
  status: yup.string().required("Status is required"),
  source: yup
    .string()
    .oneOf(["legacy_erp", "graduated"], "Source must be legacy_erp or graduated")
    .nullable()
    .notRequired() as yup.StringSchema<"legacy_erp" | "graduated" | null>,
});

export const updateArchiveRecordSchema = yup.object().shape({
  id: yup.string().required("ID is required"),
  centerId: yup.string().optional(),
  userOldId: yup.string().optional(),
  userNewId: yup
    .string()
    .nullable()
    .notRequired() as yup.StringSchema<string | null>,
  fullname: yup.string().optional(),
  email: yup.string().email("Invalid email format").optional(),
  phone: yup.string().optional(),
  courseEnrolled: yup.string().optional(),
  coursePrice: yup.number().min(0, "Course price must be positive").optional(),
  enrollmentDate: yup.string().optional(),
  birthDate: yup.string().optional(),
  oldStudentId: yup.string().optional(),
  newStudentId: yup
    .string()
    .nullable()
    .notRequired() as yup.StringSchema<string | null>,
  totalPayment: yup.number().min(0, "Total payment must be positive").optional(),
  pendingPayment: yup
    .number()
    .min(0, "Pending payment must be positive")
    .optional(),
  status: yup.string().optional(),
  source: yup
    .string()
    .oneOf(["legacy_erp", "graduated"], "Source must be legacy_erp or graduated")
    .nullable()
    .notRequired() as yup.StringSchema<"legacy_erp" | "graduated" | null>,
});

export const bulkUploadArchiveSchema = yup.array().of(archiveRecordSchema);

