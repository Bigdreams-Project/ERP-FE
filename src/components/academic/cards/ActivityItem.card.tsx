import { ActivityItemProps } from "@/app/dashboard/academic/overview/types";

const ActivityItem = ({ icon: Icon, text, time }: ActivityItemProps) => (
  <div className="flex items-start space-x-4 pb-2 border-b border-gray-300">
    <div className="flex-shrink-0 p-2 rounded-full bg-white text-[#0056B3FF]">
      <Icon size={20} />
    </div>
    <div className="flex-grow">
      <p className="text-sm text-[#242524FF]">{text}</p>
      <span className="text-xs text-[#8C8D8BFF]">{time}</span>
    </div>
  </div>
);

export default ActivityItem;
