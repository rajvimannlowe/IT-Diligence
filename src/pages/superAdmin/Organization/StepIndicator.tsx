import React from 'react';
import { CheckCircle } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {/* Connecting line background */}
        <div className="absolute top-4 left-4 right-4 h-1 bg-gray-200 rounded-full z-0" />
        
        {/* Progress line */}
        <div 
          className="absolute top-4 left-4 h-1 bg-linear-to-r from-stages-self-reflection to-brand-teal rounded-full z-10 transition-all duration-500 ease-in-out"
          style={{
            width: currentStep === 0 ? '0%' : `${(currentStep / (steps.length - 1)) * 100}%`,
            right: currentStep === 0 ? 'auto' : `${100 - (currentStep / (steps.length - 1)) * 100}%`
          }}
        />

        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center relative z-20">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300 ${
                index < currentStep
                  ? 'bg-brand-teal border-brand-teal text-white shadow-lg'
                  : index === currentStep
                  ? 'bg-stages-self-reflection border-stages-self-reflection text-white shadow-lg'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}
            >
              {index < currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </div>
            <span
              className={`mt-3 text-sm font-medium text-center max-w-[120px] ${
                index <= currentStep ? 'text-brand-navy' : 'text-gray-400'
              }`}
            >
              Step {index + 1}: {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
