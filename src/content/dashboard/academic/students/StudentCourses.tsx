"use client";

import AddPaymentModal from "@/components/modals/academic/AddPaymentModal";
import { getStudentCourses } from "@/lib/network";
import { formatDate } from "@/lib/utils";
import { Student } from "@/types/academic/student.interface";
import { useEffect, useState } from "react";
import Card from "./Card";
import InfoItem from "./InfoItem";

interface Props {
  data: Student;
}

const StudentCourses = ({ data }: Props) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getStudentCourses(data.id);
        const formattedCourses = response.map((item: any) => item);
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
                  <h3 className="font-semibold text-gray-800">
                    {course.course.name}
                  </h3>
                  <button
                    onClick={() => setSelectedCourse({ course: course })}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 transition"
                  >
                    Add Payment
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-x-6">
                  <InfoItem
                    label="Total Fee"
                    value={
                      course?.paymentPlan
                        ? `₦${course?.paymentPlan.amount.toLocaleString()}`
                        : "N/A"
                    }
                  />
                  <InfoItem
                    label="Amount Paid"
                    value={
                      course?.paymentPlan
                        ? `₦${course?.paymentPlan.paid.toLocaleString()}`
                        : "N/A"
                    }
                    valueColor="text-green-600"
                  />
                  <InfoItem
                    label="Balance Due"
                    value={
                      course?.paymentPlan
                        ? `₦${course?.paymentPlan.pending.toLocaleString()}`
                        : "N/A"
                    }
                    valueColor="text-red-600"
                  />
                  <InfoItem
                    label="Next Payment Due"
                    value={
                      course?.paymentPlan?.nextPaymentDate
                        ? formatDate(course.paymentPlan.nextPaymentDate)
                        : "N/A"
                    }
                    valueColor="text-gray-700"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedCourse && (
        <AddPaymentModal
          course={selectedCourse.course}
          paymentPlan={selectedCourse.course.paymentPlan}
          studentId={data.id}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </Card>
  );
};

export default StudentCourses;
