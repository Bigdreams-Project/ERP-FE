"use client";
import StudentModal from "@/components/modals/academic/StudentModal";
import StudentDeleteModal from "@/components/modals/academic/StudentDeleteModal";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import {
  hardDeleteStudentClient,
} from "@/lib/client-network";
import { updateStudentClient } from "@/lib/client-network";
import { showError, showSuccess } from "@/lib/toast";
import { formatDate } from "@/lib/utils";
import { Center } from "@/types/academic/center.interface";
import { Course } from "@/types/academic/course.interface";
import { Lead } from "@/types/academic/lead.interface";
import { Student } from "@/types/academic/student.interface";
import { Payment } from "@/types/finance/payment.interface";
import { CreateStudent, UpdateStudent } from "@/types/requests/student.interface";
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
  Archive,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiMoney } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { Trash2 } from "lucide-react";
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
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const handleSave = async (payload: CreateStudent | UpdateStudent) => {
    try {
      // Convert CreateStudent payload to UpdateStudent format
      const updatePayload: UpdateStudent = {
        id: student.id,
        fullName: payload.fullName,
        phone: payload.phone,
        email: payload.email,
        address: payload.address,
        status: payload.status,
        centerId: payload.centerId,
        enrolledDate: payload.enrolledDate,
        birthDate: payload.birthDate,
        guardianName: payload.guardianName,
        guardianPhone: payload.guardianPhone,
        guardianEmail: payload.guardianEmail,
        guardianAddress: payload.guardianAddress,
        courseFee: payload.courseFee,
        lumpSumFee: payload.lumpSumFee,
        numberOfInstallments: payload.numberOfInstallments,
        paymentPlan: payload.paymentPlan,
        notes: payload.notes || "",
        courseId: payload.courseId,
        batchId: payload.batchId,
      };
      
      await updateStudentClient(student.id, updatePayload);
      showSuccess("Student updated successfully!");
      queryClient.invalidateQueries(["students"]);
      queryClient.invalidateQueries(["student", student.id]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save student:", error);
      showError("Failed to update student.");
    }
  };

  const handleHardDelete = async (studentId: string) => {
    try {
      await hardDeleteStudentClient(studentId);
      showSuccess("Student permanently deleted");
      setIsDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["students"] });
      router.push("/dashboard/academic/students");
    } catch (error: any) {
      console.error("Failed to delete student:", error);
      showError(error.message || "Failed to delete student");
    }
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
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex gap-2 items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
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
              className="flex gap-2 items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
            >
              <BiMoney />
              Record Payment
            </button>
            {isAdmin && !isAdminLoading && (
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex gap-2 items-center px-4 py-2 bg-red-600 rounded-lg text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Student Profile: {student.fullName}
          </h2>
          {false && (
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-lg">
              <Archive className="text-yellow-700" size={18} />
              <span className="text-sm font-semibold text-yellow-800">
                Archived
              </span>
            </div>
          )}
        </div>

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
                  student.batches && student.batches.length > 0 && student.batches[0]
                    ? `Start on ${formatDate(
                        student.batches[0].startDate
                      )} - End on ${formatDate(student.batches[0].endDate)}`
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
                          ? (() => {
                              const lastPayment = student.payments[student.payments.length - 1];
                              const pending = lastPayment.paymentPlan?.pending;
                              return !pending || pending === "0" || (pending && isNaN(Number(pending)))
                                ? "Paid"
                                : "Pending";
                            })()
                          : "No payments found"}
                      </span>
                      <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        {student.payments && student.payments.length > 0
                          ? (() => {
                              const lastPayment = student.payments[student.payments.length - 1];
                              const pending = lastPayment.paymentPlan?.pending;
                              return !pending || pending === "0" || (pending && isNaN(Number(pending)))
                                ? "Paid"
                                : "Pending";
                            })()
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
                        const nextPaymentDate = lastPayment.paymentPlan?.nextPaymentDate;
                        
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
                            {note.createdAt || note.updatedAt ? formatDate(note.createdAt || note.updatedAt) : "N/A"}
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

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        courses={courses}
        centers={centers}
        leads={leads}
        mode="edit"
        initialData={{
          leadId: student.leadId,
          fullName: student.fullName,
          phone: student.phone,
          email: student.email,
          address: student.address,
          status: student.status,
          centerId: student.centerId,
          enrolledDate: student.enrolledDate,
          birthDate: student.birthDate,
          guardianName: student.guardians?.[0]?.fullname || "",
          guardianPhone: student.guardians?.[0]?.phone || "",
          guardianEmail: student.guardians?.[0]?.email || null,
          guardianAddress: student.guardians?.[0]?.address || "",
          courseId: student.courses?.[0]?.id || "",
          batchId: student.batches?.[0]?.id || null,
          paymentPlan: student.paymentPlan,
          notes: student.comments || null,
        }}
      />

      <StudentDeleteModal
        student={student}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onHardDelete={handleHardDelete}
      />
    </div>
  );
};

export default StudentDetails;
