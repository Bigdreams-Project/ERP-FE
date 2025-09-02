const ChartLegend = ({ data }: any) => (
  <ul className="space-y-2 text-sm text-gray-700 font-medium">
    {data.map((item: any, index: any) => (
      <li key={index} className="flex items-center space-x-2">
        <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
        <span>
          {item.name}
        </span>
      </li>
    ))}
  </ul>
);

export default ChartLegend;
