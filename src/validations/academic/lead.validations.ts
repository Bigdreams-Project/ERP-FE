import * as yup from "yup";

export const leadSchema = yup.object().shape({
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
  address: yup.string().required("Address is required"),
  birthDate: yup.string().required("Birth date is required"),
  guardianName: yup.string().required("Guardian's name is required"),
  guardianPhone: yup
    .string()
    .required("Guardian's phone number is required")
    .matches(
      /^0\d{10}$/,
      "Phone number must be 11 digits and start with 0 (e.g., 07033880063)"
    ),
  guardianEmail: yup
    .string()
    .email("Invalid email format")
    .nullable()
    .notRequired() as yup.StringSchema<string | null>,
  centerId: yup.string().required("Center is required"),
  courseId: yup.string().required("Course of interest is required"),
  enquiryDate: yup.string().required("Enquiry date is required"),
  source: yup.string().required("Source is required"),
  status: yup.string().required("Status is required"),
  assignedTo: yup.string().required("Assigned to is required"),
  lastFollowUpDate: yup.string().required("Last follow-up date is required"),
  nextFollowUpDate: yup.string().required("Next follow-up date is required"),
  studyType: yup.string().required("Study type is required"),
  note: yup.string().required("Note is required")
    .nullable()
    .notRequired() as yup.StringSchema<string | null>,
});
