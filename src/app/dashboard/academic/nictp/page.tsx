import NICTPContent from "@/content/dashboard/academic/nictp";
import {
  getCenters,
  getCourses,
  getLeads,
  getLoggedInUser,
  getStudents
} from "@/lib/network";

export default async function NICTP() {
  // Fetch all data in parallel for maximum speed
  const [students, courses, centers, leads, user] = await Promise.all([
    getStudents(),
    getCourses(),
    getCenters(),
    getLeads(),
    getLoggedInUser(),
  ]);

  return (
    <NICTPContent
      students={students}
      courses={courses}
      centers={centers}
      leads={leads}
      user={user}
    />
  );
}

