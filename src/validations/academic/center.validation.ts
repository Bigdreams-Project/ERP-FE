import * as yup from "yup";

export const centerSchema = yup.object().shape({
  centerName: yup.string().required("Center name is required"),
  location: yup.string().required("Location is required"),
  centerAddress: yup.string().required("Center address is required"),
  centerManagerName: yup.string().required("Center Manager name is required"),
  contactPhone: yup
    .string()
    .required("Contact phone is required")
    .matches(
      /^\+\d{1,3} \d{3} \d{3}-\d{4}$/,
      "Phone number must be in the format +234 815 815-9170"
    ),
  emailAddress: yup
    .string()
    .email("Invalid email format")
    .required("Email address is required"),
  status: yup.string().required("Status is required"),
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
});
