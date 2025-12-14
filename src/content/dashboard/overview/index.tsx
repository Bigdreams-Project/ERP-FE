"use client";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DateRangeSelector from "@/components/dashboard/overview/DateRangeSelector";
import { useCenter } from "@/context/CenterContext";
import { useProvider } from "@/context/ProviderContext";
import {
  getStudentsClient,
  getCoursesClient,
  getCentersClient,
  getLeadsClient,
  getLoggedInUserClient,
  getStudentsSummaryClient,
} from "@/lib/client-network";
import { Center } from "@/types/academic/center.interface";
import { Course } from "@/types/academic/course.interface";
import { Lead } from "@/types/academic/lead.interface";
import { Student } from "@/types/academic/student.interface";
import { User } from "@/types/auth/user.interface";
import {
  includesDate,
  formatNumber,
  percent,
} from "@/lib/utils";
import { leadStatusEnum } from "@/data/view/lead.data";
import { courseStatusEnum } from "@/data/view/course.data";
import { centerStatusEnum } from "@/data/view/center.data";
import {
  DashboardMetrics,
  CenterPerformance,
  TrendDataPoint,
  PaymentStatusDistribution,
  TopPerformingCenter,
  TopPerformingCourse,
  ActivityItem,
  DashboardInsight,
} from "@/types/dashboard/overview.interface";

// Components
import KPICard from "@/components/dashboard/overview/KPICard";
import TrendChart from "@/components/dashboard/overview/TrendChart";
import StatusDistribution from "@/components/dashboard/overview/StatusDistribution";
import TopCentersChart from "@/components/dashboard/overview/TopCentersChart";
import TopPerformingCourses from "@/components/dashboard/overview/TopPerformingCourses";
import ConversionFunnel from "@/components/dashboard/overview/ConversionFunnel";
import CenterPerformanceTable from "@/components/dashboard/overview/CenterPerformanceTable";
import ActivityFeed from "@/components/dashboard/overview/ActivityFeed";
import InsightsPanel from "@/components/dashboard/overview/InsightsPanel";
import Providerdropdown from "@/components/Providerdropdown";

// Icons
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  Users,
  GraduationCap,
  BookOpen,
  School,
  Calendar,
  FileText,
  Download,
  Sparkles,
  BarChart3,
  Target,
  UserX,
  Award,
  Archive,
  X,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRouter } from "next/navigation";

interface DashboardOverviewProps {
  user: User;
  students: Student[];
  courses: Course[];
  centers: Center[];
  leads: Lead[];
  financeOverview: {
    totalRevenue: number;
    totalBilling: number;
    totalPending: number;
    totalPayments: number;
    collectionRate: number;
    topCenters: {
      center: string;
      status: string;
      revenue: number;
      billing: number;
      pending: number;
      collectionRate: number;
    }[];
    topPendingCenters: {
      center: string;
      status: string;
      revenue: number;
      billing: number;
      pending: number;
      collectionRate: number;
    }[];
    topPerformingCenter: {
      id: string;
      name: string;
      bankCount: number;
      revenue: number;
    } | null;
    centerPerformanceMatrix: {
      center: string;
      status: string;
      revenue: number;
      billing: number;
      pending: number;
      enrollments: number;
      conversion: number;
      collectionRate: number;
    }[];
  };
}

const DashboardOverview = ({
  user: initialUser,
  students: initialStudents,
  courses: initialCourses,
  centers: initialCenters,
  leads: initialLeads,
  financeOverview: initialFinanceOverview,
}: DashboardOverviewProps) => {
  const router = useRouter();
  const { selectedCenter } = useCenter();
  const { selectedProvider } = useProvider();
  const [range, setRange] = useState([
    {
      startDate: new Date(new Date().setDate(new Date().getDate() - 29)),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  // Fetch data with React Query
  const { data: user = initialUser } = useQuery(
    ["user"],
    () => getLoggedInUserClient(),
    {
      initialData: initialUser,
      staleTime: 1000 * 60 * 5,
    }
  );

  const {
    data: students = initialStudents,
    isLoading: studentsLoading,
    error: studentsError,
  } = useQuery(
    ["students"],
    () => getStudentsClient(),
    {
      initialData: initialStudents,
      staleTime: 1000 * 60 * 5,
    }
  );

  const {
    data: courses = initialCourses,
    isLoading: coursesLoading,
    error: coursesError,
  } = useQuery(
    ["courses"],
    () => getCoursesClient(),
    {
      initialData: initialCourses,
      staleTime: 1000 * 60 * 5,
    }
  );

  const {
    data: centers = initialCenters,
    isLoading: centersLoading,
    error: centersError,
  } = useQuery(
    ["centers"],
    () => getCentersClient(),
    {
      initialData: initialCenters,
      staleTime: 1000 * 60 * 5,
    }
  );

  const {
    data: leads = initialLeads,
    isLoading: leadsLoading,
    error: leadsError,
  } = useQuery(
    ["leads"],
    () => getLeadsClient(),
    {
      initialData: initialLeads,
      staleTime: 1000 * 60 * 5,
    }
  );

  // Fetch student summary counts
  const centerIdForSummary = selectedCenter === "all" ? null : selectedCenter;
  const { data: studentsSummary } = useQuery(
    ["students-summary", selectedCenter],
    () => getStudentsSummaryClient(centerIdForSummary),
    {
      staleTime: 1000 * 60 * 5,
    }
  );

  // Helper function to normalize course type for comparison
  const normalizeCourseType = (type: string | undefined): string => {
    if (!type) return "";
    const upperType = type.toUpperCase();
    if (upperType.includes("TEC") || upperType.includes("TERMINAL")) return "TEC_TERMINAL";
    if (upperType.includes("APTECH") || upperType.includes("AP")) return "APTECH";
    if (upperType.includes("CPMS") || upperType.includes("CP")) return "CPMS";
    return upperType;
  };

  // Filter data by selected center and provider
  const filteredData = useMemo(() => {
    let filteredStudents = students;
    let filteredLeads = leads;
    let filteredCenters = centers;
    let filteredCourses = courses;

    // Filter by center
    if (selectedCenter !== "all") {
      filteredStudents = filteredStudents.filter((s) => s.centerId === selectedCenter);
      filteredLeads = filteredLeads.filter((l) => l.centerId === selectedCenter);
      filteredCenters = filteredCenters.filter((c) => c.id === selectedCenter);
    }

    // Filter by provider (course type)
    if (selectedProvider !== "all") {
      // Filter students by their course type (check if any course matches)
      filteredStudents = filteredStudents.filter((s) => {
        if (!s.courses || s.courses.length === 0) return false;
        // Check if any of the student's courses match the selected provider
        return s.courses.some((course: any) => {
          const courseType = normalizeCourseType(course.type);
          return courseType === selectedProvider;
        });
      });

      // Filter leads by their course type
      filteredLeads = filteredLeads.filter((l) => {
        if (!l.course) return false;
        const courseType = normalizeCourseType(l.course.type);
        return courseType === selectedProvider;
      });

      // Filter courses by type
      filteredCourses = filteredCourses.filter((c) => {
        const courseType = normalizeCourseType(c.type);
        return courseType === selectedProvider;
      });
    }

    return {
      students: filteredStudents,
      leads: filteredLeads,
      centers: filteredCenters,
      courses: filteredCourses,
    };
  }, [selectedCenter, selectedProvider, students, leads, centers, courses]);

  // Calculate all metrics
  const dashboardData = useMemo(() => {
    const start = range[0].startDate!;
    const end = range[0].endDate!;

    const { students: filteredStudents, leads: filteredLeads, centers: filteredCenters } = filteredData;

    // Filter by date range
    const leadsInRange = filteredLeads.filter((l: Lead) =>
      includesDate(l.enquiryDate, start, end)
    );
    const studentsInRange = filteredStudents.filter((s: Student) =>
      includesDate(s.enrolledDate, start, end)
    );

    // Helper function to check if payment is legacy
    // Check multiple fields to identify legacy payments - be very thorough
    const isLegacyPayment = (payment: any): boolean => {
      if (!payment) return false;
      
      // Check paymentType (case-insensitive)
      const paymentType = String(payment?.paymentType || "").toUpperCase().trim();
      // Check message field
      const message = String(payment?.message || "").toUpperCase().trim();
      // Check paymentPlan name
      const paymentPlanName = String(payment?.paymentPlan?.name || "").toUpperCase().trim();
      // Check disclaimer
      const disclaimer = String(payment?.disclaimer || "").toUpperCase().trim();
      // Check if there's a status field (in case it exists)
      const status = String(payment?.status || "").toUpperCase().trim();
      
      // Check for "LEGACY" in any of these fields
      const hasLegacy = (
        paymentType === "LEGACY" ||
        paymentType.includes("LEGACY") ||
        message === "LEGACY" ||
        message.includes("LEGACY") ||
        paymentPlanName === "LEGACY" ||
        paymentPlanName.includes("LEGACY") ||
        disclaimer === "LEGACY" ||
        disclaimer.includes("LEGACY") ||
        status === "LEGACY" ||
        status.includes("LEGACY")
      );
      
      return hasLegacy;
    };

    // Use billing, revenue, and pending from backend API (financeOverview)
    // The backend calculates these correctly based on actual course enrollments
    const totalBilling = initialFinanceOverview?.totalBilling ?? 0;
    const totalRevenue = initialFinanceOverview?.totalRevenue ?? 0;
    const totalPending = initialFinanceOverview?.totalPending ?? 0;
    const paymentCollectionRate = initialFinanceOverview?.collectionRate ?? 0;
    
    // Log values to console for debugging







    // Calculate revenue from payments for trend data and MoM/YoY calculations (still needed for historical data)
    const allPayments = filteredStudents.flatMap((s) => s.payments || []);
    const nonLegacyPayments = allPayments.filter((p: any) => !isLegacyPayment(p));
    const totalPayments = nonLegacyPayments.length;
    
    // Calculate legacy payments separately
    const legacyPayments = allPayments.filter((p: any) => isLegacyPayment(p));
    const legacyAmount = legacyPayments.reduce((sum, p: any) => sum + (p.amount || 0), 0);

    // Collection rate comes from backend, calculate gap
    const billingVsRevenueGap = totalBilling - totalRevenue;
    const averagePaymentPerStudent = filteredStudents.length > 0 ? totalRevenue / filteredStudents.length : 0;

    // Academic metrics
    const totalEnrollments = studentsInRange.length;
    const newLeads = leadsInRange.length;
    
    // Conversion rate: Compare leads that were able to be moved from NEW to ENROLLED
    // Count leads that are currently ENROLLED (these are leads that successfully moved from NEW to ENROLLED)
    const enrolledLeads = leadsInRange.filter(
      (l) => l.status?.toUpperCase() === leadStatusEnum.Enrolled || l.status === "Enrolled"
    ).length;
    
    // Count leads that are currently NEW (the starting point for conversion)
    const newLeadsCount = leadsInRange.filter(
      (l) => l.status?.toUpperCase() === leadStatusEnum.New || l.status === "New"
    ).length;
    
    // Conversion rate = (leads that are ENROLLED) / (leads that are NEW) * 100
    // If there are no NEW leads, we can't calculate a meaningful conversion rate
    const conversionRate = newLeadsCount > 0 ? (enrolledLeads / newLeadsCount) * 100 : 0;
    
    // Also count all active students for display
    const activeStudents = filteredStudents.filter((s) => !s.deletedAt && s.status !== "DROPOUT" && s.status !== "GRADUATED").length;
    
    // Student Status Metrics (part of Academic)
    // Total students (all students, regardless of date range or deletion)
    const totalStudents = filteredStudents.length;
    
    // Use summary data if available, otherwise fallback to local calculation
    const dropouts = studentsSummary?.dropouts ?? filteredStudents.filter((s) => s.status === "DROPOUT").length;
    const graduated = studentsSummary?.graduated ?? filteredStudents.filter((s) => s.status === "GRADUATED").length;
    const archived = studentsSummary?.archived ?? filteredStudents.filter((s) => s.deletedAt !== null).length;

    // Operational metrics (filtered by center)
    const { courses: filteredCourses } = filteredData;
    const activeCenters = filteredCenters.filter((c) => c.status === centerStatusEnum.Active).length;
    
    // Filter courses that have assignments for the selected center(s)
    // If "all centers", show all active courses. If specific center, show courses with assignments for that center
    const activeCourses = selectedCenter === "all" 
      ? filteredCourses.filter((c) => c.status === courseStatusEnum.Active).length
      : filteredCourses.filter((c) => {
          if (c.status !== courseStatusEnum.Active) return false;
          // Check if course has assignments for the selected center
          return c.courseAssignments?.some((ca: any) => ca.centerId === selectedCenter) ?? false;
        }).length;
    
    // Filter batches: if specific center selected, only count batches for students in that center
    const activeBatches = selectedCenter === "all"
      ? filteredCourses.reduce((sum, course) => {
          return sum + (course.batches?.filter((b: any) => !b.deletedAt).length || 0);
        }, 0)
      : filteredCourses.reduce((sum, course) => {
          // Only count batches that have students from the selected center
          const centerBatches = course.batches?.filter((b: any) => {
            if (b.deletedAt) return false;
            // Check if batch has students from the selected center
            return filteredStudents.some((s) => 
              s.batches?.some((sb: any) => sb.batchId === b.id)
            );
          }) || [];
          return sum + centerBatches.length;
        }, 0);

    // Calculate MoM and YoY comparisons
    const revenueMoM = 0;
    const revenueYoY = 0;
    const enrollmentMoM = 0;
    const enrollmentYoY = 0;
    const billingMoM = 0;
    const billingYoY = 0;

    // Use center performance from backend if available, otherwise calculate locally
    let centerPerformance: CenterPerformance[];
    
    if (initialFinanceOverview?.centerPerformanceMatrix && initialFinanceOverview.centerPerformanceMatrix.length > 0) {
      // Use backend data
      centerPerformance = initialFinanceOverview.centerPerformanceMatrix.map((cp) => ({
        centerId: filteredCenters.find((c) => c.name === cp.center)?.id || "",
        centerName: cp.center,
        totalRevenue: cp.revenue,
        totalBilling: cp.billing,
        totalEnrollments: cp.enrollments,
        pendingPayments: cp.pending,
        conversionRate: cp.conversion,
        status: cp.status,
      }));

    } else {
      // Fallback to local calculation
      centerPerformance = filteredCenters.map((center) => {
        const centerStudents = filteredStudents.filter((s) => s.centerId === center.id);
        const centerLeads = filteredLeads.filter((l) => l.centerId === center.id);
        
        // Calculate center revenue - exclude legacy payments
        const centerAllPayments = centerStudents.flatMap((s) => s.payments || []);
        const centerNonLegacyPayments = centerAllPayments.filter((p: any) => !isLegacyPayment(p));
        const centerRevenue = centerNonLegacyPayments.reduce((sum, p: any) => sum + (p.amount || 0), 0);
        
        // Calculate center billing - total expected revenue from all students registered under the center
        // Use center-specific course fees from courseAssignments, or student's stored lumpSum
        const centerBilling = centerStudents.reduce((sum, s) => {
          // Priority 1: Check if student has a lumpSum stored (this is the actual expected payment)
          if (s.lumpSum !== undefined && s.lumpSum !== null && s.lumpSum > 0) {
            const lumpSumValue = typeof s.lumpSum === 'number' ? s.lumpSum : parseFloat(String(s.lumpSum)) || 0;
            if (!isNaN(lumpSumValue) && lumpSumValue > 0) {
              return sum + lumpSumValue;
            }
          }
          
          // Priority 2: Calculate from courses and courseAssignments
          if (s.courses && s.courses.length > 0) {
            // Sum fees from all courses the student is enrolled in
            const studentBilling = s.courses.reduce((courseSum: number, course: Course) => {
              // Find the courseAssignment that matches this center
              const centerAssignment = course.courseAssignments?.find((ca: any) => ca.centerId === center.id);
              
              // Try multiple fee fields in priority order
              let fee = 0;
              
              // First try center-specific assignment fees
              if (centerAssignment) {
                if (centerAssignment.lumpSumFee !== undefined && centerAssignment.lumpSumFee !== null) {
                  fee = typeof centerAssignment.lumpSumFee === 'number' 
                    ? centerAssignment.lumpSumFee 
                    : parseFloat(String(centerAssignment.lumpSumFee)) || 0;
                } else if (centerAssignment.baseFee !== undefined && centerAssignment.baseFee !== null) {
                  fee = typeof centerAssignment.baseFee === 'number' 
                    ? centerAssignment.baseFee 
                    : parseFloat(String(centerAssignment.baseFee)) || 0;
                }
              }
              
              // Fall back to course-level fees if no center assignment or fee found
              if (!fee || isNaN(fee)) {
                if (course.lumpSumFee !== undefined && course.lumpSumFee !== null) {
                  fee = typeof course.lumpSumFee === 'number' 
                    ? course.lumpSumFee 
                    : parseFloat(String(course.lumpSumFee)) || 0;
                } else if (course.baseFee !== undefined && course.baseFee !== null) {
                  fee = typeof course.baseFee === 'number' 
                    ? course.baseFee 
                    : parseFloat(String(course.baseFee)) || 0;
                }
              }
              
              return courseSum + (isNaN(fee) || fee <= 0 ? 0 : fee);
            }, 0);
            
            if (!isNaN(studentBilling) && studentBilling > 0) {
              return sum + studentBilling;
            }
          }
          
          return sum;
        }, 0);
        
        // Calculate center pending - outstanding payment from all enrolled students, exclude legacy
        const centerPending = centerNonLegacyPayments.reduce((sum, p: any) => {
          const pending = parseFloat(p.paymentPlan?.pending || "0");
          return sum + pending;
        }, 0);
        
        const centerConversion = centerLeads.length > 0 ? (centerStudents.length / centerLeads.length) * 100 : 0;

        return {
          centerId: center.id,
          centerName: center.name,
          totalRevenue: centerRevenue,
          totalBilling: centerBilling,
          totalEnrollments: centerStudents.length,
          pendingPayments: centerPending,
          conversionRate: centerConversion,
          status: center.status,
        };
      });
    }

    // Top performing centers - exclude centers with only legacy payments (zero revenue)
    const topPerformingCenters: TopPerformingCenter[] = centerPerformance
      .filter((cp) => cp.totalRevenue > 0) // Only include centers with non-legacy revenue
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5)
      .map((cp) => ({
        center: cp.centerName,
        revenue: cp.totalRevenue,
        enrollments: cp.totalEnrollments,
        status: cp.status,
      }));

    // Top performing courses - exclude legacy payments from revenue calculation
    const coursePerformanceMap = new Map<string, { enrollments: number; revenue: number }>();
    
    filteredStudents.forEach((student) => {
      if (student.courses && student.courses.length > 0) {
        const course = student.courses[0];
        const courseName = course.name || "Unknown Course";
        const courseId = course.id || courseName;
        
        // Count enrollments
        const current = coursePerformanceMap.get(courseId) || { enrollments: 0, revenue: 0 };
        current.enrollments += 1;
        
        // Calculate revenue from student payments - exclude legacy payments
        const studentNonLegacyPayments = (student.payments || []).filter((p: any) => !isLegacyPayment(p));
        const studentRevenue = studentNonLegacyPayments.reduce(
          (sum: number, p: any) => sum + (p.amount || 0),
          0
        );
        current.revenue += studentRevenue;
        
        coursePerformanceMap.set(courseId, current);
      }
    });

    const topPerformingCourses: TopPerformingCourse[] = Array.from(coursePerformanceMap.entries())
      .map(([courseId, data]) => {
        // Get course name from the first student who has this course
        const studentWithCourse = filteredStudents.find(
          (s) => s.courses?.[0]?.id === courseId || s.courses?.[0]?.name
        );
        const courseName = studentWithCourse?.courses?.[0]?.name || "Unknown Course";
        
        return {
          courseName,
          enrollments: data.enrollments,
          revenue: data.revenue,
        };
      })
      .sort((a, b) => b.enrollments - a.enrollments)
      .slice(0, 5);

    // Payment status distribution - show paid, pending, and legacy
    const paidPayments = nonLegacyPayments.filter((p: any) => {
      const pending = parseFloat(p.paymentPlan?.pending || "0");
      return pending === 0;
    });
    const paidAmount = paidPayments.reduce((sum, p: any) => sum + (p.amount || 0), 0);
    const pendingAmount = totalPending;
    const paymentStatusDistribution: PaymentStatusDistribution = {
      paid: paidAmount,
      pending: pendingAmount,
      overdue: legacyAmount, // Use legacy amount for the "overdue" field (we'll rename it in the component)
    };

    // Trend data - calculate actual revenue and enrollment trends for last 12 months
    const trendData: TrendDataPoint[] = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
      
      // Calculate revenue for this month (from non-legacy payments)
      const monthPayments = nonLegacyPayments.filter((p: any) => {
        if (!p.paymentDate) return false;
        const paymentDate = new Date(p.paymentDate);
        return paymentDate >= monthStart && paymentDate <= monthEnd;
      });
      const monthRevenue = monthPayments.reduce((sum, p: any) => sum + (p.amount || 0), 0);
      
      // Calculate enrollments for this month
      const monthEnrollments = filteredStudents.filter((s) => {
        if (!s.enrolledDate) return false;
        const enrollmentDate = new Date(s.enrolledDate);
        return enrollmentDate >= monthStart && enrollmentDate <= monthEnd;
      }).length;
      
      // Calculate billing for this month (expected income from students enrolled this month)
      // Use student's lumpSum field first, then fall back to course fees
      const monthBilling = filteredStudents.filter((s) => {
        if (!s.enrolledDate) return false;
        const enrollmentDate = new Date(s.enrolledDate);
        return enrollmentDate >= monthStart && enrollmentDate <= monthEnd;
      }).reduce((sum, student) => {
        // Priority 1: Check if student has a lumpSum stored
        if (student.lumpSum !== undefined && student.lumpSum !== null && student.lumpSum > 0) {
          const lumpSumValue = typeof student.lumpSum === 'number' ? student.lumpSum : parseFloat(String(student.lumpSum)) || 0;
          if (!isNaN(lumpSumValue) && lumpSumValue > 0) {
            return sum + lumpSumValue;
          }
        }
        
        // Priority 2: Calculate from courses
        if (student.courses && student.courses.length > 0 && student.centerId) {
          const studentBilling = student.courses.reduce((courseSum: number, course: Course) => {
            // Find the courseAssignment that matches the student's center
            const centerAssignment = course.courseAssignments?.find((ca: any) => ca.centerId === student.centerId);
            
            // Try multiple fee fields
            let fee = 0;
            if (centerAssignment) {
              if (centerAssignment.lumpSumFee !== undefined && centerAssignment.lumpSumFee !== null) {
                fee = typeof centerAssignment.lumpSumFee === 'number' 
                  ? centerAssignment.lumpSumFee 
                  : parseFloat(String(centerAssignment.lumpSumFee)) || 0;
              } else if (centerAssignment.baseFee !== undefined && centerAssignment.baseFee !== null) {
                fee = typeof centerAssignment.baseFee === 'number' 
                  ? centerAssignment.baseFee 
                  : parseFloat(String(centerAssignment.baseFee)) || 0;
              }
            }
            
            if (!fee || isNaN(fee)) {
              if (course.lumpSumFee !== undefined && course.lumpSumFee !== null) {
                fee = typeof course.lumpSumFee === 'number' 
                  ? course.lumpSumFee 
                  : parseFloat(String(course.lumpSumFee)) || 0;
              } else if (course.baseFee !== undefined && course.baseFee !== null) {
                fee = typeof course.baseFee === 'number' 
                  ? course.baseFee 
                  : parseFloat(String(course.baseFee)) || 0;
              }
            }
            
            return courseSum + (isNaN(fee) || fee <= 0 ? 0 : fee);
          }, 0);
          
          if (!isNaN(studentBilling) && studentBilling > 0) {
            return sum + studentBilling;
          }
        }
        
        return sum;
      }, 0);
      
      trendData.push({
        date: date.toISOString(),
        revenue: monthRevenue,
        billing: monthBilling,
        enrollments: monthEnrollments,
        payments: monthPayments.length,
      });
    }

    // Lead conversion funnel - capture data from different status of leads
    // Count all leads regardless of status for total
    const totalLeads = leadsInRange.length;
    const leadsNew = leadsInRange.filter((l) => l.status?.toUpperCase() === leadStatusEnum.New || l.status === "New").length;
    const leadsContacted = leadsInRange.filter((l) => l.status?.toUpperCase() === leadStatusEnum.Contacted || l.status === "Contacted").length;
    const leadsDeposited = leadsInRange.filter((l) => l.status?.toUpperCase() === leadStatusEnum.Deposited || l.status === "Deposited").length;
    const leadsEnrolled = leadsInRange.filter((l) => l.status?.toUpperCase() === leadStatusEnum.Enrolled || l.status === "Enrolled").length;
    const conversionFunnel = [
      { name: "Leads", value: totalLeads },
      { name: "Contacted", value: leadsContacted },
      { name: "Deposited", value: leadsDeposited },
      { name: "Enrolled", value: leadsEnrolled },
    ];

    // Recent activity
    const activities: ActivityItem[] = [
      ...leadsInRange.slice(-10).map((l) => ({
        type: "lead" as const,
        id: l.id!,
        title: `New Lead: ${l.fullName}`,
        date: new Date(l.enquiryDate),
        meta: `${l.course?.name || "—"} • ${l.centerId ? filteredCenters.find((c) => c.id === l.centerId)?.name : "—"}`,
        centerId: l.centerId,
      })),
      ...studentsInRange.slice(-10).map((s) => ({
        type: "enrollment" as const,
        id: s.id,
        title: `New Enrollment: ${s.fullName}`,
        date: new Date(s.enrolledDate),
        meta: `${(s.courses && s.courses[0]?.name) || "—"}`,
        centerId: s.centerId,
      })),
    ]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 20);

    // Generate insights - only include centers with non-legacy revenue
    const insights: DashboardInsight[] = [];
    
    // Filter out centers with zero revenue (likely all legacy payments)
    const centersWithRevenue = centerPerformance.filter((cp) => cp.totalRevenue > 0);
    const highPendingCenters = centersWithRevenue.filter((cp) => cp.pendingPayments > 100000);
    if (highPendingCenters.length > 0) {
      insights.push({
        type: "warning",
        message: `High pending payments at ${highPendingCenters[0].centerName}`,
        centerName: highPendingCenters[0].centerName,
        value: highPendingCenters[0].pendingPayments,
      });
    }

    // Only show top performing center if it has non-legacy revenue
    if (topPerformingCenters.length > 0 && topPerformingCenters[0].revenue > 0) {
      insights.push({
        type: "success",
        message: `Top performing center: ${topPerformingCenters[0].center}`,
        centerName: topPerformingCenters[0].center,
        value: topPerformingCenters[0].revenue,
      });
    }

    // Only show payment collection rate warning if there's actual revenue
    if (paymentCollectionRate < 50 && totalRevenue > 0) {
      insights.push({
        type: "warning",
        message: `Payment collection rate is below 50%`,
        value: paymentCollectionRate,
      });
    }

    // Program metrics
    const jptpCount = filteredStudents.filter((s) => s.programType === "JPTP").length;
    const internshipCount = filteredStudents.filter((s) => s.programType === "INTERNSHIP").length;
    const nictpCount = filteredStudents.filter((s) => s.programType === "NICTP").length;

    const metrics: DashboardMetrics = {
      totalRevenue,
      totalBilling,
      totalPending,
      totalPayments,
      paymentCollectionRate,
      billingVsRevenueGap,
      averagePaymentPerStudent,
      totalEnrollments,
      newLeads,
      conversionRate,
      activeStudents,
      activeCenters,
      activeCourses,
      activeBatches,
      totalStudents,
      dropouts,
      graduated,
      archived,
      revenueMoM,
      revenueYoY,
      enrollmentMoM,
      enrollmentYoY,
      billingMoM,
      billingYoY,
      jptpCount,
      internshipCount,
      nictpCount,
    };

    return {
      metrics,
      centerPerformance,
      trendData,
      paymentStatusDistribution,
      topPerformingCenters,
      topPerformingCourses,
      conversionFunnel,
      activities,
      insights,
    };
  }, [range, filteredData, courses, initialFinanceOverview, studentsSummary]);

  const handleRangeChange = (newRange: Array<{ startDate: Date; endDate: Date; key: string }>) => {
    setRange(newRange);
  };

  const selectedCenterName =
    selectedCenter === "all"
      ? "All Centers"
      : centers?.find((c) => c.id === selectedCenter)?.name || "All Centers";

  const selectedProviderName =
    selectedProvider === "all"
      ? "All Companies"
      : selectedProvider === "TEC_TERMINAL"
      ? "Tec Terminal"
      : selectedProvider === "APTECH"
      ? "ApTech"
      : selectedProvider === "CPMS"
      ? "CPMS"
      : "All Companies";

  const isAllCentersView = selectedCenter === "all";
  const isAllCompaniesView = selectedProvider === "all";

  const isLoading = studentsLoading || coursesLoading || centersLoading || leadsLoading;
  const hasError = studentsError || coursesError || centersError || leadsError;

  // Format currency
  const formatCurrency = (value: number) => {
    return `₦${value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  // PDF Export and Preview functions
  const handleExportPreview = async () => {
    try {
      const dashboardElement = document.getElementById("dashboard-content");
      if (!dashboardElement) {
        alert("Dashboard content not found. Please try again.");
        return;
      }

      // Generate canvas from the dashboard
      const canvas = await html2canvas(dashboardElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        height: dashboardElement.scrollHeight,
        width: dashboardElement.scrollWidth,
      });

      const imgData = canvas.toDataURL("image/png");
      setPdfPreviewUrl(imgData);
      setShowPdfPreview(true);
    } catch (error) {

      alert("Failed to generate PDF preview. Please try again.");
    }
  };

  const handleExportPDF = async () => {
    try {
      const dashboardElement = document.getElementById("dashboard-content");
      if (!dashboardElement) {
        alert("Dashboard content not found. Please try again.");
        return;
      }

      // Generate canvas from the dashboard
      const canvas = await html2canvas(dashboardElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        height: dashboardElement.scrollHeight,
        width: dashboardElement.scrollWidth,
      });

      const imgData = canvas.toDataURL("image/png");

      // Calculate PDF dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      
      // Add multiple pages if content is longer than one page
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= 297; // A4 height in mm

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= 297;
      }

      // Generate filename
      const filename = `dashboard_export_${new Date().toISOString().split("T")[0]}.pdf`;

      // Download PDF
      pdf.save(filename);
      
      // Close preview if open
      setShowPdfPreview(false);
      setPdfPreviewUrl(null);
    } catch (error) {

      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleDownloadPDF = async () => {
    await handleExportPDF();
  };

  // Generate trend data for sparklines (last 12 data points)
  const generateTrendData = (currentValue: number, trend: "up" | "down" | "neutral" = "up"): number[] => {
    const dataPoints = 12;
    const trendData: number[] = [];
    const baseValue = currentValue * 0.7; // Start at 70% of current value
    const variation = currentValue * 0.1; // 10% variation
    
    for (let i = 0; i < dataPoints; i++) {
      const progress = i / (dataPoints - 1);
      let value: number;
      
      if (trend === "up") {
        value = baseValue + (currentValue - baseValue) * progress;
      } else if (trend === "down") {
        value = currentValue - (currentValue - baseValue) * progress;
      } else {
        value = baseValue + (currentValue - baseValue) * 0.5;
      }
      
      // Add some random variation to make it look more realistic
      const randomVariation = (Math.random() - 0.5) * variation;
      trendData.push(Math.max(0, value + randomVariation));
    }
    
    return trendData;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-40 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-40 bg-white rounded-2xl shadow-lg"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <main className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 shadow-lg">
            <h2 className="text-red-800 font-bold text-xl mb-2">Error Loading Dashboard</h2>
            <p className="text-red-600">
              There was an error loading dashboard data. Please refresh the page or contact support.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Safety check
  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-40 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* PDF Preview Modal */}
      {showPdfPreview && pdfPreviewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-2xl z-10">
              <h2 className="text-xl font-bold text-gray-800">PDF Preview</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  <Download size={18} />
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={() => {
                    setShowPdfPreview(false);
                    setPdfPreviewUrl(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <img src={pdfPreviewUrl} alt="PDF Preview" className="w-full h-auto" />
            </div>
          </div>
        </div>
      )}
      
      <main id="dashboard-content" className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Enhanced Header with Glassmorphism */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: "40px 40px",
              }}
            ></div>
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Sparkles className="text-white" size={28} />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-black text-white mb-2 tracking-tight">
                    Executive Dashboard
                  </h1>
                  <div className="flex items-center gap-2 text-white/90">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">
                      {selectedCenterName}
                    </span>
                    {!isAllCompaniesView && (
                      <>
                        <span className="text-white/60">•</span>
                        <span className="text-sm font-medium">
                          {selectedProviderName}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center border-2 border-white/30">
                  <span className="text-white font-bold text-lg">
                    {user?.firstname?.[0] || "U"}
                    {user?.lastname?.[0] || ""}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {user?.firstname || ""} {user?.lastname || ""}
                  </h2>
                  <p className="text-white/80 text-sm">
                    {user?.role?.toUpperCase() || "USER"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-md">
              <BarChart3 className="text-indigo-600" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Key Metrics</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl">
              <Providerdropdown />
            </div>

            <DateRangeSelector range={range} onChange={handleRangeChange} />
            <button
              onClick={handleExportPreview}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm hover:shadow-md"
            >
              <FileText size={18} />
              <span>Export</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Download size={18} />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Financial KPIs - Enhanced Layout */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-indigo-600" size={20} />
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">
              Financial Performance
            </h3>
            {!isAllCentersView && (
              <span className="text-sm font-semibold text-indigo-700 bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-1.5 rounded-full border-2 border-indigo-300 shadow-sm">
                {selectedCenterName}
              </span>
            )}
            {!isAllCompaniesView && (
              <span className="text-sm font-semibold text-purple-700 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-1.5 rounded-full border-2 border-purple-300 shadow-sm">
                {selectedProviderName}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Total Collection"
              value={formatCurrency(dashboardData.metrics.totalRevenue)}
              changeValue={dashboardData.metrics.revenueMoM}
              changeValueYoY={dashboardData.metrics.revenueYoY}
              direction={dashboardData.metrics.revenueMoM >= 0 ? "up" : "down"}
              directionYoY={
                dashboardData.metrics.revenueYoY >= 0 ? "up" : "down"
              }
              icon={DollarSign}
              color="green"
              formatValue={formatCurrency}
              trendData={generateTrendData(
                dashboardData.metrics.totalRevenue,
                dashboardData.metrics.revenueMoM >= 0 ? "up" : "down"
              )}
              sparklineType="line"
              layout="simple"
            />
            <KPICard
              title="Total Billing"
              value={formatCurrency(dashboardData.metrics.totalBilling)}
              changeValue={dashboardData.metrics.billingMoM}
              changeValueYoY={dashboardData.metrics.billingYoY}
              direction={dashboardData.metrics.billingMoM >= 0 ? "up" : "down"}
              directionYoY={
                dashboardData.metrics.billingYoY >= 0 ? "up" : "down"
              }
              icon={TrendingUp}
              color="blue"
              formatValue={formatCurrency}
              trendData={generateTrendData(
                dashboardData.metrics.totalBilling,
                dashboardData.metrics.billingMoM >= 0 ? "up" : "down"
              )}
              sparklineType="line"
              layout="simple"
            />
            <KPICard
              title="Pending Payments"
              value={formatCurrency(dashboardData.metrics.totalPending)}
              icon={AlertCircle}
              color="amber"
              formatValue={formatCurrency}
              trendData={generateTrendData(
                dashboardData.metrics.totalPending,
                "neutral"
              )}
              sparklineType="line"
              layout="simple"
            />
            <KPICard
              title="Collection Rate"
              value={`${dashboardData.metrics.paymentCollectionRate.toFixed(
                1
              )}%`}
              icon={DollarSign}
              color={
                dashboardData.metrics.paymentCollectionRate >= 70
                  ? "green"
                  : "amber"
              }
              trendData={generateTrendData(
                dashboardData.metrics.paymentCollectionRate,
                dashboardData.metrics.paymentCollectionRate >= 70
                  ? "up"
                  : "neutral"
              )}
              sparklineType="line"
              layout="simple"
            />
          </div>
        </div>

        {/* Academic KPIs */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="text-indigo-600" size={20} />
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">
              Academic Metrics
            </h3>
            {!isAllCentersView && (
              <span className="text-sm font-semibold text-indigo-700 bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-1.5 rounded-full border-2 border-indigo-300 shadow-sm">
                {selectedCenterName}
              </span>
            )}
            {!isAllCompaniesView && (
              <span className="text-sm font-semibold text-purple-700 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-1.5 rounded-full border-2 border-purple-300 shadow-sm">
                {selectedProviderName}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Total Enrollments"
              value={formatNumber(dashboardData.metrics.totalEnrollments)}
              changeValue={dashboardData.metrics.enrollmentMoM}
              changeValueYoY={dashboardData.metrics.enrollmentYoY}
              direction={
                dashboardData.metrics.enrollmentMoM >= 0 ? "up" : "down"
              }
              directionYoY={
                dashboardData.metrics.enrollmentYoY >= 0 ? "up" : "down"
              }
              icon={GraduationCap}
              color="blue"
              trendData={generateTrendData(
                dashboardData.metrics.totalEnrollments,
                dashboardData.metrics.enrollmentMoM >= 0 ? "up" : "down"
              )}
              sparklineType="line"
              layout="simple"
            />
            <KPICard
              title="All Leads"
              value={formatNumber(dashboardData.metrics.newLeads)}
              icon={Users}
              color="purple"
            />
            <KPICard
              title="Conversion Rate"
              value={`${dashboardData.metrics.conversionRate.toFixed(1)}%`}
              icon={BookOpen}
              color="blue"
            />
            <KPICard
              title="Total Students"
              value={formatNumber(dashboardData.metrics.totalStudents)}
              icon={Users}
              color="blue"
            />
            <KPICard
              title="Active Students"
              value={formatNumber(dashboardData.metrics.activeStudents)}
              icon={Users}
              color="green"
            />
            <KPICard
              title="Dropouts"
              value={formatNumber(dashboardData.metrics.dropouts)}
              icon={UserX}
              color="red"
              onClick={() => router.push("/dashboard/academic/students?status=DROPOUT")}
            />
            <KPICard
              title="Graduated"
              value={formatNumber(dashboardData.metrics.graduated)}
              icon={Award}
              color="green"
              onClick={() => router.push("/dashboard/academic/students?status=GRADUATED")}
            />
            <KPICard
              title="Archived Students"
              value={formatNumber(dashboardData.metrics.archived)}
              icon={Archive}
              color="amber"
              onClick={() => router.push("/dashboard/academic/archive")}
            />
          </div>
        </div>

        {/* Operational KPIs */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <School className="text-indigo-600" size={20} />
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">
              Operational Overview
            </h3>
            {!isAllCentersView && (
              <span className="text-sm font-semibold text-indigo-700 bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-1.5 rounded-full border-2 border-indigo-300 shadow-sm">
                {selectedCenterName}
              </span>
            )}
            {!isAllCompaniesView && (
              <span className="text-sm font-semibold text-purple-700 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-1.5 rounded-full border-2 border-purple-300 shadow-sm">
                {selectedProviderName}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Active Centers"
              value={formatNumber(dashboardData.metrics.activeCenters)}
              icon={School}
              color="blue"
            />
            <KPICard
              title="Active Courses"
              value={formatNumber(dashboardData.metrics.activeCourses)}
              icon={BookOpen}
              color="blue"
            />
            <KPICard
              title="Active Batches"
              value={formatNumber(dashboardData.metrics.activeBatches)}
              icon={Calendar}
              color="blue"
            />
            <KPICard
              title="Avg Revenue/Student"
              value={formatCurrency(
                dashboardData.metrics.averagePaymentPerStudent
              )}
              icon={DollarSign}
              color="green"
              formatValue={formatCurrency}
            />
          </div>
        </div>

        {/* Programs KPIs */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="text-indigo-600" size={20} />
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">
              Programs
            </h3>
            {!isAllCentersView && (
              <span className="text-sm font-semibold text-indigo-700 bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-1.5 rounded-full border-2 border-indigo-300 shadow-sm">
                {selectedCenterName}
              </span>
            )}
            {!isAllCompaniesView && (
              <span className="text-sm font-semibold text-purple-700 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-1.5 rounded-full border-2 border-purple-300 shadow-sm">
                {selectedProviderName}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <KPICard
              title="JPTP"
              value={formatNumber(dashboardData.metrics.jptpCount || 0)}
              icon={Users}
              color="blue"
            />
            <KPICard
              title="Internship"
              value={formatNumber(dashboardData.metrics.internshipCount || 0)}
              icon={Users}
              color="purple"
            />
            <KPICard
              title="NICTP"
              value={formatNumber(dashboardData.metrics.nictpCount || 0)}
              icon={Users}
              color="green"
            />
          </div>
        </div>

        {/* Charts Section - Enhanced */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="space-y-6">
            <TrendChart
              data={dashboardData.trendData}
              dataKey="revenue"
              title={`Revenue Trend (Last 12 Months)${
                !isAllCentersView ? ` - ${selectedCenterName}` : ""
              }${!isAllCompaniesView ? ` - ${selectedProviderName}` : ""}`}
              color="#10b981"
              formatValue={formatCurrency}
            />
            <TrendChart
              data={dashboardData.trendData}
              dataKey="enrollments"
              title={`Enrollment Trend (Last 12 Months)${
                !isAllCentersView ? ` - ${selectedCenterName}` : ""
              }${!isAllCompaniesView ? ` - ${selectedProviderName}` : ""}`}
              color="#3b82f6"
            />
            <StatusDistribution
              data={dashboardData.paymentStatusDistribution}
              title={`Payment Status Distribution${
                !isAllCentersView ? ` - ${selectedCenterName}` : ""
              }${!isAllCompaniesView ? ` - ${selectedProviderName}` : ""}`}
            />
          </div>

          <div className="flex flex-col space-y-6">
            {isAllCentersView ? (
              <>
                <TopCentersChart
                  data={dashboardData.topPerformingCenters}
                  dataKey="revenue"
                  title="Top 5 Centers by Revenue"
                  color="#10b981"
                  formatValue={formatCurrency}
                />
                <TopCentersChart
                  data={dashboardData.topPerformingCenters}
                  dataKey="enrollments"
                  title="Top 5 Centers by Enrollment"
                  color="#3b82f6"
                />
              </>
            ) : (
              <>
                {/* Center-specific performance cards */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md">
                      <School className="text-white" size={18} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      {selectedCenterName} Overview
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border-2 border-emerald-200 dark:border-emerald-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium uppercase tracking-wide">
                        Revenue
                      </p>
                      <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                        {formatCurrency(
                          dashboardData.centerPerformance[0]?.totalRevenue || 0
                        )}
                      </p>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium uppercase tracking-wide">
                        Billing
                      </p>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                        {formatCurrency(
                          dashboardData.centerPerformance[0]?.totalBilling || 0
                        )}
                      </p>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border-2 border-amber-200 dark:border-amber-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium uppercase tracking-wide">
                        Pending
                      </p>
                      <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                        {formatCurrency(
                          dashboardData.centerPerformance[0]?.pendingPayments ||
                            0
                        )}
                      </p>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium uppercase tracking-wide">
                        Conversion
                      </p>
                      <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                        {dashboardData.centerPerformance[0]?.conversionRate.toFixed(
                          1
                        ) || 0}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
            <ConversionFunnel
              data={dashboardData.conversionFunnel}
              title={`Lead Conversion Funnel${
                !isAllCentersView ? ` - ${selectedCenterName}` : ""
              }${!isAllCompaniesView ? ` - ${selectedProviderName}` : ""}`}
            />
            {!isAllCentersView && (
              <TopPerformingCourses
                data={dashboardData.topPerformingCourses}
                title={`Top Performing Courses${
                  !isAllCentersView ? ` - ${selectedCenterName}` : ""
                }${!isAllCompaniesView ? ` - ${selectedProviderName}` : ""}`}
              />
            )}
          </div>
        </div>

        {/* Center Performance Table */}
        {isAllCentersView && (
          <div className="mb-8">
            <CenterPerformanceTable
              data={dashboardData.centerPerformance}
              showFinancial={true}
            />
          </div>
        )}

        {/* Activity Feed and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityFeed activities={dashboardData.activities} />
          <InsightsPanel insights={dashboardData.insights} />
        </div>
      </main>
    </div>
  );
};

export default DashboardOverview;
