import { getStatusBgColor, getStepBgColor } from "../utils/backgrounds";

interface Props {
  step: string;
  label: string;
}

// Helper function to format enum-style labels (IN_PROGRESS -> In Progress)
const formatLabel = (label: string): string => {
  if (!label) return "";
  // Convert underscore format to title case with spaces
  return label
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const StatusBadge = ({ step, label }: Props) => {
  const bgColorClass = getStepBgColor(step);
  const statusColorClass = getStatusBgColor(step);

  return (
    <span
      className={`py-1 px-2 rounded-full text-xs font-semibold ${statusColorClass}`}
    >
      {formatLabel(label)}
    </span>
  );
};

export default StatusBadge;
