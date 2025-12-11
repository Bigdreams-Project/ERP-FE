import { studentPayment } from "@/data/mock/finance.data";
import Card from "./Card";

const SystemActionsSummary = ({ data }: any) => (
  <Card title="System Actions Summary" className="h-">
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
      Upon successful payment recording, the system will automatically:
    </p>
    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
      {studentPayment.systemActions.map((action: any, index: any) => (
        <li key={index} className="pl-1">
          {action}
        </li>
      ))}
    </ul>
  </Card>
);

export default SystemActionsSummary;
