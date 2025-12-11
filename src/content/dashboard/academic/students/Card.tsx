const Card = ({ title, children, className = "" }: any) => (
  <div
    className={`p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm ${className}`}
  >
    {title && (
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-5">{title}</h2>
    )}
    {children}
  </div>
);

export default Card;
