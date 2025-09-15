import { getStatusBgColor } from "../utils/backgrounds";

interface Props {
  status: string;
  amount: string;
}

const StatusBadge2 = ({ status, amount }: Props) => {
  const statusColorClass = getStatusBgColor(status);

  return (
    <span
      className={`py-1 px-2 rounded-full text-xs font-semibold ${statusColorClass}`}
    >
      {amount}
    </span>
  );
};

export default StatusBadge2;
