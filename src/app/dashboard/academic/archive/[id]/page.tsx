import ArchiveDetails from "@/content/dashboard/academic/archive/ArchiveDetails";
import { getArchiveRecord, getCenters } from "@/lib/network";
import { isAdmin } from "@/lib/auth/role-check";
import { redirect, notFound } from "next/navigation";

export default async function ArchiveRecord({ params }: any) {
  try {
    // Check admin access server-side
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      redirect("/dashboard/academic/archive");
    }

    const { id: archiveId } = await params;

    if (!archiveId) {
      notFound();
    }

    // Fetch data in parallel
    const [archiveRecord, centers] = await Promise.all([
      getArchiveRecord(archiveId),
      getCenters(),
    ]);

    // If archive record not found, show 404
    if (!archiveRecord) {
      notFound();
    }

    return (
      <ArchiveDetails
        archiveRecord={archiveRecord}
        centers={centers}
      />
    );
  } catch (error: any) {
    console.error("Error loading archive record:", error);
    console.error("Archive ID:", archiveId);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    
    // If it's a 404 or not found error, show 404 page
    if (error.response?.status === 404 || error.message?.includes("not found")) {
      notFound();
    }
    
    // If it's a 500 error, log more details and redirect
    if (error.response?.status === 500) {
      console.error("Backend 500 error - Check backend logs for details");
      console.error("Backend error message:", error.response?.data?.message || error.response?.data?.error);
    }
    
    // For other errors, redirect back to archive list
    redirect("/dashboard/academic/archive");
  }
}

