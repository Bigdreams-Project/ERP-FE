import { studentPayment } from "@/data/mock/finance.data";
import Card from "./Card";

const ProofOfPaymentUpload = ({ data }: any) => {
  const CloudUpload = (props: any) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 7.5L14 21h-2" />
      <path d="m16 16-4-4-4 4" />
      <path d="M12 12v9" />
    </svg>
  );

  return (
    <Card title="Upload Proof of Payment" className="h-">
      <p className="text-xs text-gray-500 mb-4">
        Accepted formats: PDF, JPG, PNG (max 5MB)
      </p>

      {/* Drag and Drop Area */}
      <div
        className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl mb-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition duration-150"
        onClick={() => document.getElementById("file-upload")!.click()}
      >
        <CloudUpload className="text-gray-400 mb-2" />
        <p className="text-sm font-medium text-gray-600">
          Drag & drop files here or click to upload
        </p>
        <input type="file" id="file-upload" className="hidden" multiple />
      </div>

      {/* Recently Uploaded */}
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Recently Uploaded:
      </h3>
      <div className="space-y-1">
        {/* {studentPayment.recentlyUploaded.map((file: any, index: any) => (
          <p
            key={index}
            className="text-xs text-blue-600 hover:underline cursor-pointer"
          >
            {file}
          </p>
        ))} */}
        <p className="text-xs text-blue-600">
          No receipts available. Please upload.
        </p>
      </div>
    </Card>
  );
};

export default ProofOfPaymentUpload;
