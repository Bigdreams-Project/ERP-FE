"use client";
import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useCenter } from "@/context/CenterContext";
import {
  getStudentsClient,
  getCoursesClient,
  getCentersClient,
  getLeadsClient,
  getLoggedInUserClient,
  getBatchesClient,
} from "@/lib/client-network";
import { Center } from "@/types/academic/center.interface";
import { Course } from "@/types/academic/course.interface";
import { Lead } from "@/types/academic/lead.interface";
import { Student } from "@/types/academic/student.interface";
import { User } from "@/types/auth/user.interface";
import { Batch } from "@/types/academic/batch.interface";
import { includesDate, formatNumber } from "@/lib/utils";
import { leadStatusEnum } from "@/data/view/lead.data";
import { courseStatusEnum } from "@/data/view/course.data";
import { centerStatusEnum } from "@/data/view/center.data";
import {
  DashboardMetrics,
  CenterPerformance,
  TrendDataPoint,
  PaymentStatusDistribution,
  TopPerformingCenter,
  ActivityItem,
  DashboardInsight,
} from "@/types/dashboard/overview.interface";

// Components
import KPICard from "@/components/dashboard/overview/KPICard";
import TrendChart from "@/components/dashboard/overview/TrendChart";
import StatusDistribution from "@/components/dashboard/overview/StatusDistribution";
import TopCentersChart from "@/components/dashboard/overview/TopCentersChart";
import ConversionFunnel from "@/components/dashboard/overview/ConversionFunnel";
import CenterPerformanceTable from "@/components/dashboard/overview/CenterPerformanceTable";
import ActivityFeed from "@/components/dashboard/overview/ActivityFeed";
import InsightsPanel from "@/components/dashboard/overview/InsightsPanel";
import Centerdropdown from "@/components/Centerdropdown";

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
  ChevronLeft,
  ChevronRight,
  UserCircle,
} from "lucide-react";

interface ExecutiveDashboardProps {
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
  batches: Batch[];
}

const ExecutiveDashboard = ({
  user: initialUser,
  students: initialStudents,
  courses: initialCourses,
  centers: initialCenters,
  leads: initialLeads,
  financeOverview: initialFinanceOverview,
  batches: initialBatches,
}: ExecutiveDashboardProps) => {
  const { selectedCenter } = useCenter();

  // Log the received props IMMEDIATELY (runs on every render, client-side)
  console.log("🚨🚨🚨 CLIENT COMPONENT RENDER 🚨🚨🚨");
  console.log("initialFinanceOverview:", initialFinanceOverview);
  console.log(
    "initialFinanceOverview?.totalBilling:",
    initialFinanceOverview?.totalBilling
  );
  console.log(
    "initialFinanceOverview?.totalRevenue:",
    initialFinanceOverview?.totalRevenue
  );
  console.log(
    "initialFinanceOverview?.totalPending:",
    initialFinanceOverview?.totalPending
  );
  console.log(
    "initialFinanceOverview?.collectionRate:",
    initialFinanceOverview?.collectionRate
  );

  // Also log in useEffect to catch any changes
  useEffect(() => {
    console.log("=== EXECUTIVE DASHBOARD PROPS (CLIENT-SIDE useEffect) ===");
    console.log("initialFinanceOverview received:", initialFinanceOverview);
    console.log(
      "initialFinanceOverview?.totalBilling:",
      initialFinanceOverview?.totalBilling
    );
    console.log(
      "initialFinanceOverview?.totalRevenue:",
      initialFinanceOverview?.totalRevenue
    );
    console.log(
      "initialFinanceOverview?.totalPending:",
      initialFinanceOverview?.totalPending
    );
    console.log(
      "initialFinanceOverview?.collectionRate:",
      initialFinanceOverview?.collectionRate
    );
    console.log(
      "Full initialFinanceOverview:",
      JSON.stringify(initialFinanceOverview, null, 2)
    );
    console.log("=================================");
  }, [initialFinanceOverview]);
  const [showPicker, setShowPicker] = useState(false);
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

  const { data: students = initialStudents } = useQuery(
    ["students"],
    () => getStudentsClient(),
    {
      initialData: initialStudents,
      staleTime: 1000 * 60 * 5,
    }
  );

  const { data: courses = initialCourses } = useQuery(
    ["courses"],
    () => getCoursesClient(),
    {
      initialData: initialCourses,
      staleTime: 1000 * 60 * 5,
    }
  );

  const { data: centers = initialCenters } = useQuery(
    ["centers"],
    () => getCentersClient(),
    {
      initialData: initialCenters,
      staleTime: 1000 * 60 * 5,
    }
  );

  const { data: leads = initialLeads } = useQuery(
    ["leads"],
    () => getLeadsClient(),
    {
      initialData: initialLeads,
      staleTime: 1000 * 60 * 5,
    }
  );

  const { data: batches = initialBatches } = useQuery(
    ["batches"],
    () => getBatchesClient(),
    {
      initialData: initialBatches,
      staleTime: 1000 * 60 * 5,
    }
  );

  // Filter data by selected center
  const filteredData = useMemo(() => {
    let filteredStudents = students;
    let filteredLeads = leads;
    let filteredCenters = centers;
    let filteredCourses = courses;
    let filteredBatches = batches;

    if (selectedCenter !== "all") {
      filteredStudents = students.filter((s) => s.centerId === selectedCenter);
      filteredLeads = leads.filter((l) => l.centerId === selectedCenter);
      filteredCenters = centers.filter((c) => c.id === selectedCenter);
      filteredBatches = batches.filter((b) => b.center?.id === selectedCenter);
    }

    return {
      students: filteredStudents,
      leads: filteredLeads,
      centers: filteredCenters,
      courses: filteredCourses,
      batches: filteredBatches,
    };
  }, [selectedCenter, students, leads, centers, courses, batches]);

  // Format currency - defined before useMemo to avoid initialization error
  const formatCurrency = (value: number) => {
    return `₦${value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  // Calculate all metrics with MoM/YoY comparisons
  const dashboardData = useMemo(() => {
    const start = range[0].startDate!;
    const end = range[0].endDate!;

    const {
      students: filteredStudents,
      leads: filteredLeads,
      centers: filteredCenters,
      courses: filteredCourses,
      batches: filteredBatches,
    } = filteredData;

    // Calculate previous period (same duration, one period back)
    const periodDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    const previousStart = new Date(start);
    previousStart.setDate(previousStart.getDate() - periodDays);
    const previousEnd = new Date(start);

    // Calculate year-over-year period
    const yoyStart = new Date(start);
    yoyStart.setFullYear(yoyStart.getFullYear() - 1);
    const yoyEnd = new Date(end);
    yoyEnd.setFullYear(yoyEnd.getFullYear() - 1);

    // Filter by date range
    const leadsInRange = filteredLeads.filter((l: Lead) =>
      includesDate(l.enquiryDate, start, end)
    );
    const studentsInRange = filteredStudents.filter((s: Student) =>
      includesDate(s.enrolledDate, start, end)
    );

    // Previous period data
    const leadsPreviousPeriod = filteredLeads.filter((l: Lead) =>
      includesDate(l.enquiryDate, previousStart, previousEnd)
    );
    const studentsPreviousPeriod = filteredStudents.filter((s: Student) =>
      includesDate(s.enrolledDate, previousStart, previousEnd)
    );

    // YoY period data
    const leadsInYoYRange = filteredLeads.filter((l: Lead) =>
      includesDate(l.enquiryDate, yoyStart, yoyEnd)
    );
    const studentsInYoYRange = filteredStudents.filter((s: Student) =>
      includesDate(s.enrolledDate, yoyStart, yoyEnd)
    );

    // Use billing, revenue, and pending from backend API (financeOverview)
    // The backend calculates these correctly based on actual course enrollments
    // IMPORTANT: Log the raw data first to see what we're actually getting
    console.log("🔍 [useMemo] initialFinanceOverview:", initialFinanceOverview);
    console.log(
      "🔍 [useMemo] initialFinanceOverview?.totalBilling:",
      initialFinanceOverview?.totalBilling
    );
    console.log(
      "🔍 [useMemo] initialFinanceOverview?.totalRevenue:",
      initialFinanceOverview?.totalRevenue
    );
    console.log(
      "🔍 [useMemo] initialFinanceOverview?.totalPending:",
      initialFinanceOverview?.totalPending
    );
    console.log(
      "🔍 [useMemo] initialFinanceOverview?.collectionRate:",
      initialFinanceOverview?.collectionRate
    );

    const totalBilling = initialFinanceOverview?.totalBilling ?? 0;
    const totalRevenue = initialFinanceOverview?.totalRevenue ?? 0;
    const totalPending = initialFinanceOverview?.totalPending ?? 0;
    const paymentCollectionRate = initialFinanceOverview?.collectionRate ?? 0;

    // Log extracted values to console for debugging
    console.log("=== FINANCE OVERVIEW DATA FROM BACKEND (useMemo) ===");
    console.log("✅ Extracted totalBilling:", totalBilling);
    console.log("✅ Extracted totalRevenue:", totalRevenue);
    console.log("✅ Extracted totalPending:", totalPending);
    console.log("✅ Extracted collectionRate:", paymentCollectionRate);
    console.log(
      "Full financeOverview object:",
      JSON.stringify(initialFinanceOverview, null, 2)
    );
    console.log("==========================================");

    // Calculate revenue from payments for trend data and MoM/YoY calculations
    const allPayments = filteredStudents.flatMap((s) => s.payments || []);
    const paymentsInRange = allPayments.filter((p: any) =>
      includesDate(p.paymentDate || p.createdAt, start, end)
    );

    const paymentsReceived = paymentsInRange.length;
    const totalPaymentsAmount = paymentsInRange.reduce(
      (sum, p: any) => sum + (p.amount || 0),
      0
    );

    // Previous period revenue
    const paymentsPreviousPeriod = allPayments.filter((p: any) =>
      includesDate(p.paymentDate || p.createdAt, previousStart, previousEnd)
    );
    const revenuePreviousPeriod = paymentsPreviousPeriod.reduce(
      (sum, p: any) => sum + (p.amount || 0),
      0
    );

    // YoY revenue
    const paymentsYoY = allPayments.filter((p: any) =>
      includesDate(p.paymentDate || p.createdAt, yoyStart, yoyEnd)
    );
    const revenueYoY = paymentsYoY.reduce(
      (sum, p: any) => sum + (p.amount || 0),
      0
    );

    // Calculate MoM and YoY percentages
    const revenueMoM =
      revenuePreviousPeriod > 0
        ? ((totalRevenue - revenuePreviousPeriod) / revenuePreviousPeriod) * 100
        : 0;
    const revenueYoYPercent =
      revenueYoY > 0 ? ((totalRevenue - revenueYoY) / revenueYoY) * 100 : 0;

    // Collection rate comes from backend, calculate MoM/YoY changes
    const collectionRatePrevious =
      totalBilling > 0 && revenuePreviousPeriod > 0
        ? (revenuePreviousPeriod / totalBilling) * 100
        : 0;
    const collectionRateMoM =
      collectionRatePrevious > 0
        ? paymentCollectionRate - collectionRatePrevious
        : 0;
    const collectionRateYoY =
      revenueYoY > 0 && totalBilling > 0
        ? paymentCollectionRate - (revenueYoY / totalBilling) * 100
        : 0;

    // Academic metrics
    const totalEnrollments = studentsInRange.length;
    const enrollmentMoM =
      studentsPreviousPeriod.length > 0
        ? ((totalEnrollments - studentsPreviousPeriod.length) /
            studentsPreviousPeriod.length) *
          100
        : 0;
    const enrollmentYoY =
      studentsInYoYRange.length > 0
        ? ((totalEnrollments - studentsInYoYRange.length) /
            studentsInYoYRange.length) *
          100
        : 0;

    const newLeads = leadsInRange.length;
    const leadsMoM =
      leadsPreviousPeriod.length > 0
        ? ((newLeads - leadsPreviousPeriod.length) /
            leadsPreviousPeriod.length) *
          100
        : 0;
    const leadsYoY =
      leadsInYoYRange.length > 0
        ? ((newLeads - leadsInYoYRange.length) / leadsInYoYRange.length) * 100
        : 0;

    const conversionRate =
      newLeads > 0 ? (totalEnrollments / newLeads) * 100 : 0;
    const conversionRatePrevious =
      leadsPreviousPeriod.length > 0
        ? (studentsPreviousPeriod.length / leadsPreviousPeriod.length) * 100
        : 0;
    const conversionRateMoM =
      conversionRatePrevious > 0 ? conversionRate - conversionRatePrevious : 0;

    const activeStudents = filteredStudents.filter(
      (s) => !s.deletedAt && s.status !== "DROPOUT"
    ).length;
    const activeStudentsPrevious = filteredStudents.filter((s) => {
      if (s.deletedAt || s.status === "DROPOUT") return false;
      const enrolledDate = new Date(s.enrolledDate);
      return enrolledDate >= previousStart && enrolledDate <= previousEnd;
    }).length;
    const activeStudentsMoM =
      activeStudentsPrevious > 0
        ? ((activeStudents - activeStudentsPrevious) / activeStudentsPrevious) *
          100
        : 0;

    // Operational metrics
    const activeCenters = filteredCenters.filter(
      (c) => c.status === centerStatusEnum.Active
    ).length;
    const activeCourses =
      selectedCenter === "all"
        ? filteredCourses.filter((c) => c.status === courseStatusEnum.Active)
            .length
        : filteredCourses.filter((c) => {
            if (c.status !== courseStatusEnum.Active) return false;
            return (
              c.courseAssignments?.some(
                (ca: any) => ca.centerId === selectedCenter
              ) ?? false
            );
          }).length;

    const activeBatches = filteredBatches.filter((b) => !b.deletedAt).length;
    const avgRevPerStudent =
      activeStudents > 0 ? totalRevenue / activeStudents : 0;

    // Center performance - use data from backend API if available
    // Otherwise calculate from local data as fallback
    let centerPerformance: CenterPerformance[];

    if (
      initialFinanceOverview?.centerPerformanceMatrix &&
      initialFinanceOverview.centerPerformanceMatrix.length > 0
    ) {
      // Use backend data - map centerPerformanceMatrix to CenterPerformance format
      centerPerformance = initialFinanceOverview.centerPerformanceMatrix.map(
        (row) => {
          const center = filteredCenters.find((c) => c.name === row.center);
          const centerStudents = filteredStudents.filter(
            (s) => s.centerId === center?.id
          );
          const centerLeads = filteredLeads.filter(
            (l) => l.centerId === center?.id
          );
          const centerConversion =
            centerLeads.length > 0
              ? (centerStudents.length / centerLeads.length) * 100
              : 0;

          return {
            centerId: center?.id || "",
            centerName: row.center,
            totalRevenue: row.revenue,
            totalBilling: row.billing,
            totalEnrollments: row.enrollments,
            pendingPayments: row.pending,
            conversionRate: row.conversion || centerConversion,
            status: row.status,
          };
        }
      );
    } else {
      // Fallback: calculate from local data
      centerPerformance = filteredCenters.map((center) => {
        const centerStudents = filteredStudents.filter(
          (s) => s.centerId === center.id
        );
        const centerLeads = filteredLeads.filter(
          (l) => l.centerId === center.id
        );

        // Calculate center revenue (collected payments)
        const centerRevenue = centerStudents.reduce((sum, s) => {
          const studentPayments = (s.payments || []).filter((p: any) =>
            includesDate(p.paymentDate || p.createdAt, start, end)
          );
          return (
            sum +
            studentPayments.reduce(
              (pSum: number, p: any) => pSum + (p.amount || 0),
              0
            )
          );
        }, 0);

        // Calculate center billing (sum of ALL course fees for ALL students in this center)
        const centerBilling = centerStudents.reduce((sum, student) => {
          if (student.courses && student.courses.length > 0) {
            const studentBilling = student.courses.reduce(
              (courseSum: number, course: Course) => {
                const fee =
                  course.courseAssignments?.[0]?.lumpSumFee ||
                  course.courseAssignments?.[0]?.baseFee ||
                  course.lumpSumFee ||
                  course.baseFee ||
                  0;
                return courseSum + fee;
              },
              0
            );
            return sum + studentBilling;
          }
          return sum;
        }, 0);

        const centerPending = Math.max(0, centerBilling - centerRevenue);
        const centerConversion =
          centerLeads.length > 0
            ? (centerStudents.length / centerLeads.length) * 100
            : 0;

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

    // Payment status distribution
    const paidAmount = totalRevenue;
    const pendingAmount = totalPending;
    const overdueAmount = 0; // TODO: Calculate overdue payments
    const paymentStatusDistribution: PaymentStatusDistribution = {
      paid: paidAmount,
      pending: pendingAmount,
      overdue: overdueAmount,
    };

    // Trend data for last 12 months
    const trendData: TrendDataPoint[] = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthPayments = allPayments.filter((p: any) =>
        includesDate(p.paymentDate || p.createdAt, monthStart, monthEnd)
      );
      const monthRevenue = monthPayments.reduce(
        (sum, p: any) => sum + (p.amount || 0),
        0
      );

      const monthStudents = filteredStudents.filter((s) =>
        includesDate(s.enrolledDate, monthStart, monthEnd)
      );

      // Calculate billing for students enrolled in this month
      const monthBilling = monthStudents.reduce((sum, student) => {
        if (student.courses && student.courses.length > 0) {
          const studentBilling = student.courses.reduce(
            (courseSum: number, course: Course) => {
              const fee =
                course.courseAssignments?.[0]?.lumpSumFee ||
                course.courseAssignments?.[0]?.baseFee ||
                course.lumpSumFee ||
                course.baseFee ||
                0;
              return courseSum + fee;
            },
            0
          );
          return sum + studentBilling;
        }
        return sum;
      }, 0);

      trendData.push({
        date: date.toISOString(),
        revenue: monthRevenue,
        billing: monthBilling,
        enrollments: monthStudents.length,
        payments: monthPayments.length,
      });
    }

    // Lead conversion funnel
    const leadsContacted = leadsInRange.filter(
      (l) => l.status === leadStatusEnum.Contacted
    ).length;
    const leadsDeposited = leadsInRange.filter(
      (l) => l.status === leadStatusEnum.Deposited
    ).length;
    const leadsEnrolled = leadsInRange.filter(
      (l) => l.status === leadStatusEnum.Enrolled
    ).length;
    const conversionFunnel = [
      { name: "Leads", value: newLeads },
      { name: "Contacted", value: leadsContacted },
      { name: "Deposited", value: leadsDeposited },
      { name: "Enrolled", value: leadsEnrolled },
    ];

    // Recent activity
    const activities: ActivityItem[] = [
      ...studentsInRange.slice(-10).map((s) => ({
        type: "enrollment" as const,
        id: s.id,
        title: `New student ${s.fullName} enrolled in ${
          (s.courses && s.courses[0]?.name) || "course"
        }.`,
        date: new Date(s.enrolledDate),
        meta: `${(s.courses && s.courses[0]?.name) || "—"}`,
        centerId: s.centerId,
      })),
      ...paymentsInRange.slice(-10).map((p: any) => ({
        type: "payment" as const,
        id: p.id,
        title: `Payment of ${formatCurrency(p.amount)} received from ${
          p.student?.fullName || "student"
        } for ${p.course?.name || "course"}.`,
        date: new Date(p.paymentDate || p.createdAt),
        meta: `${p.course?.name || "—"}`,
        centerId: p.student?.centerId,
      })),
    ]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 20);

    // Generate insights
    const insights: DashboardInsight[] = [];

    const highPendingCenters = centerPerformance.filter(
      (cp) => cp.pendingPayments > 32000
    );
    if (highPendingCenters.length > 0) {
      insights.push({
        type: "warning",
        message: `High pending payments (${formatCurrency(
          highPendingCenters[0].pendingPayments
        )}) at ${highPendingCenters[0].centerName}. Follow up required.`,
        centerName: highPendingCenters[0].centerName,
        value: highPendingCenters[0].pendingPayments,
      });
    }

    // Check for enrollment spikes
    const recentEnrollments = studentsInRange.length;
    if (recentEnrollments > 0) {
      const enrollmentGrowth = enrollmentMoM;
      if (enrollmentGrowth > 30) {
        insights.push({
          type: "info",
          message: `Enrollment spike (${enrollmentGrowth.toFixed(
            1
          )}% increase) this month. Excellent performance!`,
          value: enrollmentGrowth,
        });
      }
    }

    // Revenue target achievement
    if (revenueMoM > 0 && totalRevenue > 0) {
      insights.push({
        type: "info",
        message: `Revenue target for this period achieved. Excellent performance!`,
        value: totalRevenue,
      });
    }

    // Program metrics
    const jptpCount = filteredStudents.filter(
      (s) => s.programType === "JPTP"
    ).length;
    const internshipCount = filteredStudents.filter(
      (s) => s.programType === "INTERNSHIP"
    ).length;
    const nictpCount = filteredStudents.filter(
      (s) => s.programType === "NICTP"
    ).length;

    const metrics: DashboardMetrics = {
      totalRevenue,
      totalBilling,
      totalPending,
      totalPayments: paymentsReceived,
      paymentCollectionRate,
      billingVsRevenueGap: totalBilling - totalRevenue,
      averagePaymentPerStudent: avgRevPerStudent,
      totalEnrollments,
      newLeads,
      conversionRate,
      activeStudents,
      activeCenters,
      activeCourses,
      activeBatches,
      totalStudents: filteredStudents.length,
      dropouts: filteredStudents.filter((s) => s.status === "DROPOUT").length,
      graduated: filteredStudents.filter((s) => s.status === "GRADUATED")
        .length,
      archived: filteredStudents.filter((s) => s.deletedAt !== null).length,
      revenueMoM,
      revenueYoY: revenueYoYPercent,
      enrollmentMoM,
      enrollmentYoY,
      billingMoM: 0,
      billingYoY: 0,
      jptpCount,
      internshipCount,
      nictpCount,
    };

    // Log the metrics object to verify values are correct
    console.log("=== METRICS OBJECT BEING USED ===");
    console.log("metrics.totalRevenue:", metrics.totalRevenue);
    console.log("metrics.totalBilling:", metrics.totalBilling);
    console.log("metrics.totalPending:", metrics.totalPending);
    console.log(
      "metrics.paymentCollectionRate:",
      metrics.paymentCollectionRate
    );
    console.log("Full metrics object:", metrics);
    console.log("==================================");

    return {
      metrics,
      centerPerformance,
      trendData,
      paymentStatusDistribution,
      topPerformingCenters,
      conversionFunnel,
      activities,
      insights,
      paymentsReceived,
      paymentsReceivedMoM:
        paymentsPreviousPeriod.length > 0
          ? ((paymentsReceived - paymentsPreviousPeriod.length) /
              paymentsPreviousPeriod.length) *
            100
          : 0,
      paymentsReceivedYoY:
        paymentsYoY.length > 0
          ? ((paymentsReceived - paymentsYoY.length) / paymentsYoY.length) * 100
          : 0,
      collectionRateMoM,
      collectionRateYoY,
      conversionRateMoM,
      activeStudentsMoM,
      leadsMoM,
      leadsYoY,
    };
  }, [range, filteredData, selectedCenter, initialFinanceOverview]);

  const handleSelect = (ranges: any) => {
    setRange([ranges.selection]);
    setShowPicker(false);
  };

  const displayRange = useMemo(() => {
    const start = range[0].startDate!;
    const end = range[0].endDate!;
    const daysDiff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    const monthName = end.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    return `Last ${daysDiff} days ${monthName}`;
  }, [range]);

  const navigateDateRange = (direction: "prev" | "next") => {
    const days = Math.ceil(
      (range[0].endDate!.getTime() - range[0].startDate!.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const newStart = new Date(range[0].startDate!);
    const newEnd = new Date(range[0].endDate!);

    if (direction === "prev") {
      newStart.setDate(newStart.getDate() - days);
      newEnd.setDate(newEnd.getDate() - days);
    } else {
      newStart.setDate(newStart.getDate() + days);
      newEnd.setDate(newEnd.getDate() + days);
    }

    setRange([{ startDate: newStart, endDate: newEnd, key: "selection" }]);
  };

  const selectedCenterName =
    selectedCenter === "all"
      ? "All Centers"
      : centers?.find((c) => c.id === selectedCenter)?.name || "All Centers";

  // Generate trend data for sparklines (last 12 data points)
  const generateTrendData = (
    currentValue: number,
    trend: "up" | "down" | "neutral" = "up"
  ): number[] => {
    const dataPoints = 12;
    const trendData: number[] = [];
    const baseValue = currentValue * 0.7;
    const variation = currentValue * 0.1;

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

      const randomVariation = (Math.random() - 0.5) * variation;
      trendData.push(Math.max(0, value + randomVariation));
    }

    return trendData;
  };

  // Log dashboardData values when it changes (client-side)
  useEffect(() => {
    if (dashboardData) {
      console.log("=== DASHBOARD DATA VALUES (CLIENT-SIDE) ===");
      console.log(
        "dashboardData.metrics.totalBilling:",
        dashboardData.metrics.totalBilling
      );
      console.log(
        "dashboardData.metrics.totalRevenue:",
        dashboardData.metrics.totalRevenue
      );
      console.log(
        "dashboardData.metrics.totalPending:",
        dashboardData.metrics.totalPending
      );
      console.log(
        "dashboardData.metrics.paymentCollectionRate:",
        dashboardData.metrics.paymentCollectionRate
      );
      console.log("Full dashboardData.metrics:", dashboardData.metrics);
      console.log("===========================================");
    }
  }, [dashboardData]);

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
        {/* Header Section - Match Design Exactly */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-3">
              <UserCircle className="text-gray-600" size={24} />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Welcome, {user?.firstname || "Executive"} (
                  {user?.role || "Director"})
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Centerdropdown user={user} centers={centers} />

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateDateRange("prev")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Previous period"
                >
                  <ChevronLeft size={18} className="text-gray-600" />
                </button>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={displayRange}
                    onClick={() => setShowPicker(!showPicker)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[220px]"
                  />
                  {showPicker && (
                    <div className="absolute right-0 z-50 bg-white shadow-2xl rounded-xl p-4 mt-2 border border-gray-200">
                      <DateRangePicker
                        ranges={range}
                        onChange={handleSelect}
                        moveRangeOnFirstSelection={false}
                      />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => navigateDateRange("next")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Next period"
                >
                  <ChevronRight size={18} className="text-gray-600" />
                </button>
                <button
                  onClick={() => setShowPicker(!showPicker)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Select date range"
                >
                  <Calendar size={18} className="text-gray-600" />
                </button>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all">
                <Download size={18} />
                <span>Export Report</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm">
                <FileText size={18} />
                <span>Generate Summary</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 1: Financial KPIs */}
        <div className="mb-6">
          {/* DEBUG: Show raw values */}
          <div className="mb-4 p-4 bg-yellow-100 border-2 border-yellow-500 rounded">
            <strong>DEBUG VALUES:</strong> Billing=
            {dashboardData.metrics.totalBilling}, Revenue=
            {dashboardData.metrics.totalRevenue}, Pending=
            {dashboardData.metrics.totalPending}, Rate=
            {dashboardData.metrics.paymentCollectionRate}%
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
              title="Pending Payments"
              value={formatCurrency(dashboardData.metrics.totalPending)}
              icon={AlertCircle}
              color="red"
              formatValue={formatCurrency}
              trendData={generateTrendData(
                dashboardData.metrics.totalPending,
                "neutral"
              )}
              sparklineType="line"
              layout="simple"
            />
            <KPICard
              title="Total Billing"
              value={formatCurrency(dashboardData.metrics.totalBilling)}
              icon={DollarSign}
              color="blue"
              formatValue={formatCurrency}
              trendData={generateTrendData(
                dashboardData.metrics.totalBilling,
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
              changeValue={dashboardData.collectionRateMoM}
              changeValueYoY={dashboardData.collectionRateYoY}
              direction={dashboardData.collectionRateMoM >= 0 ? "up" : "down"}
              directionYoY={
                dashboardData.collectionRateYoY >= 0 ? "up" : "down"
              }
              icon={TrendingUp}
              color={
                dashboardData.metrics.paymentCollectionRate >= 70
                  ? "green"
                  : "amber"
              }
              trendData={generateTrendData(
                dashboardData.metrics.paymentCollectionRate,
                dashboardData.collectionRateMoM >= 0 ? "up" : "down"
              )}
              layout="simple"
            />
          </div>
        </div>

        {/* Row 2: Academic KPIs */}
        <div className="mb-6">
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
              layout="simple"
            />
            <KPICard
              title="All Leads"
              value={formatNumber(dashboardData.metrics.newLeads)}
              changeValue={dashboardData.leadsMoM}
              changeValueYoY={dashboardData.leadsYoY}
              direction={dashboardData.leadsMoM >= 0 ? "up" : "down"}
              directionYoY={dashboardData.leadsYoY >= 0 ? "up" : "down"}
              icon={Users}
              color="purple"
              trendData={generateTrendData(
                dashboardData.metrics.newLeads,
                dashboardData.leadsMoM >= 0 ? "up" : "down"
              )}
              layout="simple"
            />
            <KPICard
              title="Conversion Rate"
              value={`${dashboardData.metrics.conversionRate.toFixed(1)}%`}
              changeValue={dashboardData.conversionRateMoM}
              direction={dashboardData.conversionRateMoM >= 0 ? "up" : "down"}
              icon={BookOpen}
              color="blue"
              trendData={generateTrendData(
                dashboardData.metrics.conversionRate,
                dashboardData.conversionRateMoM >= 0 ? "up" : "down"
              )}
              layout="simple"
            />
            <KPICard
              title="Active Students"
              value={formatNumber(dashboardData.metrics.activeStudents)}
              changeValue={dashboardData.activeStudentsMoM}
              direction={dashboardData.activeStudentsMoM >= 0 ? "up" : "down"}
              icon={Users}
              color="blue"
              trendData={generateTrendData(
                dashboardData.metrics.activeStudents,
                dashboardData.activeStudentsMoM >= 0 ? "up" : "down"
              )}
              layout="simple"
            />
          </div>
        </div>

        {/* Row 3: Operational KPIs */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Active Centers"
              value={formatNumber(dashboardData.metrics.activeCenters)}
              icon={School}
              color="blue"
              layout="simple"
            />
            <KPICard
              title="Active Courses"
              value={formatNumber(dashboardData.metrics.activeCourses)}
              icon={BookOpen}
              color="blue"
              layout="simple"
            />
            <KPICard
              title="Active Batches"
              value={formatNumber(dashboardData.metrics.activeBatches)}
              icon={Calendar}
              color="blue"
              layout="simple"
            />
            <KPICard
              title="Avg. Rev. per Student"
              value={formatCurrency(
                dashboardData.metrics.averagePaymentPerStudent
              )}
              icon={DollarSign}
              color="green"
              formatValue={formatCurrency}
              layout="simple"
            />
          </div>
        </div>

        {/* Row 4: Programs KPIs */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <KPICard
              title="JPTP"
              value={formatNumber(dashboardData.metrics.jptpCount || 0)}
              icon={Users}
              color="blue"
              layout="simple"
            />
            <KPICard
              title="Internship"
              value={formatNumber(dashboardData.metrics.internshipCount || 0)}
              icon={Users}
              color="purple"
              layout="simple"
            />
            <KPICard
              title="NICTP"
              value={formatNumber(dashboardData.metrics.nictpCount || 0)}
              icon={Users}
              color="green"
              layout="simple"
            />
          </div>
        </div>

        {/* Visual Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-6">
            <TrendChart
              data={dashboardData.trendData}
              dataKey="revenue"
              title="Revenue Trend (Last 12 Months)"
              color="#60a5fa"
              formatValue={formatCurrency}
            />
            <TrendChart
              data={dashboardData.trendData}
              dataKey="enrollments"
              title="Enrollment Trend (Last 12 Months)"
              color="#3b82f6"
            />
            <StatusDistribution
              data={dashboardData.paymentStatusDistribution}
              title="Payment Status Distribution"
            />
          </div>

          <div className="flex flex-col space-y-6">
            {selectedCenter === "all" ? (
              <>
                <TopCentersChart
                  data={dashboardData.topPerformingCenters}
                  dataKey="revenue"
                  title="Top 5 Centers by Revenue"
                  color="#3b82f6"
                  formatValue={formatCurrency}
                />
                <TopCentersChart
                  data={dashboardData.topPerformingCenters}
                  dataKey="enrollments"
                  title="Top 5 Centers by Enrollment"
                  color="#10b981"
                />
              </>
            ) : null}
            <ConversionFunnel
              data={dashboardData.conversionFunnel}
              title="Lead Conversion Funnel"
            />
          </div>
        </div>

        {/* Center Performance Matrix */}
        {selectedCenter === "all" && (
          <div className="mb-6">
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

export default ExecutiveDashboard;
