"use client";

import AddPaymentModal from "@/components/modals/academic/AddPaymentModal";
import { getStudentCourses } from "@/lib/network";
import { formatDate } from "@/lib/utils";
import { Course } from "@/types/academic/course.interface";
import { Student } from "@/types/academic/student.interface";
import { useEffect, useState } from "react";
import Card from "./Card";
import InfoItem from "./InfoItem";

interface Props {
  data: Student;
}

const StudentCourses = ({ data }: Props) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getStudentCourses(data.id);
        console.log("Courses:", res);

        const formattedCourses = res.map((item: any) => item.course);
        setCourses(formattedCourses);
      } catch (error) {
        console.error("Failed to fetch student courses:", error);
      } finally {
        setLoading(false);
      }
    };

    if (data?.id) fetchCourses();
  }, [data?.id]);

  if (loading) {
    return (
      <Card title="Courses" className="h-full">
        <p className="text-gray-500 text-sm">Loading courses...</p>
      </Card>
    );
  }

  return (
    <Card title="Courses" className="h-full">
      {courses.length === 0 ? (
        <p className="text-gray-500 text-sm">No courses enrolled yet.</p>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => {
            return (
              <div
                key={course.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-800">{course.name}</h3>
                  <button
                    onClick={() => setSelectedCourse({ course })}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 transition"
                  >
                    Add Payment
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-x-6">
                  <InfoItem
                    label="Total Fee"
                    value={
                      course?.courseAssignments[0].baseFee
                        ? `₦${course?.courseAssignments[0].baseFee.toLocaleString()}`
                        : "N/A"
                    }
                  />
                  {/* <InfoItem
                    label="Amount Paid"
                    value={
                      payment?.paid ? `₦${payment.paid.toLocaleString()}` : "₦0"
                    }
                    valueColor="text-green-600"
                  /> */}
                  {/* <InfoItem
                    label="Balance Due"
                    value={
                      payment?.pending
                        ? `₦${payment.pending.toLocaleString()}`
                        : "₦0"
                    }
                    valueColor="text-red-600"
                  />
                  <InfoItem
                    label="Next Payment Due"
                    value={
                      payment?.nextPaymentDate
                        ? formatDate(payment.nextPaymentDate)
                        : "N/A"
                    }
                    valueColor="text-gray-700"
                  /> */}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedCourse && (
        <AddPaymentModal
          course={selectedCourse.course}
          payment={selectedCourse.payment}
          studentId={data.id}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </Card>
  );
};

export default StudentCourses;
