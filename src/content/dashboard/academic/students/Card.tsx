const Card = ({ title, children, className = "" }: any) => (
  <div
    className={`p-6 bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}
  >
    {title && (
      <h2 className="text-lg font-semibold text-gray-800 mb-5">{title}</h2>
    )}
    {children}
  </div>
);

export default Card;
