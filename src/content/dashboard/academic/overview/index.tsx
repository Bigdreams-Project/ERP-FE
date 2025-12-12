"use client";
import StatCard from "@/components/academic/cards/StatCard.card";
// Removed unused mockData import to speed up compilation
import { courseStatusEnum } from "@/data/view/course.data";
import { leadStatusEnum } from "@/data/view/lead.data";
import {
  formatNumber,
  getChangeText,
  includesDate,
  percent,
} from "@/lib/utils";
import { Center } from "@/types/academic/center.interface";
import { Course } from "@/types/academic/course.interface";
import { Lead } from "@/types/academic/lead.interface";
import { Student } from "@/types/academic/student.interface";
import { User } from "@/types/auth/user.interface";
import {
  BookOpen,
  GraduationCap,
  School,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { BiConversation } from "react-icons/bi";
import { FiPieChart } from "react-icons/fi";
import { LuGraduationCap } from "react-icons/lu";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ActivityItem from "../../../../components/academic/cards/ActivityItem.card";
import { centerStatusEnum } from "@/data/view/center.data";
import { useQuery } from "@tanstack/react-query";
import {
  getStudentsClient,
  getCoursesClient,
  getCentersClient,
  getLeadsClient,
  getLoggedInUserClient,
} from "@/lib/client-network";
import { useCenter } from "@/context/CenterContext";
import { userRoles } from "@/data/common/roles.data";

interface OverviewContentProps {
  user: User;
  students: Student[];
  courses: Course[];
  centers: Center[];
  leads: Lead[];
}

const OverviewContent = ({
  user: initialUser,
  students: initialStudents,
  courses: initialCourses,
  centers: initialCenters,
  leads: initialLeads,
}: OverviewContentProps) => {
  const {
    selectedCenter,
    isLoading: isCenterLoading,
    centerContext,
  } = useCenter();

  // Use React Query to fetch and cache all data
  // Backend handles center filtering via X-Center-Id header
  const { data: user = initialUser } = useQuery({
    queryKey: ["user"],
    queryFn: () => getLoggedInUserClient(),
    initialData: initialUser,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
  });

  const { data: students = initialStudents } = useQuery({
    queryKey: ["students", selectedCenter],
    queryFn: () =>
      getStudentsClient(selectedCenter === "all" ? null : selectedCenter),
    initialData: initialStudents,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
  });

  const { data: courses = initialCourses } = useQuery({
    queryKey: ["courses", selectedCenter],
    queryFn: () =>
      getCoursesClient(selectedCenter === "all" ? null : selectedCenter),
    initialData: initialCourses,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
  });

  const { data: centers = initialCenters } = useQuery({
    queryKey: ["centers", selectedCenter],
    queryFn: () =>
      getCentersClient(selectedCenter === "all" ? null : selectedCenter),
    initialData: initialCenters,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
  });

  const { data: leads = initialLeads } = useQuery({
    queryKey: ["leads", selectedCenter],
    queryFn: () =>
      getLeadsClient(selectedCenter === "all" ? null : selectedCenter),
    initialData: initialLeads,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
  });
  const [showPicker, setShowPicker] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(new Date().setDate(new Date().getDate() - 29)),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [displayRange, setDisplayRange] = useState("");

  const handleSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setRange([ranges.selection]);
    setShowPicker(false);
  };

  // Memoize expensive computations - only recalculate when dependencies change
  const computedData = useMemo(() => {
    const start = range[0].startDate!;
    const end = range[0].endDate!;

    // Filter leads and students by date (inclusive)
    const leadsInRange = leads.filter((l: Lead) =>
      includesDate(l.enquiryDate, start, end)
    );
    const studentsInRange = students.filter((s: Student) =>
      includesDate(s.enrolledDate, start, end)
    );

    // New Leads: All leads except ENROLLED status within date range
    const newLeadsInRange = leadsInRange.filter(
      (l: Lead) => l.status !== leadStatusEnum.Enrolled
    );
    const totalLeads = newLeadsInRange.length;
    
    // New Enrollments: All students registered within date range
    const totalStudents = studentsInRange.length;
    const totalCourses = courses.length;
    const totalCenters = centers.length;

    // Funnel: Based on leads in date range (all statuses for funnel)
    const leadsContacted = leadsInRange.filter(
      (l: Lead) => l.status === leadStatusEnum.Contacted
    ).length;

    const leadsDeposited = leadsInRange.filter(
      (l: Lead) => l.status === leadStatusEnum.Deposited
    ).length;

    const leadsEnrolled = leadsInRange.filter(
      (l: Lead) => l.status === leadStatusEnum.Enrolled
    ).length;

    // Conversion Rate: Leads that went from NEW to ENROLLED
    // Since all leads start as NEW, we count leads that are ENROLLED and created in date range
    const leadsNewToEnrolled = leadsInRange.filter(
      (l: Lead) => l.status === leadStatusEnum.Enrolled
    ).length;
    
    // Total leads that started as NEW in the range (all leads in range start as NEW)
    const totalNewLeadsInRange = leadsInRange.length;
    
    // Conversion rate: (leads that went from NEW to ENROLLED) / (total new leads in range)
    const conversionRate =
      totalNewLeadsInRange === 0 ? 0 : (leadsNewToEnrolled / totalNewLeadsInRange) * 100;

    const changeText = getChangeText(start, end);

    // Stats cards
    const stats = [
      {
        title: "New Leads",
        value: formatNumber(totalLeads),
        change: `${percent(totalLeads, Math.max(1, leads.length))} of all`,
        direction: "up",
        icon: UserPlus,
        changeText,
      },
      {
        title: "New Enrollments",
        value: formatNumber(totalStudents),
        change: `${percent(totalStudents, Math.max(1, students.length))} of all`,
        direction: "up",
        icon: GraduationCap,
        changeText,
      },
      {
        title: "Conversion Rate",
        value: `${conversionRate.toFixed(1)}%`,
        change: `${leadsNewToEnrolled} of ${totalNewLeadsInRange} leads converted`,
        direction: conversionRate > 0 ? "up" : "down",
        icon: BookOpen,
        changeText,
      },
      {
        title: "Active Courses",
        value: formatNumber(totalCourses),
        change: `${formatNumber(
          courses.filter((c: Course) => c.status === courseStatusEnum.Active)
            .length
        )} active`,
        direction: "up",
        icon: School,
        changeText,
      },
    ];

    // Funnel data for chart - based on leads in date range
    const funnel = [
      { name: "Leads", value: leadsInRange.length },
      { name: "Contacted", value: leadsContacted },
      { name: "Deposited", value: leadsDeposited },
      { name: "Enrolled", value: leadsEnrolled },
    ];

    // Course stats: top courses by leads and enrollments inside range
    const courseMap = new Map<
      string,
      { id: string; name: string; leads: number; enrolls: number }
    >();
    courses.forEach((c: Course) => {
      courseMap.set(c.id!, { id: c.id!, name: c.name, leads: 0, enrolls: 0 });
    });

    // Count leads per course (excluding ENROLLED status for new leads card)
    newLeadsInRange.forEach((l: Lead) => {
      if (!l.courseId) return;
      const entry = courseMap.get(l.courseId);
      if (entry) entry.leads += 1;
    });

    // Count enrolls per course (students may have courses array)
    studentsInRange.forEach((s: Student) => {
      (s.courses || []).forEach((sc: any) => {
        const entry = courseMap.get(sc.id);
        if (entry) entry.enrolls += 1;
      });
      if (s.leadId) {
        const lead = leads.find((l: Lead) => l.id === s.leadId);
        if (lead && lead.courseId) {
          const entry = courseMap.get(lead.courseId);
          if (entry) entry.enrolls += 0;
        }
      }
    });

    const courseStats = Array.from(courseMap.values())
      .sort(
        (
          a: { id: string; name: string; leads: number; enrolls: number },
          b: { id: string; name: string; leads: number; enrolls: number }
        ) => b.leads - a.leads
      )
      .slice(0, 6)
      .map(
        (c: { id: string; name: string; leads: number; enrolls: number }) => ({
          title: c.name,
          leads: c.leads,
          enrolls: c.enrolls,
          conversion:
            c.leads === 0
              ? "0%"
              : `${((c.enrolls / c.leads) * 100).toFixed(1)}%`,
        })
      );


    // Recent activity
    const leadActivity = leadsInRange.map((l: Lead) => ({
      type: "lead",
      id: l.id,
      title: `New Lead: ${l.fullName}`,
      date: new Date(l.enquiryDate),
      meta: `${l.course?.name || "—"} • ${
        l.centerId
          ? centers.find((c: Center) => c.id === l.centerId)?.name
          : "—"
      }`,
    }));
    const studentActivity = studentsInRange.map((s: Student) => ({
      type: "enroll",
      id: s.id,
      title: `New Enrollment: ${s.fullName}`,
      date: new Date(s.enrolledDate),
      meta: `${(s.courses && s.courses[0]?.name) || "—"} • ${
        s.batches?.[0]?.code || ""
      }`,
    }));

    const allActivity = [...leadActivity, ...studentActivity].sort(
      (
        a: {
          type: string;
          id: string;
          title: string;
          date: Date;
          meta: string;
        },
        b: { type: string; id: string; title: string; date: Date; meta: string }
      ) => b.date.getTime() - a.date.getTime()
    );

    // Recent activity (last 10 for display)
    const recentActivity = allActivity
      .slice(0, 10)
      .map(
        (a: {
          type: string;
          id: string;
          title: string;
          date: Date;
          meta: string;
        }) => ({
          icon: a.type === "lead" ? UserPlus : GraduationCap,
          text: a.title,
          time: `${a.date.toLocaleDateString()} • ${a.meta}`,
        })
      );

    // Activities for modal (all activities)
    const modalActivities = allActivity.map(
      (a: {
        type: string;
        id: string;
        title: string;
        date: Date;
        meta: string;
      }) => ({
        icon: a.type === "lead" ? UserPlus : GraduationCap,
        text: a.title,
        time: `${a.date.toLocaleDateString()} • ${a.meta}`,
      })
    );

    const insights = [
      {
        icon: <FiPieChart size={16} color="#FFC105FF" />,
        text: `You received ${newLeadsInRange.length} lead${
          newLeadsInRange.length !== 1 ? "s" : ""
        } in the selected range.`,
      },
      {
        icon: <LuGraduationCap size={18} color="#0891B2FF" />,
        text: `There were ${totalStudents} enrollments.`,
      },
      {
        icon: <BiConversation size={18} color="#16A34AFF" />,
        text: `Conversion rate: ${conversionRate.toFixed(1)}%`,
      },
      {
        icon: <BookOpen size={18} color="#16A34AFF" />,
        text: `Top course: ${courseStats[0]?.title || "—"} (${
          courseStats[0]?.leads || 0
        } leads)`,
      },
    ];

    return {
      stats,
      funnel,
      insights,
      courseStats,
      recentActivity,
      modalActivities,
      displayRange: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
    };
  }, [range, leads, students, courses, centers]);

  // Update display range when computed data changes
  useEffect(() => {
    setDisplayRange(computedData.displayRange);
  }, [computedData.displayRange]);

  // Format role to user-friendly display name
  const userRoleDisplay = useMemo(() => {
    if (!user?.role) return "User";
    const roleUpper = user.role.toUpperCase();
    const roleData = userRoles.find((r) => r.value === roleUpper);
    if (roleData) {
      return roleData.label;
    }
    return roleUpper
      .split("_")
      .map((word: string) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  }, [user?.role]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-100 p-4 md:py-8 md:px-3 font-inter">
      <div className="max-w-7xl mx-auto">
        {/* Overview Header */}
        <div className="overview-gradient p-6 rounded-xl shadow-sm shadow-gray-400 mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-white text-4xl font-extrabold">
            Academic Overview
          </h1>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome, {user.firstname} {user.lastname}!
            </h1>
            <p className="text-gray-300 mt-1">
              Here's what's happening today across your academic operations.
            </p>
            <p className="text-sm font-medium text-white mt-2">
              Role: {userRoleDisplay}
            </p>
          </div>
        </div>

        {/* Date selection */}
        <div className="flex justify-end mb-4">
          {/* Date range */}
          <div className="mb-4">
            <input
              type="text"
              readOnly
              value={displayRange || "Select a date range"}
              onClick={() => setShowPicker(!showPicker)}
              className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Date Picker */}
        {showPicker && (
          <div className="absolute right-0 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2">
            <DateRangePicker
              ranges={range}
              onChange={handleSelect}
              moveRangeOnFirstSelection={false}
              className="text-black"
            />
          </div>
        )}

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {computedData.stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts & Latest Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-sm shadow-gray-400 dark:shadow-gray-900 p-6 rounded-xl flex flex-col">
            <h2 className="text-lg font-bold mb-4 text-[#242524FF] dark:text-gray-100">
              Enrollment Funnel
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={computedData.funnel}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderColor: "#4b5563",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#9ca3af" }}
                    itemStyle={{ color: "#e5e7eb" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    fill="#4f46e5"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Latest Insights */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm shadow-gray-400 dark:shadow-gray-900 relative">
            <h2 className="text-lg font-bold mb-4 text-[#242524FF] dark:text-gray-100">
              Latest Insights
            </h2>

            {/* Insights List */}
            <ul className="space-y-4 mt-4">
              {computedData.insights.map((insight, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-[#8C8D8BFF] dark:text-gray-300"
                >
                  {insight.icon}
                  <span>{insight.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>


        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {computedData.courseStats.map((stat, index) => (
              <AcademicStatCard key={index} {...stat} />
            ))}
          </div>
        </div> */}

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm shadow-gray-400 dark:shadow-gray-900">
          <h2 className="text-lg font-bold mb-4 text-[#242524FF] dark:text-gray-100">
            Recent Activity
          </h2>
          <div className="space-y-6">
            {computedData.recentActivity.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No recent activity
              </p>
            ) : (
              computedData.recentActivity.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))
            )}
          </div>
          {computedData.modalActivities.length > 10 && (
            <button
              onClick={() => setShowActivityModal(true)}
              className="mt-4 w-full px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-500 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
            >
              View All
            </button>
          )}
        </div>

        {/* Activity Modal */}
        {showActivityModal && (
          <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4 font-sans">
            <div className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  All Recent Activity
                </h2>
                <button
                  onClick={() => setShowActivityModal(false)}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Activities List */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-6">
                  {computedData.modalActivities.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      No activities found
                    </p>
                  ) : (
                    computedData.modalActivities.map((activity, index) => (
                      <ActivityItem key={index} {...activity} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewContent;
