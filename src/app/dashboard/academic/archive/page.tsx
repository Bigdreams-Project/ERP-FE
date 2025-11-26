import ArchiveContent from "@/content/dashboard/academic/archive";
import { getArchiveRecords, getCenters, getCourses, getLoggedInUser } from "@/lib/network";
import { isAdmin } from "@/lib/auth/role-check";
import { redirect } from "next/navigation";

export default async function Archive() {
  // Check admin access server-side
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    redirect("/dashboard/academic/students");
  }

  // Fetch archive data, centers, courses, and user in parallel
  const [archiveData, centers, courses, user] = await Promise.all([
    getArchiveRecords({ page: 1, limit: 10 }),
    getCenters(),
    getCourses(),
    getLoggedInUser(),
  ]);

  return (
    <ArchiveContent
      archiveRecords={archiveData?.data || []}
      totalRecords={archiveData?.total || 0}
      centers={centers}
      courses={courses}
      user={user}
    />
  );
}

