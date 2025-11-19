// Removed force-dynamic for better caching
import BatchesContent from "@/content/dashboard/academic/batches";
import {
  getBatches,
  getCourses,
  getFaculties,
  getStudents,
} from "@/lib/network";

export default async function Batches() {
  // Fetch all data in parallel for maximum speed
  const [batches, courses, students, faculties] = await Promise.all([
    getBatches(),
    getCourses(),
    getStudents(),
    getFaculties(),
  ]);

  return (
    <BatchesContent
      batches={batches}
      courses={courses}
      students={students}
      faculties={faculties}
    />
  );
}
