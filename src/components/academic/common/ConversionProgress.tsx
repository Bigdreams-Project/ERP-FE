import { conversionSteps } from "@/data/mock/academic.data";
import { FaCheckCircle } from "react-icons/fa";
import { RiRecordCircleFill } from "react-icons/ri";
import { getStepBgColor } from "../utils/backgrounds";

interface ConversionProgressProps {
  currentStep: string;
}

export default function ConversionProgress({
  currentStep,
}: ConversionProgressProps) {
  const currentIndex = conversionSteps.findIndex((s) => s.id === currentStep);
  const progress = ((currentIndex + 1) / conversionSteps.length) * 100;

  return (
    <div className="w-full p-4 bg-white">
      <div className="mt-4 flex items-center flex-wrap text-sm">
        {conversionSteps.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          return (
            <div key={step.id}>
              <span className="inline-flex items-center gap-1">
                <span className={`${getStepBgColor(step.id)}`}>
                  [{isCompleted ? "●" : "○"}]
                </span>
                <span
                  className={
                    isCompleted ? "text-gray-900 font-medium" : "text-gray-500"
                  }
                >
                  {step.label}
                </span>
              </span>
              {idx < conversionSteps.length - 1 && (
                <span className="mx-2 text-gray-400">→</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-4">
        <p className="mt-4 text-sm text-gray-800">
          Progress: {progress.toFixed(0)}%
        </p>

        <div className="relative flex items-center">
          {/* Progress bar */}
          <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-200 rounded-full -translate-y-1/2">
            <div
              className="h-2 bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Stepper */}
          <div className="relative w-full z-30 flex justify-between items-center">
            <div className="flex flex-col items-start">
              {renderStep(conversionSteps[0], 0, currentIndex)}
            </div>

            <div className="flex flex-1 justify-center space-x-24">
              {conversionSteps
                .slice(1, conversionSteps.length - 1)
                .map((step, idx) => renderStep(step, idx + 1, currentIndex))}
            </div>

            <div className="flex flex-col items-end">
              {renderStep(
                conversionSteps[conversionSteps.length - 1],
                conversionSteps.length - 1,
                currentIndex
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const renderStep = (
  step: { id: string; label: string },
  idx: number,
  currentIndex: number
) => {
  const isCompleted = idx <= currentIndex;

  return (
    <div key={step.id} className="flex flex-col items-center min-w-[80px]">
      <div
        className={`rounded-full transition-all duration-300 ${
          isCompleted
            ? `bg-white ${getStepBgColor(step.id)}`
            : `bg-white ${getStepBgColor(step.id)}`
        }`}
      >
        {isCompleted ? (
          <FaCheckCircle size={24} />
        ) : (
          <RiRecordCircleFill size={24} />
        )}
      </div>
    </div>
  );
};
