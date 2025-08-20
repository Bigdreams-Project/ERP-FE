import { List } from "lucide-react";

interface Props {
  setIsModalOpen: (value: boolean) => void;
}

const NotFoundComponent = ({ setIsModalOpen }: Props) => (
  <div className="flex flex-col items-center justify-center h-[50vh] text-center text-gray-500 p-4">
    <div className="bg-gray-100 p-8 rounded-full mb-6">
      <List size={64} className="text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-800">
      Nothing to see — yet!
    </h3>
    <p className="mt-2 text-sm max-w-sm">
      Looks like you haven't added anything yet. Once you or someone does, your
      content will show up right here for easy access.
    </p>
    <button
      onClick={() => setIsModalOpen(true)}
      className="mt-6 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      + Add (Enrollment)
    </button>
  </div>
);

export default NotFoundComponent;
