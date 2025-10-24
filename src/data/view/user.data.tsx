export enum Status {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  REJECTED = "REJECTED",
}

export const statuses = [
  { label: "Active", value: "ACTIVE" },
  { label: "Pending", value: "PENDING" },
  { label: "Rejected", value: "REJECTED" },
];

export const roles = [
  { label: "Admin", value: "ADMIN" },
  { label: "User", value: "USER" },
  { label: "Center Manager", value: "CENTER_MANAGER" },
  { label: "Center Academic Head", value: "CENTER_ACADEMIC_HEAD" },
  { label: "Regional Manager", value: "REGIONAL_MANAGER" },
  { label: "COO Head Office", value: "COO_HEAD_OFFICE" },
  { label: "Finance Officer", value: "FINANCE_OFFICER" },
  { label: "Faculty", value: "FACULTY" },
  { label: "Student", value: "STUDENT" },
  { label: "Guardian", value: "GUARDIAN" },
  { label: "CEO", value: "CEO" },
  { label: "Executive Assistant", value: "EXECUTIVE_ASSISTANT" },
];
