import { getCenterStatus } from "../academic/utils/center";

interface Props {
  number: number;
  name: string;
  percentage?: number;
  status: string;
}

const TopPerformingCenter = ({ number, name, percentage, status }: Props) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-3">
      <div className="flex items-center space-x-2">
        <span className="text-md text-gray-600 dark:text-gray-400">
          {number}.
        </span>
        <span className="font-bold text-gray-800 dark:text-gray-200">
          {name}
        </span>
      </div>
      <div className="flex items-center space-x-4">
        {percentage !== undefined && (
          <span className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
            {percentage}%
          </span>
        )}
        {getCenterStatus(status)}
      </div>
    </div>
  );
};

export default TopPerformingCenter;
