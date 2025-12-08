import * as yup from "yup";

export const courseSchema = yup.object().shape({
  name: yup.string().required("Course name is required"),
  type: yup.string().required("Course type is required"),
  duration: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Duration is required")
    .min(1, "Duration must be at least 1 month"),
  oldId: yup.string().optional(),
});
