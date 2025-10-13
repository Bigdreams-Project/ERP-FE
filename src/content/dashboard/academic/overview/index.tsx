"use client";
import AcademicStatCard from "@/components/academic/cards/AcademicStatCard.card";
import StatCard from "@/components/academic/cards/StatCard.card";
import { mockData } from "@/data/mock/academic.data";
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
import { BookOpen, GraduationCap, School, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
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

interface OverviewContentProps {
  user: User;
  students: Student[];
  courses: Course[];
  centers: Center[];
  leads: Lead[];
}

const OverviewContent = ({
  user,
  students,
  courses,
  centers,
  leads,
}: OverviewContentProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(new Date().setDate(new Date().getDate() - 29)),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [displayRange, setDisplayRange] = useState("");

  const [stats, setStats] = useState<any[]>([]);
  const [funnel, setFunnel] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [academicStats, setAcademicStats] = useState<any[]>([]);
  const [courseStats, setCourseStats] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  const handleSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setRange([ranges.selection]);
    setDisplayRange(
      `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
    );

    const filteredInsights = mockData.insights.filter(
      (_, index) => index % 2 === 0
    );
    setInsights(filteredInsights);

    setShowPicker(false);
  };

  useEffect(() => {
    const start = range[0].startDate!;
    const end = range[0].endDate!;
    setDisplayRange(
      `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
    );

    // Filter leads and students by date (inclusive)
    const leadsInRange = leads.filter((l) =>
      includesDate(l.enquiryDate, start, end)
    );
    const studentsInRange = students.filter((s) =>
      includesDate(s.enrolledDate, start, end)
    );

    const totalLeads = leadsInRange.length;
    const totalStudents = studentsInRange.length;
    const totalCourses = courses.length;
    const totalCenters = centers.length;

    // Funnel
    const followUpScheduled = leadsInRange.filter((l) =>
      l.nextFollowUpDate ? includesDate(l.nextFollowUpDate, start, end) : false
    ).length;

    const leadsContacted = leadsInRange.filter(
      (l) => l.status === leadStatusEnum.Contacted
    ).length;

    const leadsDeposited = leadsInRange.filter(
      (l) => l.status === leadStatusEnum.Deposited
    ).length;

    const leadsEnrolled = leadsInRange.filter(
      (l) => l.status === leadStatusEnum.Enrolled
    ).length;

    // Conversions
    const leadsInRangeIds = new Set(leadsInRange.map((l) => l.id));
    const convertedFromLeadsInRange = studentsInRange.filter(
      (s) => s.leadId && leadsInRangeIds.has(s.leadId)
    ).length;

    // General conversion rate (students in range / leads in range)
    const conversionRate =
      totalLeads === 0 ? 0 : (totalStudents / totalLeads) * 100;
    const conversionFromLeads =
      totalLeads === 0 ? 0 : (convertedFromLeadsInRange / totalLeads) * 100;

    const changeText = getChangeText(start, end);

    // Stats cards
    const newStats = [
      {
        title: "New Leads",
        value: formatNumber(totalLeads),
        change: `${percent(totalLeads, Math.max(1, leads.length))} of all`,
        changeText,
      },
      {
        title: "New Enrollments",
        value: formatNumber(totalStudents),
        change: `${percent(totalStudents, Math.max(1, leads.length))} of all`,
        changeText,
      },
      {
        title: "Conversion Rate",
        value: `${conversionRate.toFixed(1)}%`,
        change: `${conversionFromLeads.toFixed(1)}% from leads in range`,
        changeText,
      },
      {
        title: "Active Courses",
        value: formatNumber(totalCourses),
        change: `${formatNumber(
          courses.filter((c) => c.status === courseStatusEnum.Active).length
        )} active`,
        changeText,
      },
    ];

    // Funnel data for chart
    const newFunnel = [
      { name: "Leads", value: totalLeads },
      { name: "Contacted", value: leadsContacted },
      { name: "Deposited", value: leadsDeposited },
      { name: "Enrolled", value: leadsEnrolled },
    ];

    // Course stats: top courses by leads and enrollments inside range
    const courseMap = new Map<
      string,
      { id: string; name: string; leads: number; enrolls: number }
    >();
    courses.forEach((c) => {
      courseMap.set(c.id!, { id: c.id!, name: c.name, leads: 0, enrolls: 0 });
    });

    // Count leads per course
    leadsInRange.forEach((l) => {
      if (!l.courseId) return;
      const entry = courseMap.get(l.courseId);
      if (entry) entry.leads += 1;
    });

    // Count enrolls per course (students may have courses array)
    studentsInRange.forEach((s) => {
      (s.courses || []).forEach((sc: any) => {
        const entry = courseMap.get(sc.id);
        if (entry) entry.enrolls += 1;
      });
      if (s.leadId) {
        const lead = leads.find((l) => l.id === s.leadId);
        if (lead && lead.courseId) {
          const entry = courseMap.get(lead.courseId);
          if (entry) entry.enrolls += 0;
        }
      }
    });

    const courseStatsArray = Array.from(courseMap.values())
      .sort((a, b) => b.leads - a.leads)
      .slice(0, 6)
      .map((c) => ({
        title: c.name,
        leads: c.leads,
        enrolls: c.enrolls,
        conversion:
          c.leads === 0 ? "0%" : `${((c.enrolls / c.leads) * 100).toFixed(1)}%`,
      }));

    // Academic summary cards
    const newAcademicStats = [
      {
        title: "Centers",
        value: formatNumber(totalCenters),
        subText: `${
          centers.filter((ct) => ct.status === centerStatusEnum.Active).length
        } active`,
        icon: School,
      },
      {
        title: "Students (range)",
        value: formatNumber(totalStudents),
        subText: `${percent(
          totalStudents,
          Math.max(1, students.length)
        )} of all`,
        icon: Users,
      },
      {
        title: "Leads (range)",
        value: formatNumber(totalLeads),
        subText: `${percent(totalLeads, Math.max(1, leads.length))} of all`,
        icon: Users,
      },
      {
        title: "Conversion",
        value: `${conversionRate.toFixed(1)}%`,
        subText: `${convertedFromLeadsInRange} direct conversions`,
        icon: Users,
      },
    ];

    // Recent activity
    const leadActivity = leadsInRange.map((l) => ({
      type: "lead",
      id: l.id,
      title: `New Lead: ${l.fullName}`,
      date: new Date(l.enquiryDate),
      meta: `${l.course?.name || "—"} • ${
        l.centerId ? centers.find((c) => c.id === l.centerId)?.name : "—"
      }`,
    }));
    const studentActivity = studentsInRange.map((s) => ({
      type: "enroll",
      id: s.id,
      title: `New Enrollment: ${s.fullName}`,
      date: new Date(s.enrolledDate),
      meta: `${(s.courses && s.courses[0]?.name) || "—"} • ${
        s.batches?.[0]?.code || ""
      }`,
    }));

    const allActivity = [...leadActivity, ...studentActivity]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 20);

    const recentActivity = allActivity.map((a) => ({
      icon: a.type === "lead" ? UserPlus : GraduationCap,
      text: a.title,
      time: `${a.date.toLocaleDateString()} • ${a.meta}`,
    }));

    const newInsights = [
      {
        icon: <FiPieChart size={16} color="#FFC105FF" />,
        text: `You received ${totalLeads} lead${
          totalLeads !== 1 ? "s" : ""
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
        text: `Top course: ${courseStatsArray[0]?.title || "—"} (${
          courseStatsArray[0]?.leads || 0
        } leads)`,
      },
    ];

    setStats(newStats);
    setFunnel(newFunnel);
    setInsights(newInsights);
    setAcademicStats(newAcademicStats);
    setCourseStats(courseStatsArray);
    setRecentActivity(recentActivity);
  }, [range, leads, students, courses, centers]);

  useEffect(() => {
    const start = range[0].startDate!;
    const end = range[0].endDate!;
    setDisplayRange(
      `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
    );
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-100 p-4 md:py-8 md:px-3 font-inter">
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
              Role: {user?.role?.toLocaleUpperCase()}
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
              className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Date Picker */}
        {showPicker && (
          <div className="absolute right-0 z-50 bg-white shadow-lg rounded-lg p-2">
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
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts & Latest Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white shadow-sm shadow-gray-400 p-6 rounded-xl flex flex-col">
            <h2 className="text-lg font-bold mb-4 text-[#242524FF]">
              Enrollment Funnel
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={funnel}
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
          <div className="bg-white p-6 rounded-xl shadow-sm shadow-gray-400 relative">
            <h2 className="text-lg font-bold mb-4 text-[#242524FF]">
              Latest Insights
            </h2>

            {/* Insights List */}
            <ul className="space-y-4 mt-4">
              {insights.map((insight, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-[#8C8D8BFF]"
                >
                  {insight.icon}
                  <span>{insight.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {academicStats.map((stat, index) => (
            <AcademicStatCard key={index} {...stat} />
          ))}
        </div>

        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {courseStats.map((stat, index) => (
              <AcademicStatCard key={index} {...stat} />
            ))}
          </div>
        </div> */}

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm shadow-gray-400">
          <h2 className="text-lg font-bold mb-4 text-[#242524FF]">
            Recent Activity
          </h2>
          <div className="space-y-6">
            {recentActivity.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewContent;
