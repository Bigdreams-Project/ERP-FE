import { CheckCircle } from "lucide-react";
import { MdOutlineErrorOutline } from "react-icons/md";

interface Props {
  number: number;
  name: string;
  percentage: number;
  status: string;
}

const TopPerformingCenter = ({ number, name, percentage, status }: Props) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-300 pb-3">
      <div className="flex items-center space-x-2">
        <span className="text-md text-gray-600">{number}.</span>
        <span className="font-bold text-gray-800">{name}</span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600 font-semibold">{percentage}%</span>
        {status == "good" ? (
          <CheckCircle size={16} color="#22c55e" />
        ) : (
          <MdOutlineErrorOutline size={18} color="#22c55e" />
        )}
      </div>
    </div>
  );
};

export default TopPerformingCenter;
