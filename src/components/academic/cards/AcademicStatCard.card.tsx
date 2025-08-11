import { AcademicStatCardProps } from "@/app/dashboard/academic/overview/types";

const AcademicStatCard = ({
  title,
  value,
  subText,
  icon: Icon,
}: AcademicStatCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm shadow-gray-400 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between">
    <div className="flex flex-col items-center mb-4">
      <h3 className="text-sm font-semibold text-[#8C8D8BFF]">{title}</h3>
      {Icon && <Icon className="text-[#8C8D8BFF] mt-2" size={20} />}
    </div>
    <div className="flex items-center justify-start">
      <span className="text-3xl font-bold text-[#242524FF]">{value}</span>
    </div>
    {subText && <p className="text-gray-400 text-xs mt-1">{subText}</p>}
  </div>
);

export default AcademicStatCard;
