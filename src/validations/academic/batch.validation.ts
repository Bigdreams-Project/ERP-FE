import * as yup from "yup";

export const batchSchema = yup.object().shape({
  courseId: yup.string().required("Course is required"),
  centerId: yup.string().required("Center is required"),
  startDate: yup.string().required("Start date is required"),
  endDate: yup.string().required("End date is required"),
  duration: yup.string().required("Duration is required"),
  status: yup.string().optional().nullable().notRequired() as yup.StringSchema<
    string | null
  >,
  schedules: yup
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
  facultyId: yup.string().required("Faculty is required"),
  students: yup
    .array()
    .of(yup.string().required())
    .min(1, "At least one student must be selected")
    .required("Students are required"),
});
