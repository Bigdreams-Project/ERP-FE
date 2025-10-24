export const batchData = {
  batchDetails: {
    "Batch Id": "WD-B03-B02",
    Status: "Active",
    "Course Name": "Full Stack Web Development",
    "Start Date": "Aug 27, 2025",
    "End Date": "Aug 27, 2026",
    Schedule: "Mon, Wed, Fri (9:00 AM - 1:00 PM)",
    Faculty: "Joseph Adams",
    "Faculty Phone": "(408) 785-3568",
    "Max Students": 47,
    Enrolled: 70,
    Phone: "(408) 785-3568",
    "Next Class": "Aug 27, 2025 - 9:00 AM",
  },
  studentList: [
    {
      name: "John Doe",
      attendance: "95%",
      paymentStatus: "Paid",
      amountPaid: "$1500 / $1500",
    },
    {
      name: "Jane Smith",
      attendance: "88%",
      paymentStatus: "Due",
      amountPaid: "$1200 / $1500",
    },
    {
      name: "Michael Lee",
      attendance: "72%",
      paymentStatus: "Due",
      amountPaid: "$1000 / $1500",
    },
    {
      name: "Emily Chen",
      attendance: "98%",
      paymentStatus: "Paid",
      amountPaid: "$1500 / $1500",
    },
    {
      name: "David Kim",
      attendance: "90%",
      paymentStatus: "Due",
      amountPaid: "$1300 / $1500",
    },
    {
      name: "Sarah Brown",
      attendance: "92%",
      paymentStatus: "Paid",
      amountPaid: "$1500 / $1500",
    },
  ],
  activityLog: [
    {
      date: "April 26, 2024",
      note: "Discussed project milestones, John Doe needs extra help with backend integration.",
    },
    {
      date: "April 15, 2024",
      note: "Reviewed Week 10 concepts. Students are generally on track.",
    },
    {
      date: "April 01, 2024",
      note: "Attendance Recorded: 'Attendance for John Mark marked Absent' (by Jane Smith)",
    },
    {
      date: "April 01, 2024",
      note: "Attendance Recorded: 'Attendance for John Mark marked Absent' (by Jane Smith)",
    },
    {
      date: "April 01, 2024",
      note: "Initial batch meeting. Expectations set for the course.",
    },
  ],
};

export const durationOptions = [
  { label: "12", value: "12" },
  { label: "24", value: "24" },
  { label: "36", value: "36" },
  { label: "48", value: "48" },
];

export const scheduleTimes = [
  { label: "08:00 AM", value: "08:00 AM" },
  { label: "08:30 AM", value: "08:30 AM" },
  { label: "09:00 AM", value: "09:00 AM" },
  { label: "09:30 AM", value: "09:30 AM" },
  { label: "10:00 AM", value: "10:00 AM" },
  { label: "10:30 AM", value: "10:30 AM" },
  { label: "11:00 AM", value: "11:00 AM" },
  { label: "11:30 AM", value: "11:30 AM" },
  { label: "12:00 PM", value: "12:00 PM" },
  { label: "12:30 PM", value: "12:30 PM" },
  { label: "01:00 PM", value: "01:00 PM" },
  { label: "01:30 PM", value: "01:30 PM" },
  { label: "02:00 PM", value: "02:00 PM" },
  { label: "02:30 PM", value: "02:30 PM" },
  { label: "03:00 PM", value: "03:00 PM" },
  { label: "03:30 PM", value: "03:30 PM" },
  { label: "04:00 PM", value: "04:00 PM" },
  { label: "04:30 PM", value: "04:30 PM" },
  { label: "05:00 PM", value: "05:00 PM" },
];

export const statuses = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Draft", value: "DRAFT" },
];
