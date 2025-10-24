export const courseData = {
  courseDetails: {
    courseTitle: "Web Development with Python",
    code: "WDP-101",
    status: "Active",
    created: "Aug 27, 2025",
    duration: "12 weeks",
  },
  pricing: [
    { center: "Umuahia Center:", price: "₦94,000" },
    { center: "Kubwa Center:", price: "₦954,000" },
    { center: "Owerri Center:", price: "₦404,000" },
    { center: "Onitsha Center:", price: "₦615,000" },
    { center: "Enugu Center:", price: "₦622,000" },
    { center: "Eboyi Center:", price: "Not Set" },
  ],
  batches: [
    { name: "Batch 1 (Jan 2024 - Mar 2024)", enrolled: "16/25 Enrolled" },
    { name: "Batch 2 (Apr 2024 - Jun 2024)", enrolled: "5/25 Enrolled" },
    { name: "Batch 3 (Jul 2024 - Sep 2024)", enrolled: "Draft" },
  ],
  materials: [
    { name: "Syllabus PDF" },
    { name: "Course Handbook" },
    { name: "Resource Links Compilation" },
  ],
};

export const courseTypes = [
  { label: "Tec Terminal", value: "TEC_TERMINAL" },
  { label: "ApTech", value: "APTECH" },
  { label: "CPMS", value: "CPMS" },
];

export const durationOptions = Array.from({ length: 60 }, (_, i) => ({
  label: (i + 1).toString(),
  value: (i + 1).toString(),
}));


export const courseStatusEnum = {
  Active: "ACTIVE",
  Inactive: "INACTIVE",
  Draft: "DRAFT",
};
