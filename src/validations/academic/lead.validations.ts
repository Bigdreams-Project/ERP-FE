import * as yup from "yup";

export const leadSchema = yup.object().shape({
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
});
