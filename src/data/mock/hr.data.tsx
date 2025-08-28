export const staffStats = [
  { title: "Total Staff", count: 100, color: "text-indigo-600", trend: "" },
  { title: "Active", count: 96, color: "text-emerald-600", trend: "" },
  { title: "On Leave", count: 2, color: "text-orange-500", trend: "" },
  { title: "Terminated", count: 1, color: "text-rose-600", trend: "" },
  { title: "Turnover", count: "3%", color: "text-fuchsia-600", trend: "" },
];

export const staffDistribution = [
  { name: "Faculty", value: 40, color: "#3182CE" },
  { name: "TM", value: 25, color: "#63B3ED" },
  { name: "CM", value: 15, color: "#90CDF4" },
  { name: "EM", value: 10, color: "#A0AEC0" },
  { name: "Intern", value: 5, color: "#CBD5E0" },
  { name: "Other", value: 5, color: "#E2E8F0" },
];

export const pendingActions = [
  { text: "Review Staff Onboarding Progress", type: "HR" },
  { text: "Approve Annual Leave Requests (2/12)", type: "HR" },
  { text: "Schedule Q3 Performance Reviews", type: "HR" },
  { text: "Process and interview for Tunde & Adebayo", type: "HR" },
];

export const systemActions = [
  { text: "Approve Annual HR Performance Reviews (26 Staff)", type: "System" },
  { text: "Approve Annual Leave Requests (2/12)", type: "System" },
  { text: "Generate Payroll Report for July", type: "System" },
  { text: "Enroll Volunteer Kit to New Hires (Aug-Sept)", type: "System" },
];

export const upcomingAlerts = [
  {
    title: "Contract expiring in 30 days",
    details: "Joel Mado - Due: 2024/10/25",
    icon: "⏰",
    action: "Extend Contract",
  },
  {
    title: "Contract expiring in 60 days",
    details: "Jane Mark - Due: 2024/11/25",
    icon: "⏰",
    action: "Extend Contract",
  },
  {
    title: "Probation review due next week",
    details: "Femi Ada - Due: 2024/09/10",
    icon: "📝",
    action: "Review",
  },
  {
    title: "Probation review due in 3 weeks",
    details: "Grace Uke - Due: 2024/09/30",
    icon: "📝",
    action: "Review",
  },
];

export const leaveReasons = [
  { reason: "Sick Leave (20%)" },
  { reason: "Annual Leave (65%)" },
  { reason: "Family Emergency (10%)" },
  { reason: "Personal Appointments (5%)" },
];

export const recentActivity = [
  {
    event: "Approval request for Joel Mado",
    user: "Sub & Coor",
    date: "2024-07-25",
    details: "Annual leave from Aug 5th to 15th.",
  },
  {
    event: "New hire onboarding initiated for Eunice Ahmed",
    user: "Eunice Ahmed",
    date: "2024-07-28",
    details: "All forms have been uploaded and interview done.",
  },
  {
    event: "Performance review submitted by Agboola Akinola",
    user: "Agboola A.",
    date: "2024-07-27",
    details: "Self-assessment and manager feedback.",
  },
  {
    event: "Updated employee directory entry for Ifeanyi Anafi",
    user: "HR Team",
    date: "2024-07-28",
    details: "Contact information and department change.",
  },
  {
    event: "New staff member added to academic system",
    user: "HR Team",
    date: "2024-07-29",
    details: "Onboarding process initiated.",
  },
];
