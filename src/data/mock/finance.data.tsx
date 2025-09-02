export const kpiData = [
  {
    title: "Overall Month-on-Month Growth",
    value: "5.2%",
    trend: "positive",
    description: "increase in student count",
  },
  {
    title: "Overall Reduction",
    value: "-10%",
    trend: "negative",
    description: "decrease in outstanding",
  },
  {
    title: "Refund Requests",
    value: "7",
    trend: "neutral",
    description: "Pending requests",
  },
  {
    title: "Invoice Compliance",
    value: "90%",
    trend: "positive",
    description: "in adherence to agreements",
  },
];

export const mainMetrics = [
  {
    title: "Total Revenue",
    value: "N8.2M",
    trend: "N+0.5M vs last month",
    color: "bg-indigo-600",
  },
  {
    title: "Expenses",
    value: "N420K",
    trend: "N+50k vs last month",
    color: "bg-rose-500",
  },
  {
    title: "Profit",
    value: "N3.1M",
    trend: "N+15% vs last month",
    color: "bg-emerald-500",
  },
  {
    title: "Cash Flow",
    value: "N5.1M",
    trend: "N+15% vs last month",
    color: "bg-sky-500",
  },
];

export const revenueDistribution = [
  { name: "Abuja", value: "N2.5M", color: "bg-emerald-500" },
  { name: "Kaduna", value: "N1.5M", color: "bg-indigo-500" },
  { name: "Lagos", value: "N2.0M", color: "bg-teal-500" },
  { name: "Oshodi", value: "N1.2M", color: "bg-fuchsia-500" },
  { name: "Other", value: "N1.0M", color: "bg-slate-400" },
];

export const expensesDistribution = [
  { name: "Salaries", value: "N200,000", color: "bg-rose-500" },
  { name: "Utilities", value: "N80,000", color: "bg-orange-500" },
  { name: "Rent", value: "N60,000", color: "bg-amber-500" },
  { name: "Office", value: "N40,000", color: "bg-yellow-500" },
  { name: "Other", value: "N40,000", color: "bg-lime-500" },
];

export const topCenters = [
  { name: "TecTerminal HQ", revenue: "99%", progress: "bg-emerald-500" },
  { name: "Aptech Kaduna", revenue: "98%", progress: "bg-emerald-500" },
  { name: "TecTerminal Abuja", revenue: "95%", progress: "bg-emerald-500" },
  { name: "TecTerminal Enugu", revenue: "88%", progress: "bg-indigo-500" },
  { name: "TecTerminal Lekki", revenue: "85%", progress: "bg-orange-500" },
];

export const overduePayments = [
  {
    student: "Chioma Adebayo",
    course: "Web Development",
    center: "TecTerminal HQ",
    amount: "N55,000",
    dueDate: "10/25/2024",
  },
  {
    student: "David Okoro",
    course: "Data Science",
    center: "Aptech Kaduna",
    amount: "N75,000",
    dueDate: "10/28/2024",
  },
  {
    student: "Kingsley Uche",
    course: "Product Design",
    center: "TecTerminal Enugu",
    amount: "N150,000",
    dueDate: "10/28/2024",
  },
  {
    student: "Grace Ude",
    course: "Digital Marketing",
    center: "TecTerminal Lekki",
    amount: "N45,000",
    dueDate: "10/28/2024",
  },
];

export const franchisePayments = [
  {
    center: "TecTerminal Port Harcourt",
    amount: "N150,000",
    dueDate: "2024-07-29",
    status: "Paid",
  },
  {
    center: "TecTerminal Kano",
    amount: "N220,000",
    dueDate: "2024-07-25",
    status: "Overdue",
  },
  {
    center: "TecTerminal Ibadan",
    amount: "N150,000",
    dueDate: "2024-08-01",
    status: "Paid",
  },
  {
    center: "TecTerminal Abuja",
    amount: "N180,000",
    dueDate: "2024-08-10",
    status: "Overdue",
  },
  {
    center: "TecTerminal Katsina",
    amount: "N250,000",
    dueDate: "2024-08-15",
    status: "Paid",
  },
];

export const topPerformingCenters = [
  {
    id: 1,
    centerName: "TecTerminal HQ",
    score: 98,
    status: "good",
  },
  {
    id: 2,
    centerName: "Aptech Kubwa",
    score: 95,
    status: "good",
  },
  {
    id: 3,
    centerName: "TecTerminal Yaba",
    score: 92,
    status: "good",
  },
  {
    id: 4,
    centerName: "TecTerminal Enugu",
    score: 88,
    status: "bad",
  },
  {
    id: 5,
    centerName: "TecTerminal Lekki",
    score: 85,
    status: "bad",
  },
];
