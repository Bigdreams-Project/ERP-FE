import * as yup from "yup";

export const batchSchema = yup.object().shape({
  batchCode: yup.string().required("Batch code is required"),
  course: yup.string().required("Course is required"),
  startDate: yup.string().required("Start date is required"),
  endDate: yup.string().required("End date is required"),
  classSchedule: yup
    .array()
    .of(
      yup
        .object()
        .shape({
          dayOfWeek: yup.string().required("Day of the week is required"),
          time: yup.string().required("Time is required"),
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
  selectedStudents: yup
    .array()
    .of(yup.string().required())
    .required()
    .min(1, "At least one student must be selected"),
});