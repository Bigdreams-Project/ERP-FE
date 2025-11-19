"use client";
import EditStudentModal from "@/components/modals/academic/StudentEditModal";
import { updateStudent } from "@/lib/network";
import { showError, showSuccess } from "@/lib/toast";
import { formatDate } from "@/lib/utils";
import { Center } from "@/types/academic/center.interface";
import { Course } from "@/types/academic/course.interface";
import { Lead } from "@/types/academic/lead.interface";
import { Student } from "@/types/academic/student.interface";
import { Payment } from "@/types/finance/payment.interface";
import { UpdateStudent } from "@/types/requests/student.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  CircleUserRound,
  Clock,
  Coins,
  FileText,
  Home,
  MailIcon,
  Percent,
  PhoneIcon,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiMoney } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import AttendanceCalendar from "./AttendanceCalendar";

interface StudentDetailsProps {
  student: Student;
  courses: Course[];
  centers: Center[];
  leads: Lead[];
}

const StudentDetails = ({
  student,
  courses,
  centers,
  leads,
}: StudentDetailsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<Student>(student);

  // Debug: Log student data structure
  useEffect(() => {
    if (student?.courses) {
      console.log("Student courses structure:", student.courses);
      console.log("First course:", student.courses[0]);
      console.log("All courses prop:", courses);
    }
    if (student?.batches) {
      console.log("Student batches structure:", student.batches);
      console.log("First batch:", student.batches[0]);
      if (student.batches[0]) {
        console.log("Batch startDate:", student.batches[0]?.startDate);
        console.log("Batch endDate:", student.batches[0]?.endDate);
      }
    }
  }, [student, courses]);

  const { mutate: saveStudent, isPending } = useMutation({
    mutationFn: async (updatedStudent: Student | any) => {
      return await updateStudent(updatedStudent.id!, updatedStudent);
    },
    onSuccess: () => {
      showSuccess("Student updated successfully");
      setIsEditing(false);
      queryClient.invalidateQueries(["students"]);
      queryClient.invalidateQueries(["student", student.id]);
    },
    onError: (error: any) => {
      console.error(error);
      showError("Failed to update student");
    },
  });

  const handleSave = async (payload: UpdateStudent) => {
    try {
      const response = await updateStudent(student.id, payload);
      showSuccess("Student updated successfully!");
      queryClient.invalidateQueries(["students"]);
      queryClient.invalidateQueries(["student", student.id]);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to save student:", error);
      showError("Failed to update student.");
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      console.log("Data:", formData);
      saveStudent(formData);
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(student);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderSection = (title: string, content: string, Icon: any) => (
    <div className="bg-white px-2 py-4 rounded-lg flex items-center mb-4">
      {Icon && (
        <div className="text-xl mr-3 text-gray-500">
          <Icon size={20} />
        </div>
      )}
      <div className="flex-1">
        <div className="font-semibold text-gray-800">{title}</div>
        <div className="text-sm text-gray-600">{content}</div>
      </div>
    </div>
  );

  const renderPaymentHistory = () => {
    if (!student.payments || student.payments.length === 0) {
      return (
        <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 min-h-32">
          <span className="text-sm">
            No payment records found for this student.
          </span>
        </div>
      );
    }

    const sortedPayments = student.payments.sort(
      (a: Payment, b: Payment) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const paymentsToShow = sortedPayments.slice(0, 5);

    return (
      <div className="space-y-3">
        {paymentsToShow.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-indigo-50 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800">
                Payment on {formatDate(payment.createdAt)}
              </span>
              <span className="text-sm text-gray-500">
                {!payment.paymentPlan?.pending || payment.paymentPlan.pending === "0" || (payment.paymentPlan?.pending && isNaN(Number(payment.paymentPlan.pending)))
                  ? "Full Payment"
                  : `Partial Payment (Pending: ₦${Number(payment.paymentPlan.pending).toLocaleString()})`}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-emerald-600">
                ₦{payment.amount.toLocaleString()}
              </span>
              <Link href={`/dashboard/finance/payments/${payment.id}`}>
                <ArrowRight className="w-4 h-4 text-indigo-600" />
              </Link>
            </div>
          </div>
        ))}
        {student.payments.length > 0 && (
          <button className="w-full text-center py-2 text-indigo-600 font-medium hover:text-indigo-800 transition-colors text-sm">
            View All Payments ({student.payments.length})
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="font-inter text-gray-200">
      <div className="min-h-screen bg-white p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 relative left-[-7px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-left"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <p className="text-indigo-600 hover:text-indigo-800 font-medium">
                Academic &gt; Students &gt; {student.fullName}
              </p>
            </div>
            <a
              href="/dashboard/academic/students"
              className="mt-2 text-blue-600 hover:underline text-sm font-semibold flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                />
              </svg>
              Back to Students List
            </a>
          </div>
          <div className="flex items-center space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditToggle}
                  className="flex items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex gap-2 items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  <MdEdit />
                  Edit
                </button>
                <button
                  onClick={() =>
                    router.push(
                      `/dashboard/academic/students/enrollment/${student.id}`
                    )
                  }
                  className="flex gap-2 items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  <BiMoney />
                  Record Payment
                </button>
              </>
            )}
          </div>
        </div>

        <h2 className="text-3xl font-extrabold mb-6 text-gray-900">
          Student Profile: {student.fullName}
        </h2>

        <div className="bg-white rounded-lg w-full max-w-6xl py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2 p-4 pt-6 border-t border-gray-300 rounded-lg shadow-md shadow-gray-400">
            <div className="flex flex-col items-center">
              {student.image ? (
                <Image
                  src={student.image}
                  alt="action"
                  width={128}
                  height={128}
                  priority
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-gray-200">
                  <CircleUserRound className="w-full h-full text-gray-400" />
                </div>
              )}

              <div className="text-xl font-semibold text-gray-800">
                {student.fullName}
              </div>
              <div className="text-sm text-gray-500">{student.studentId}</div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-700 mb-4">
                General Information
              </h3>
              <div className="space-y-4">
                {renderSection(
                  "Created Date",
                  formatDate(student.createdAt),
                  CalendarDays
                )}
                {renderSection(
                  "Center",
                  student.center?.name || "Not assigned",
                  Building2
                )}
                {renderSection(
                  "Course",
                  (() => {
                    // Try multiple ways to get the course name
                    if (student.courses && student.courses.length > 0) {
                      const firstCourseItem = student.courses[0];
                      
                      // Check if it's nested in a course property (StudentOnCourse structure)
                      if ((firstCourseItem as any)?.course?.name) {
                        return (firstCourseItem as any).course.name;
                      }
                      
                      // Check if it's a direct Course object with name
                      if ((firstCourseItem as any)?.name) {
                        return (firstCourseItem as any).name;
                      }
                      
                      // Check if it has a courseId we can look up
                      const courseId = (firstCourseItem as any)?.courseId || (firstCourseItem as any)?.course?.id || (firstCourseItem as any)?.id;
                      if (courseId && courses && courses.length > 0) {
                        const foundCourse = courses.find(c => c.id === courseId);
                        if (foundCourse?.name) {
                          return foundCourse.name;
                        }
                      }
                    }
                    return "Not yet enrolled.";
                  })(),
                  BookOpen
                )}
                {renderSection("Batch", student.batches[0]?.code || "Not assigned", Users)}
                {renderSection(
                  "Dates",
                  student.batches && student.batches.length > 0
                    ? `Start on ${formatDate(
                        student.batches[0]?.startDate
                      )} - End on ${formatDate(student.batches[0]?.endDate)}`
                    : "Start and end dates not available",
                  Clock
                )}
                <div className="bg-white p-4 rounded-lg flex items-center">
                  <div className="text-xl mr-3 text-gray-500">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">Status</div>
                    <div className="w-full text-sm text-gray-600 bg-white border-none focus:ring-0">
                      <span>{student.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-700 mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                {renderSection("Email", student.email, MailIcon)}
                {renderSection("Phone", student.phone, PhoneIcon)}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-700 mb-4">
                Financial & Attendance
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg flex items-center">
                  <div className="text-xl mr-3 text-gray-500">
                    <Coins size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">
                      Payment Status
                    </div>
                    <div className="text-sm text-gray-600 flex items-center justify-between">
                      <span>
                        {student.payments && student.payments.length > 0
                          ? student.payments[student.payments.length - 1]
                              .pending === 0
                            ? "Paid"
                            : "Pending"
                          : "No payments found"}
                      </span>
                      <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        {student.payments && student.payments.length > 0
                          ? student.payments[student.payments.length - 1]
                              .pending === 0
                            ? "Paid"
                            : "Pending"
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg flex items-center">
                  <div className="text-xl mr-3 text-gray-500">
                    <Percent size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">
                      Attendance
                    </div>
                    <div className="text-sm text-gray-600 flex items-center">
                      <div className="w-full h-2 bg-blue-200 rounded-full mr-2">
                        <div
                          className="bg-blue-500 h-full rounded-full"
                          style={{
                            width: `${2}%`,
                          }}
                        ></div>
                      </div>
                      <span>{2}%</span>
                    </div>
                  </div>
                </div>
                {renderSection(
                  "Next Payment Due",
                  student.payments && student.payments.length > 0
                    ? (() => {
                        const lastPayment = student.payments[student.payments.length - 1];
                        const nextPaymentDate = 
                          lastPayment.nextPaymentDate || 
                          (lastPayment as any).paymentPlan?.nextPaymentDate;
                        
                        if (!nextPaymentDate) return "N/A";
                        
                        // Validate date before formatting
                        const date = new Date(nextPaymentDate);
                        if (isNaN(date.getTime())) return "N/A";
                        
                        return formatDate(nextPaymentDate);
                      })()
                    : "No payments found",
                  CalendarDays
                )}
              </div>
            </div>
            <button className="mt-8 w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors">
              Add Note
            </button>
          </div>

          <div className="lg:col-span-2 space-y-8 p-4 border-t border-gray-300 rounded-lg shadow-md shadow-gray-400">
            {/* Home Address */}
            <div className="bg-white py-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Home Address
              </h3>
              {renderSection("", student.address, Home)}
            </div>
            <div className="bg-white py-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Parent/Guardian
              </h3>
              {renderSection(
                "Name",
                student.guardians && student.guardians.length
                  ? student.guardians[0]?.fullname
                  : "",
                User
              )}
              {renderSection(
                "Email",
                student.guardians && student.guardians.length
                  ? student.guardians[0]?.email
                  : "",
                MailIcon
              )}
            </div>

            {/* Payment History */}
            <div className="bg-white py-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Payment History
              </h3>
              {renderPaymentHistory()}
            </div>

            {/* Notes */}
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                Notes
              </h3>
              <div className="space-y-2">
                {student?.notes?.map(
                  (note, index) =>
                    note.note && (
                      <div key={note?.id!} className="mb-4">
                        <p className="text-sm text-gray-400 font-medium mb-1">
                          <span className="font-medium">
                            {formatDate(note.createdAt || note.updatedAt)}
                          </span>
                        </p>
                        <p className="text-gray-800">{note.note}</p>
                      </div>
                    )
                )}
              </div>
              <button className="mt-4 text-blue-600 text-sm font-medium p-3 shadow-md shadow-gray-400 rounded-md flex items-center space-x-1">
                <IoMdAdd />
                <span>Add note</span>
              </button>
            </div>

            {/* Attendance Records */}
            <div className="py-6 border-b border-gray-200">
              <AttendanceCalendar studentId={student.id} />
            </div>
          </div>
        </div>
      </div>

      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        student={student}
        courses={courses}
        centers={centers}
        mode="edit"
      />
    </div>
  );
};

export default StudentDetails;
