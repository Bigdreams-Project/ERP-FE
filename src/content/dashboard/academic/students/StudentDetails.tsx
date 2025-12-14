"use client";
import StudentModal from "@/components/modals/academic/StudentModal";
import StudentDeleteModal from "@/components/modals/academic/StudentDeleteModal";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import {
  hardDeleteStudentClient,
  getStudentClient,
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
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
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
  Upload,
  X,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { BiMoney } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { Trash2 } from "lucide-react";
import AttendanceCalendar from "./AttendanceCalendar";
import { uploadFileClient, getStudentFilesClient } from "@/lib/client-network";

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
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadedPresignedUrl, setUploadedPresignedUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Fetch student data with refetch capability
  const { data: currentStudent = student, refetch: refetchStudent } = useQuery({
    queryKey: ["student", student.id],
    queryFn: () => getStudentClient(student.id),
    initialData: student,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Fetch profile image
  const { data: profileImageFile, refetch: refetchProfileImage } = useQuery({
    queryKey: ["student-profile-image", student.id],
    queryFn: () => getStudentFilesClient(student.id, "profile_image"),
    select: (files) => {
      if (files && files.length > 0) {
      }
      return files?.[0] || null;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  // Debug: Log student data structure
  useEffect(() => {
    if (student?.courses) {
    }
    if (student?.batches) {
      if (student.batches[0]) {
      }
    }
  }, [student, courses]);

  // Debug: Log profile image changes
  useEffect(() => {
    if (profileImageFile) {
      console.log("=== Profile Image File Debug ===");
      console.log("Full profile image file object:", profileImageFile);
      console.log("Profile image file URL:", profileImageFile.fileUrl);
      console.log("Profile image presignedURL (capital):", profileImageFile.presignedURL);
      console.log("Profile image presignedUrl (lowercase):", profileImageFile.presignedUrl);
      console.log("All keys in profileImageFile:", Object.keys(profileImageFile));
      console.log("=================================");
    }
  }, [profileImageFile]);

  // Debug: Log student image changes and clear temporary presigned URL when we have presignedURL from backend
  useEffect(() => {
    if (currentStudent?.image) {
    }
    
    // Clear temporary presigned URL when backend returns presignedURL in file object
    if (uploadedPresignedUrl && (profileImageFile?.presignedURL || profileImageFile?.presignedUrl)) {
      const presignedUrl = profileImageFile?.presignedURL || profileImageFile?.presignedUrl;
      console.log("Clearing temporary presigned URL, using presignedURL from backend:", presignedUrl);
      setUploadedPresignedUrl(null);
    }
  }, [currentStudent, uploadedPresignedUrl, profileImageFile?.presignedURL, profileImageFile?.presignedUrl]);


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
      showError(error.message || "Failed to delete student");
    }
  };

  const handleImageUpload = async (file: File) => {
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      showError("Invalid file type. Only JPG and PNG are accepted.");
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showError("File size exceeds 5MB limit.");
      return;
    }

    setIsUploadingImage(true);
    try {
      const uploadResponse = await uploadFileClient(file, student.id, "profile_image");
      
      // Extract presignedURL from response (backend returns presignedURL with capital URL)
      const presignedUrl = uploadResponse?.presignedURL || uploadResponse?.presignedUrl || uploadResponse?.studentImageUrl || uploadResponse?.fileUrl;
      
      // Log the presignedURL to console
      if (presignedUrl) {
        // Store the presigned URL to use immediately
        setUploadedPresignedUrl(presignedUrl);
      }
      
      showSuccess("Profile image uploaded successfully!");
      
      // Refetch student data to get updated image with presigned URL
      await refetchStudent();
      
      // Invalidate and refetch the profile image query
      await queryClient.invalidateQueries({ queryKey: ["student-profile-image", student.id] });
      await refetchProfileImage();
      queryClient.invalidateQueries({ queryKey: ["students"] });
      
      // Note: The temporary presigned URL will be cleared automatically by useEffect 
      // when currentStudent.image is available from the refetched data
    } catch (error: any) {
      showError(error.message || "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Get the image URL - prefer presignedUrl from upload, then uploaded profile image, then student.image
  // Get the image URL - prioritize in this order:
  // 1. presignedURL from file object (backend returns this with capital URL)
  // 2. Presigned URL from upload (temporary, until refetch)
  // 3. Student image (backend converts S3 URLs to presigned URLs automatically)
  // Note: Backend returns presignedURL (capital URL) in the file object
  const getImageUrl = () => {
    // First priority: presignedURL from file object (backend returns this with capital URL)
    if (profileImageFile?.presignedURL) {
      console.log("Using presignedURL from file object:", profileImageFile.presignedURL);
      return profileImageFile.presignedURL;
    }
    
    // Fallback to lowercase presignedUrl for backward compatibility
    if (profileImageFile?.presignedUrl) {
      console.log("Using presignedUrl (lowercase) from file object:", profileImageFile.presignedUrl);
      return profileImageFile.presignedUrl;
    }
    
    // Second priority: presigned URL from upload (temporary, until refetch completes)
    if (uploadedPresignedUrl) {
      return uploadedPresignedUrl;
    }
    
    // Third priority: student image (backend converts S3 URLs to presigned URLs automatically)
    if (currentStudent?.image) {
      return currentStudent.image;
    }
    
    // Fallback to original student image
    if (student.image) {
      return student.image;
    }
    
    return null;
  };
  
  const displayImageUrl = getImageUrl();
  
  // Reset image loading state when image URL changes
  useEffect(() => {
    if (displayImageUrl) {
      setIsImageLoading(true);
    } else {
      setIsImageLoading(false);
    }
  }, [displayImageUrl]);
  
  // Debug log the display URL
  useEffect(() => {
    console.log("=== Image URL Debug ===");
    console.log("Display image URL:", displayImageUrl);
    console.log("Profile image file:", profileImageFile);
    console.log("Profile image file URL:", profileImageFile?.fileUrl);
    console.log("Profile image presignedURL (capital):", profileImageFile?.presignedURL);
    console.log("Profile image presignedUrl (lowercase):", profileImageFile?.presignedUrl);
    console.log("Current student image:", currentStudent?.image);
    console.log("Uploaded presigned URL:", uploadedPresignedUrl);
    console.log("Original student image:", student.image);
    console.log("Is display URL presigned?", displayImageUrl?.includes('?') || displayImageUrl?.includes('X-Amz-'));
    console.log("======================");
  }, [displayImageUrl, currentStudent?.image, uploadedPresignedUrl, profileImageFile, student.image]);

  const renderSection = (title: string, content: string, Icon: any) => (
    <div className="bg-white dark:bg-gray-800 px-2 py-4 rounded-lg flex items-center mb-4">
      {Icon && (
        <div className="text-xl mr-3 text-gray-500 dark:text-gray-400">
          <Icon size={20} />
        </div>
      )}
      <div className="flex-1">
        <div className="font-semibold text-gray-800 dark:text-gray-200">{title}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">{content}</div>
      </div>
    </div>
  );


  return (
    <div className="font-inter text-gray-200">
      <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
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
              View Payments
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
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

        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2 p-4 pt-6 border-t border-gray-300 rounded-lg shadow-md shadow-gray-400">
            <div className="flex flex-col items-center">
              <div className="relative">
                {displayImageUrl ? (
                  <>
                    {/* Loading indicator */}
                    {isImageLoading && (
                      <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-gray-200 bg-gray-100 dark:bg-gray-700 flex items-center justify-center z-10">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                      </div>
                    )}
                    {/* Use regular img tag for ALL S3 URLs (both presigned and regular) */}
                    {/* S3 URLs may not work with Next.js Image optimization and may require authentication */}
                    {displayImageUrl.includes('tecterminal.s3') || displayImageUrl.includes('?') || displayImageUrl.includes('X-Amz-') ? (
                      <img
                        src={displayImageUrl}
                        alt={student.fullName}
                        width={128}
                        height={128}
                        className={`w-32 h-32 rounded-full object-cover border-4 border-gray-200 ${isImageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
                        onLoad={() => {
                          setIsImageLoading(false);
                        }}
                        onError={(e) => {
                          setIsImageLoading(false);
                        }}
                      />
                    ) : (
                      <Image
                        src={displayImageUrl}
                        alt={student.fullName}
                        width={128}
                        height={128}
                        priority
                        className={`rounded-full object-cover border-4 border-gray-200 ${isImageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
                        unoptimized={displayImageUrl.startsWith('http')}
                        onLoad={() => {
                          setIsImageLoading(false);
                        }}
                        onError={() => {
                          setIsImageLoading(false);
                        }}
                      />
                    )}
                  </>
                ) : (
                  <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-gray-200">
                    <CircleUserRound className="w-full h-full text-gray-400" />
                  </div>
                )}
                <button
                  onClick={() => {
                    imageInputRef.current?.click();
                  }}
                  className="absolute bottom-2 right-0 bg-blue-600 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                  title="Upload profile image"
                >
                  {isUploadingImage ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  ) : (
                    <Upload size={14} />
                  )}
                </button>
                <input
                  ref={imageInputRef}
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleImageInputChange}
                  disabled={isUploadingImage}
                />
              </div>

              <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">
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
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg flex items-center">
                  <div className="text-xl mr-3 text-gray-500">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 dark:text-gray-200">Status</div>
                    <div className="w-full text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border-none focus:ring-0">
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

            {/* Financial & Attendance section hidden */}
            {false && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-700 mb-4">
                  Financial & Attendance
                </h3>
                <div className="space-y-4">
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center">
                    <div className="text-xl mr-3 text-gray-500 dark:text-gray-400">
                      <Coins size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 dark:text-gray-200">
                        Payment Status
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center justify-between">
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
                        <span className="bg-blue-500 dark:bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
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
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center">
                    <div className="text-xl mr-3 text-gray-500 dark:text-gray-400">
                      <Percent size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 dark:text-gray-200">
                        Attendance
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                        <div className="w-full h-2 bg-blue-200 dark:bg-blue-900/40 rounded-full mr-2">
                          <div
                            className="bg-blue-500 dark:bg-blue-600 h-full rounded-full"
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
            )}
            <button className="mt-8 w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors">
              Add Note
            </button>
          </div>

          <div className="lg:col-span-2 space-y-8 p-4 border-t border-gray-300 rounded-lg shadow-md shadow-gray-400">
            {/* Home Address */}
            <div className="bg-white dark:bg-gray-800 py-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Home Address
              </h3>
              {renderSection("", student.address, Home)}
            </div>
            <div className="bg-white dark:bg-gray-800 py-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
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

            {/* Notes */}
            <div>
              <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">
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
                        <p className="text-gray-800 dark:text-gray-200">{note.note}</p>
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

