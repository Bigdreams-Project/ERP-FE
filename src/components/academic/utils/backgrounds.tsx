import { AcademicStatus, ConversionSteps } from "@/data/enums";

export const getStepBgColor = (step: string) => {
  switch (step) {
    case ConversionSteps[0].id:
      return "bg-amber-50 text-amber-500 ring-amber-500/10";
    case ConversionSteps[1].id:
      return "bg-blue-50 text-blue-500 ring-blue-500/10";
    case ConversionSteps[2].id:
      return "bg-green-50 text-green-500 ring-green-500/10";
    case ConversionSteps[3].id:
      return "bg-purple-50 text-purple-500 ring-purple-500/10";
    default:
      return "bg-gray-50 text-gray-500 ring-gray-500/10";
  }
};

export const getStatusBgColor = (status: string) => {
  switch (status) {
    case AcademicStatus.ACTIVE:
      return "bg-green-100 text-green-800";
    case AcademicStatus.INACTIVE:
      return "bg-red-100 text-red-800";
    case AcademicStatus.DR0POUT:
      return "bg-red-100 text-red-800";
    case AcademicStatus.GRADUATED:
      return "bg-blue-100 text-blue-800";
    case AcademicStatus.DRAFT:
      return "bg-gray-200 text-gray-700";
    case AcademicStatus.ONHOLD:
      return "bg-gray-200 text-gray-700";
    case AcademicStatus.NEW:
      return "bg-amber-50 text-amber-500 ring-amber-500/10";
    case AcademicStatus.CONTACTED:
      return "bg-purple-200 text-purple-800";
    case AcademicStatus.DEPOSITED:
      return "bg-orange-200 text-orange-800";
    case AcademicStatus.NOT_INTERESTED:
      return "bg-red-200 text-red-900";
    case AcademicStatus.HIGH:
      return "bg-red-800 text-white";
    case AcademicStatus.LOW:
      return "bg-gray-700 text-white";
    case AcademicStatus.NORMAL:
      return "bg-green-800 text-white";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
