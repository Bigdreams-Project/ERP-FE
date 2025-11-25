import ArchiveContent from "@/content/dashboard/academic/archive";
import { getArchiveRecords, getCenters, getLoggedInUser } from "@/lib/network";
import { isAdmin } from "@/lib/auth/role-check";
import { redirect } from "next/navigation";

export default async function Archive() {
  // Check admin access server-side
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    redirect("/dashboard/academic/students");
  }

  // Fetch archive data, centers, and user in parallel
  const [archiveData, centers, user] = await Promise.all([
    getArchiveRecords({ page: 1, limit: 10 }),
    getCenters(),
    getLoggedInUser(),
  ]);

  return (
    <ArchiveContent
      archiveRecords={archiveData?.data || []}
      totalRecords={archiveData?.total || 0}
      centers={centers}
      user={user}
    />
  );
}

