export type Role =
  | "centerManager"
  | "centerAcademicHead"
  | "regionalManager"
  | "coo"
  | "financeOfficer"
  | "faculty"
  | "student"
  | "parent"
  | "ceo"
  | "executiveAssistant";

export interface PermissionSet {
  canAccess: string[];
  canView: string[];
  canPerform: string[];
  cannotPerform: string[];
  dataScope: string;
}

export const permissions: Record<Role, PermissionSet> = {
  centerManager: {
    canAccess: ["academic", "finance", "hr", "reporting"],
    canView: [
      "centers",
      "students",
      "courses",
      "batches",
      "financeOverview",
      "paymentsInvoices",
      "leaveAttendance",
      "performance",
    ],
    canPerform: [
      "enrollStudent",
      "assignBatch",
      "markAsPaid",
      "approveLeave",
      "submitLeaveRequest",
      "sendMessages",
      "viewCenterKPIs",
    ],
    cannotPerform: [
      "editCoursePricing",
      "generatePayroll",
      "approveRefunds",
      "createNewUsers",
      "approveCOOLeave",
      "editFranchisePayments",
    ],
    dataScope: "ownCenterOnly",
  },

  centerAcademicHead: {
    canAccess: ["academic", "hr"],
    canView: [
      "courses",
      "batches",
      "facultyAttendance",
      "leave",
      "performance",
    ],
    canPerform: [
      "scheduleClasses",
      "assignFaculty",
      "conductTrialClasses",
      "monitorFaculty",
      "updateCourseMaterials",
      "approveFacultyLeave",
      "viewLMSMaterials",
    ],
    cannotPerform: [
      "enrollStudents",
      "recordPayments",
      "generatePayroll",
      "editPricing",
      "approveCMLeave",
      "createNewCourses",
    ],
    dataScope: "ownCenterOnly",
  },

  regionalManager: {
    canAccess: ["academic", "finance", "hr", "reporting"],
    canView: [
      "centersInRegion",
      "financeOverview",
      "franchiseTracking",
      "performance",
      "centerPerformance",
    ],
    canPerform: [
      "approveLeave",
      "viewCenterKPIs",
      "manageCenterReports",
      "exportReports",
      "flagIrregularities",
    ],
    cannotPerform: [
      "editPricing",
      "generatePayroll",
      "approveRefunds",
      "createNewUsers",
      "approveCOOLeave",
    ],
    dataScope: "regionOnly",
  },

  coo: {
    canAccess: ["allModules"],
    canView: [
      "allCenters",
      "financeOverviewConsolidated",
      "feePlans",
      "payroll",
      "chartOfAccounts",
      "franchiseTracking",
      "userManagement",
      "executiveDashboard",
    ],
    canPerform: [
      "createEditCourses",
      "setPricingByCenter",
      "approveRefunds",
      "generatePayroll",
      "createNewCenters",
      "createUsersRoles",
      "runPLCashflow",
      "approveLeaveAllLevels",
      "sendSystemWideAnnouncements",
    ],
    cannotPerform: ["bypassCEORefunds"],
    dataScope: "allCenters",
  },

  financeOfficer: {
    canAccess: ["finance"],
    canView: ["paymentsInvoices", "banking", "financeOverview", "payrollView"],
    canPerform: [
      "recordPayments",
      "confirmPaymentUploadReceipt",
      "markAsPaid",
      "viewBankLedger",
      "reconcileDailyCollections",
      "flagOverduePayments",
      "exportFinancialData",
    ],
    cannotPerform: [
      "editPricing",
      "generatePayroll",
      "approveRefunds",
      "createNewUsers",
      "viewOtherCenters",
    ],
    dataScope: "assignedCenters",
  },

  faculty: {
    canAccess: ["academic"],
    canView: [
      "assignedCoursesBatches",
      "LMSMaterials",
      "attendance",
      "performanceKPIs",
    ],
    canPerform: [
      "markAttendance",
      "accessLMSMaterials",
      "viewStudentProgress",
      "submitLeaveRequest",
      "viewPersonalSchedule",
    ],
    cannotPerform: [
      "enrollStudents",
      "recordPayments",
      "editCourseContent",
      "generateReports",
      "approveLeave",
      "generatePayroll",
    ],
    dataScope: "ownCoursesStudents",
  },

  student: {
    canAccess: ["portal"],
    canView: [
      "courseMaterials",
      "attendanceRecord",
      "paymentHistory",
      "assignmentDeadlines",
      "batchSchedule",
    ],
    canPerform: [
      "enrollInCourse",
      "makePayments",
      "viewBalance",
      "submitLeaveRequest",
      "accessLMS",
    ],
    cannotPerform: [
      "editCourseContent",
      "viewOtherStudents",
      "viewFinancialReports",
    ],
    dataScope: "ownDataOnly",
  },

  parent: {
    canAccess: ["portal"],
    canView: [
      "childAttendance",
      "paymentHistory",
      "courseProgress",
      "walletFunding",
    ],
    canPerform: [
      "enrollChild",
      "fundStudentWallet",
      "receiveAlerts",
      "viewFinancialReports",
    ],
    cannotPerform: ["editCourseContent", "approveRefunds"],
    dataScope: "childDataOnly",
  },

  ceo: {
    canAccess: ["allModulesViewOnly"],
    canView: [
      "executiveDashboard",
      "financialReports",
      "franchiseTracking",
      "performanceReviews",
    ],
    canPerform: [
      "approveRefunds",
      "approveContractRenewals",
      "viewAllData",
      "createUsersDelegatedToCOO",
    ],
    cannotPerform: ["dailyOperations", "markAttendance"],
    dataScope: "allCenters",
  },

  executiveAssistant: {
    canAccess: ["adminHQ"],
    canView: [
      "ceoDashboard",
      "leaveDefermentApprovals",
      "meetingSchedules",
      "ceoAlerts",
    ],
    canPerform: [
      "forwardLeaveToCEO",
      "scheduleMeetings",
      "recordPayroll",
      "manageStudents",
    ],
    cannotPerform: ["approveRefunds", "editCourseContent"],
    dataScope: "allCentersViewOnly",
  },
};
