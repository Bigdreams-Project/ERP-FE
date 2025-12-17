import { Student } from "@/types/academic/student.interface";
import Card from "./Card";
import InfoItem from "./InfoItem";
import { formatDate } from "@/lib/utils";
import { programTypeLabels } from "@/data/constants/program.constants";

interface Props {
  data: Student;
}

const EnrollmentInfo = ({ data }: Props) => (
  <Card title="Student & Enrollment Info" className="h-full">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
      <InfoItem label="Student Name" value={data.fullName} />
      <InfoItem label="Student ID" value={data.studentId} />
      <InfoItem label="Enrollment Date" value={formatDate(data.enrolledDate)} />
      <InfoItem label="Status" value={data.status} isStatus={true} />
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Program Type
        </label>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
          data.programType === "JPTP" 
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : data.programType === "INTERNSHIP"
            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
            : data.programType === "NICTP"
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
        }`}>
          {programTypeLabels[data.programType as keyof typeof programTypeLabels] || "Regular Student"}
        </span>
      </div>
    </div>
  </Card>
);

export default EnrollmentInfo;
