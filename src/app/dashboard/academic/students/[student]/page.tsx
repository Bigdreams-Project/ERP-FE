import StudentDetails from "@/content/dashboard/academic/students/StudentDetails";
import { getCenters, getCourses, getLeads, getStudent } from "@/lib/network";
import { notFound } from "next/navigation";

export default async function Student({ params }: any) {
  const { student: studentId } = await params;

  try {
    const student = await getStudent(studentId);
    const courses = await getCourses();
    const centers = await getCenters();
    const leads = await getLeads();

    console.log("Student Details:", student);

    // Check if student exists
    if (!student || !student.id) {
      notFound();
    }

    return (
      <StudentDetails
        student={student}
        courses={courses}
        centers={centers}
        leads={leads}
      />
    );
  } catch (error: any) {
    console.error("Error fetching student:", error);
    // If it's a 404, show not found page
    if (error?.response?.status === 404) {
      notFound();
    }
    // Otherwise, throw to show error page
    throw error;
  }
}
