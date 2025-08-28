interface Props {
  icon: any;
  text: string;
  textColor: string;
  bgColor: string;
  primary?: boolean;
}

const IconButton = ({ icon, text, textColor, bgColor, primary }: any) => (
  <button
    className={`flex items-center px-4 py-2 gap-2 ${bgColor} ${textColor} text-sm font-medium rounded-lg shadow shadow-gray-400 ${
      primary ? "" : "hover:bg-gray-100"
    } transition-colors`}
  >
    {icon}
    <span>{text}</span>
  </button>
);

export default IconButton;
