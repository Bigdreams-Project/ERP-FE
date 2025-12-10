import { List } from "lucide-react";

interface Props {
  text: string;
  setIsModalOpen: (value: boolean) => void;
  showButton?: boolean;
}

const NotFoundComponent = ({ text, setIsModalOpen, showButton = true }: Props) => (
  <div className="flex flex-col items-center justify-center text-center text-gray-500 p-4 py-6">
    <div className="bg-gray-200 p-8 rounded-full mb-6">
      <List size={60} className="text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-800">
      Nothing to see — yet!
    </h3>
    <p className="mt-2 text-sm max-w-sm">
      No search results found. Please try again.
    </p>
    {showButton && (
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-6 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        + Add {text}
      </button>
    )}
  </div>
);

export default NotFoundComponent;
