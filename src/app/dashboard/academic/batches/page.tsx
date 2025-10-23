export const dynamic = "force-dynamic";
import BatchesContent from "@/content/dashboard/academic/batches";
import {
  getBatches,
  getCourses,
  getFaculties,
  getStudents,
} from "@/lib/network";

export default async function Batches() {
  const batches = await getBatches();
  const courses = await getCourses();
  const students = await getStudents();
  const faculties = await getFaculties();

  return (
    <BatchesContent
      batches={batches}
      courses={courses}
      students={students}
      faculties={faculties}
    />
  );
}
