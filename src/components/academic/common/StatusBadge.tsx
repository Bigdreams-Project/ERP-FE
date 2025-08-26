import { getStatusBgColor, getStepBgColor } from "../utils/backgrounds";

interface Props {
  step: string;
  label: string;
}

const StatusBadge = ({ step, label }: Props) => {
  const bgColorClass = getStepBgColor(step);
  const statusColorClass = getStatusBgColor(step);

  return (
    <span
      className={`py-1 px-2 rounded-full text-xs font-semibold ${statusColorClass}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
