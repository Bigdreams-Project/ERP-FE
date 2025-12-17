import { AcademicStatus, ConversionSteps } from "@/data/enums";

export const getStepBgColor = (step: string) => {
  switch (step) {
    case "NEW":
      return "bg-amber-50 dark:bg-amber-900/30 text-amber-500 dark:text-amber-300 ring-amber-500/10 dark:ring-amber-500/20";
    case "IN_PROGRESS":
      return "bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-300 ring-blue-500/10 dark:ring-blue-500/20";
    case "CONTACTED":
      return "bg-cyan-50 dark:bg-cyan-900/30 text-cyan-500 dark:text-cyan-300 ring-cyan-500/10 dark:ring-cyan-500/20";
    case "DEPOSITED":
      return "bg-green-50 dark:bg-green-900/30 text-green-500 dark:text-green-300 ring-green-500/10 dark:ring-green-500/20";
    case "ENROLLED":
      return "bg-purple-50 dark:bg-purple-900/30 text-purple-500 dark:text-purple-300 ring-purple-500/10 dark:ring-purple-500/20";
    default:
      return "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-300 ring-gray-500/10 dark:ring-gray-500/20";
  }
};

export const getStatusBgColor = (status: string) => {
  switch (status) {
    case AcademicStatus.ACTIVE:
      return "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200";
    case AcademicStatus.INACTIVE:
      return "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200";
    case AcademicStatus.DR0POUT:
      return "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200";
    case AcademicStatus.GRADUATED:
      return "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200";
    case AcademicStatus.DRAFT:
      return "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200";
    case AcademicStatus.ONHOLD:
      return "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200";
    // Lead statuses with uppercase enum values
    case "NEW":
      return "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200";
    case "IN_PROGRESS":
      return "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200";
    case "CONTACTED":
      return "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-200";
    case "DEPOSITED":
      return "bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200";
    case "ENROLLED":
      return "bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200";
    case AcademicStatus.NOT_INTERESTED:
      return "bg-red-200 dark:bg-red-900/40 text-red-900 dark:text-red-200";
    case AcademicStatus.HIGH:
      return "bg-red-800 dark:bg-red-700 text-white";
    case AcademicStatus.LOW:
      return "bg-gray-700 dark:bg-gray-600 text-white";
    case AcademicStatus.NORMAL:
      return "bg-green-800 dark:bg-green-700 text-white";
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
  }
};

export const getPieChartBgColor = (colorClass: string): string => {
  const colors: Record<string, string> = {
    "bg-emerald-500": "#10B981",
    "bg-indigo-500": "#6366F1",
    "bg-teal-500": "#14B8A6",
    "bg-fuchsia-500": "#D946EF",
    "bg-slate-400": "#94A3B8",
    "bg-rose-500": "#F43F5E",
    "bg-orange-500": "#F97316",
    "bg-amber-500": "#F59E0B",
    "bg-yellow-500": "#EAB308",
    "bg-lime-500": "#84CC16",
  };
  return colors[colorClass] || "#000000";
};
