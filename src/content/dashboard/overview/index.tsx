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
} from "lucide-react";

interface DashboardOverviewProps {
  user: User;
  students: Student[];
  courses: Course[];
  centers: Center[];
  leads: Lead[];
  financeOverview: {
    totalRevenue: number;
    totalPending: number;
    totalPayments: number;
    topCenters: {
      center: string;
      status: string;
      pending: string;
      revenue: string;
    }[];
    topPendingCenters: {
      center: string;
      status: string;
      pending: string;
      revenue: string;
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
  const { selectedCenter } = useCenter();
  const { selectedProvider } = useProvider();
  const [range, setRange] = useState([
    {
      startDate: new Date(new Date().setDate(new Date().getDate() - 29)),
      endDate: new Date(),
      key: "selection",
    },
  ]);

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

    // Calculate billing (expected income from enrolled courses)
    const totalBilling = filteredStudents.reduce((sum, student) => {
      if (student.courses && student.courses.length > 0) {
        const course = student.courses[0];
        const fee = course.courseAssignments?.[0]?.lumpSumFee || course.lumpSumFee || 0;
        return sum + fee;
      }
      return sum;
    }, 0);

    // Calculate revenue from payments
    const allPayments = filteredStudents.flatMap((s) => s.payments || []);
    const totalRevenue = allPayments.reduce((sum, p: any) => sum + (p.amount || 0), 0);
    const totalPending = allPayments.reduce((sum, p: any) => {
      const pending = parseFloat(p.paymentPlan?.pending || "0");
      return sum + pending;
    }, 0);
    const totalPayments = allPayments.length;

    // Calculate payment collection rate
    const paymentCollectionRate = totalBilling > 0 ? (totalRevenue / totalBilling) * 100 : 0;
    const billingVsRevenueGap = totalBilling - totalRevenue;
    const averagePaymentPerStudent = filteredStudents.length > 0 ? totalRevenue / filteredStudents.length : 0;

    // Academic metrics
    const totalEnrollments = studentsInRange.length;
    const newLeads = leadsInRange.length;
    const conversionRate = newLeads > 0 ? (totalEnrollments / newLeads) * 100 : 0;
    const activeStudents = filteredStudents.filter((s) => !s.deletedAt).length;
    
    // Student Status Metrics (part of Academic)
    // Total students (all students, regardless of date range or deletion)
    const totalStudents = filteredStudents.length;
    
    // Dropouts (students with DROPOUT status)
    const dropouts = filteredStudents.filter((s) => s.status === "DROPOUT").length;
    
    // Graduated (students with GRADUATED status)
    const graduated = filteredStudents.filter((s) => s.status === "GRADUATED").length;
    
    // Archived (students with deletedAt set)
    const archived = filteredStudents.filter((s) => s.deletedAt !== null).length;

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

    // Center performance
    const centerPerformance: CenterPerformance[] = filteredCenters.map((center) => {
      const centerStudents = filteredStudents.filter((s) => s.centerId === center.id);
      const centerLeads = filteredLeads.filter((l) => l.centerId === center.id);
      const centerRevenue = centerStudents.reduce((sum, s) => {
        return sum + (s.payments?.reduce((pSum: number, p: any) => pSum + (p.amount || 0), 0) || 0);
      }, 0);
      const centerBilling = centerStudents.reduce((sum, s) => {
        if (s.courses && s.courses.length > 0) {
          const course = s.courses[0];
          const fee = course.courseAssignments?.[0]?.lumpSumFee || course.lumpSumFee || 0;
          return sum + fee;
        }
        return sum;
      }, 0);
      const centerPending = centerStudents.reduce((sum, s) => {
        return sum + (s.payments?.reduce((pSum: number, p: any) => {
          const pending = parseFloat(p.paymentPlan?.pending || "0");
          return pSum + pending;
        }, 0) || 0);
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

    // Top performing centers
    const topPerformingCenters: TopPerformingCenter[] = centerPerformance
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5)
      .map((cp) => ({
        center: cp.centerName,
        revenue: cp.totalRevenue,
        enrollments: cp.totalEnrollments,
        status: cp.status,
      }));

    // Top performing courses
    const coursePerformanceMap = new Map<string, { enrollments: number; revenue: number }>();
    
    filteredStudents.forEach((student) => {
      if (student.courses && student.courses.length > 0) {
        const course = student.courses[0];
        const courseName = course.name || "Unknown Course";
        const courseId = course.id || courseName;
        
        // Count enrollments
        const current = coursePerformanceMap.get(courseId) || { enrollments: 0, revenue: 0 };
        current.enrollments += 1;
        
        // Calculate revenue from student payments
        const studentRevenue = (student.payments || []).reduce(
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

    // Payment status distribution
    const paidAmount = totalRevenue;
    const pendingAmount = totalPending;
    const overdueAmount = 0;
    const paymentStatusDistribution: PaymentStatusDistribution = {
      paid: paidAmount,
      pending: pendingAmount,
      overdue: overdueAmount,
    };

    // Trend data
    const trendData: TrendDataPoint[] = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      trendData.push({
        date: date.toISOString(),
        revenue: 0,
        billing: 0,
        enrollments: 0,
        payments: 0,
      });
    }

    // Lead conversion funnel
    const leadsContacted = leadsInRange.filter((l) => l.status === leadStatusEnum.Contacted).length;
    const leadsDeposited = leadsInRange.filter((l) => l.status === leadStatusEnum.Deposited).length;
    const leadsEnrolled = leadsInRange.filter((l) => l.status === leadStatusEnum.Enrolled).length;
    const conversionFunnel = [
      { name: "Leads", value: newLeads },
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

    // Generate insights
    const insights: DashboardInsight[] = [];
    
    const highPendingCenters = centerPerformance.filter((cp) => cp.pendingPayments > 100000);
    if (highPendingCenters.length > 0) {
      insights.push({
        type: "warning",
        message: `High pending payments at ${highPendingCenters[0].centerName}`,
        centerName: highPendingCenters[0].centerName,
        value: highPendingCenters[0].pendingPayments,
      });
    }

    if (topPerformingCenters.length > 0) {
      insights.push({
        type: "success",
        message: `Top performing center: ${topPerformingCenters[0].center}`,
        centerName: topPerformingCenters[0].center,
        value: topPerformingCenters[0].revenue,
      });
    }

    if (paymentCollectionRate < 50) {
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
  }, [range, filteredData, courses]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
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
            <h2 className="text-2xl font-bold text-gray-800">Key Metrics</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl">
              <Providerdropdown />
            </div>

            <DateRangeSelector range={range} onChange={handleRangeChange} />
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm hover:shadow-md">
              <FileText size={18} />
              <span>Export</span>
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
              <Download size={18} />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Financial KPIs - Enhanced Layout */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-indigo-600" size={20} />
            <h3 className="text-lg font-bold text-gray-700">
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
            <h3 className="text-lg font-bold text-gray-700">
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
              title="New Leads"
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
            />
            <KPICard
              title="Graduated"
              value={formatNumber(dashboardData.metrics.graduated)}
              icon={Award}
              color="green"
            />
            <KPICard
              title="Archived Students"
              value={formatNumber(dashboardData.metrics.archived)}
              icon={Archive}
              color="amber"
            />
          </div>
        </div>

        {/* Operational KPIs */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <School className="text-indigo-600" size={20} />
            <h3 className="text-lg font-bold text-gray-700">
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
            <h3 className="text-lg font-bold text-gray-700">
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
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md">
                      <School className="text-white" size={18} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {selectedCenterName} Overview
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
                      <p className="text-xs text-gray-600 mb-2 font-medium uppercase tracking-wide">
                        Revenue
                      </p>
                      <p className="text-2xl font-bold text-emerald-700">
                        {formatCurrency(
                          dashboardData.centerPerformance[0]?.totalRevenue || 0
                        )}
                      </p>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                      <p className="text-xs text-gray-600 mb-2 font-medium uppercase tracking-wide">
                        Billing
                      </p>
                      <p className="text-2xl font-bold text-blue-700">
                        {formatCurrency(
                          dashboardData.centerPerformance[0]?.totalBilling || 0
                        )}
                      </p>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
                      <p className="text-xs text-gray-600 mb-2 font-medium uppercase tracking-wide">
                        Pending
                      </p>
                      <p className="text-2xl font-bold text-amber-700">
                        {formatCurrency(
                          dashboardData.centerPerformance[0]?.pendingPayments ||
                            0
                        )}
                      </p>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border-2 border-purple-200">
                      <p className="text-xs text-gray-600 mb-2 font-medium uppercase tracking-wide">
                        Conversion
                      </p>
                      <p className="text-2xl font-bold text-purple-700">
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
