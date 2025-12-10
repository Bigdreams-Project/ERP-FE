"use client";
import { Course } from "@/types/academic/course.interface";
import { Student } from "@/types/academic/student.interface";
import EnrollmentInfo from "./EnrollmentInfo";
import InvoiceDetails from "./StudentCourses";
import NewPaymentForm from "./NewPaymentForm";
import PaymentHistory from "./PaymentHistory";
import ProofOfPaymentUpload from "./ProofOfPaymentUpload";
import SystemActionsSummary from "./SystemActionsSummary";
import StudentCourses from "./StudentCourses";

interface StudentDetailsProps {
  student: Student;
  courses: Course[];
}

const StudentEnrollmentInfo = ({ student, courses }: StudentDetailsProps) => {
  const data = student;

  return (
    <div className="min-h-screen bg-white font-sans">
      <style>
        {`
        select {
          background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1rem;
          padding-right: 2.5rem;
        }
      `}
      </style>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Student & Enrollment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <EnrollmentInfo data={data} />
              </div>
              <div className="md:col-span-2">
                <StudentCourses data={data} />
              </div>
            </div>

            {/* Payment History - Moved to left section */}
            <PaymentHistory data={data} />

            {/* New Payment Form */}
            <NewPaymentForm courses={courses} studentId={data.id} />
          </div>

          <div className="lg:col-span-1 space-y-6">
            {/* Proof of Payment */}
            <ProofOfPaymentUpload data={data} />

            {/* System Actions Summary */}
            <SystemActionsSummary data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentEnrollmentInfo;
