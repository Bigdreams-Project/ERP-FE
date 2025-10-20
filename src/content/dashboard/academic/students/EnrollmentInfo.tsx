import { Student } from "@/types/academic/student.interface";
import Card from "./Card";
import InfoItem from "./InfoItem";
import { formatDate } from "@/lib/utils";

interface Props {
  data: Student;
}

const EnrollmentInfo = ({ data }: Props) => (
  <Card title="Student & Enrollment Info" className="h-full">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
      <InfoItem label="Student Name" value={data.fullName} />
      <InfoItem label="Student ID" value={data.studentId} />

      <InfoItem
        label="Course"
        value={
          data.courses && data.courses.length > 0
            ? data.courses[0].name
            : "Not yet enrolled in a course."
        }
      />
      <InfoItem
        label="Batch"
        value={
          data.courses && data.courses.length > 0
            ? data.courses[0].name
            : "Not yet added to a batch."
        }
      />

      <InfoItem label="Enrollment Date" value={formatDate(data.enrolledDate)} />
      <InfoItem label="Status" value={data.status} isStatus={true} />
    </div>
  </Card>
);

export default EnrollmentInfo;
