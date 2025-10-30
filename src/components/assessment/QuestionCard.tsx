/**
 * QuestionCard Component
 * Displays a single assessment question with answer options
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui";
import type { Question } from "../../types";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (optionIndex: number) => void;
  onPrevious?: () => void;
  canGoPrevious: boolean;
}

const QuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onPrevious,
  canGoPrevious,
}: QuestionCardProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleOptionClick = (index: number) => {
    setSelectedOption(index);
    // Add slight delay for visual feedback before moving to next question
    setTimeout(() => {
      onAnswer(index);
      setSelectedOption(null);
    }, 300);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
      >
        <Card variant="elevated" className="max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-end mb-2">
              <span className="text-sm text-gray-500">
                Question {questionNumber} of {totalQuestions}
              </span>
            </div>
            <CardTitle className="text-2xl">{question.text}</CardTitle>
            {question.description && (
              <CardDescription className="text-base">
                {question.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleOptionClick(index)}
                className={`
                  w-full text-left px-6 py-4 rounded-lg border-2 transition-all duration-200
                  ${
                    selectedOption === index
                      ? "border-brand-teal bg-brand-teal/10 shadow-md scale-105"
                      : "border-gray-200 hover:border-brand-teal/50 hover:bg-gray-50"
                  }
                `}
                whileHover={{ scale: selectedOption === index ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                      ${
                        selectedOption === index
                          ? "border-brand-teal bg-brand-teal"
                          : "border-gray-300"
                      }
                    `}
                  >
                    {selectedOption === index && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 bg-white rounded-full"
                      />
                    )}
                  </div>
                  <span className="text-base font-medium text-gray-900">
                    {option}
                  </span>
                </div>
              </motion.button>
            ))}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 mt-6 border-t border-gray-200">
              <button
                onClick={onPrevious}
                disabled={!canGoPrevious}
                className={`
                  px-4 py-2 text-sm font-medium rounded-lg transition-colors
                  ${
                    canGoPrevious
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                ← Previous
              </button>
              <span className="text-xs text-gray-500">
                Select an option to continue
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuestionCard;
