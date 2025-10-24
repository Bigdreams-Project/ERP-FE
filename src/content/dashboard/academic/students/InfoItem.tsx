const InfoItem = ({
  label,
  value,
  valueColor = "text-gray-900",
  isStatus = false,
}: any) => (
  <div className="text-sm pb-4">
    <span className="text-gray-500 font-normal mr-2">{label}:</span>
    {isStatus ? (
      <span className="px-2 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-700">
        {value}
      </span>
    ) : (
      <span className={`font-medium ${valueColor}`}>{value}</span>
    )}
  </div>
);

export default InfoItem;
