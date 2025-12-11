const InfoItem = ({
  label,
  value,
  valueColor = "text-gray-900 dark:text-gray-100",
  isStatus = false,
}: any) => (
  <div className="text-sm pb-4">
    <span className="text-gray-500 dark:text-gray-400 font-normal mr-2">{label}:</span>
    {isStatus ? (
      <span className="px-2 py-0.5 text-xs font-semibold rounded bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-200">
        {value}
      </span>
    ) : (
      <span className={`font-medium ${valueColor}`}>{value}</span>
    )}
  </div>
);

export default InfoItem;
