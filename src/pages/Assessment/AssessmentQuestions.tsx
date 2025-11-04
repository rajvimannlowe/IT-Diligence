/**
 * Assessment Questions Page
 * Multi-question assessment interface with progress sidebar
 * Optimized for 80+ questions with engaging animations
 */
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAssessment } from "../../context/AssessmentContext";
import { useUser } from "../../context/UserContext";
import { Button } from "../../components/ui";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Send,
  AlertCircle,
  Sparkles,
  Trophy,
  Star,
  Zap,
  Target,
  ArrowLeft,
} from "lucide-react";
import { cn } from "../../utils/cn";

// Success Modal Component
const SuccessModal = ({
  isOpen,
  onClose,
  onViewReport,
}: {
  isOpen: boolean;
  onClose: () => void;
  onViewReport: () => void;
}) => {
  const [confetti, setConfetti] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      color: string;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    if (isOpen) {
      // Generate confetti particles
      const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: [
          "#2BC6B4",
          "#1E3A5F",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
          "#10B981",
        ][Math.floor(Math.random() * 6)],
        delay: Math.random() * 0.5,
      }));
      setConfetti(particles);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-3 h-3 rounded-full"
            style={{
              backgroundColor: particle.color,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            initial={{ opacity: 0, y: -20, rotate: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [0, window.innerHeight + 20],
              rotate: 360,
              x: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: 3,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-lg rounded-3xl border border-gray-200 bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-brand-teal via-brand-navy to-brand-teal p-8 pb-12 relative overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2, duration: 0.5 }}
              className="mb-6 flex justify-center"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
                  <Trophy className="h-12 w-12 text-white" />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-white/20"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Assessment Complete! 🎉
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/90 text-lg"
            >
              Thank you for your thoughtful responses
            </motion.p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Sparkles className="h-5 w-5 text-brand-teal" />
                <span className="text-sm font-medium">
                  Your insights are being analyzed
                </span>
              </div>
              <p className="text-base text-gray-700 leading-relaxed">
                We've successfully received your assessment responses. Your
                organizational health profile is being generated based on your
                honest feedback.
              </p>
            </div>

            {/* Achievement Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { icon: Target, label: "Completed", color: "text-blue-600" },
                { icon: Star, label: "Thoughtful", color: "text-yellow-600" },
                { icon: Zap, label: "Valuable", color: "text-purple-600" },
              ].map((badge, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 border border-gray-200"
                >
                  <badge.icon className={cn("h-6 w-6", badge.color)} />
                  <span className="text-xs font-medium text-gray-700">
                    {badge.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 cursor-pointer"
              >
                Close
              </Button>
              <Button
                onClick={onViewReport}
                className="flex-1 cursor-pointer bg-gradient-to-r from-brand-teal to-brand-navy hover:from-brand-teal/90 hover:to-brand-navy/90"
              >
                <Trophy className="mr-2 h-4 w-4" />
                View Results
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AssessmentQuestions = () => {
  const navigate = useNavigate();
  const { progress, questions, answers, answerQuestion, submitAssessment } =
    useAssessment();

  const { user } = useUser();

  // Helper function to get user-specific page storage key
  const getPageStorageKey = useCallback(() => {
    if (!user) return "chaturvima_assessment_page_anonymous";
    const emailKey = user.email.toLowerCase().replace(/[^a-z0-9]/g, "_");
    return `chaturvima_assessment_page_${emailKey}`;
  }, [user]);

  // Show 1 question at a time for better focus
  const [questionsPerPage] = useState(1);
  // Load saved page from localStorage
  const loadSavedPage = useCallback(() => {
    try {
      const storageKey = getPageStorageKey();
      const savedPage = localStorage.getItem(storageKey);
      return savedPage ? parseInt(savedPage, 10) : 0;
    } catch {
      return 0;
    }
  }, [getPageStorageKey]);

  const [currentPage, setCurrentPage] = useState(loadSavedPage);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  // Ensure page position is restored on mount and when user changes
  useEffect(() => {
    try {
      const storageKey = getPageStorageKey();
      const savedPage = localStorage.getItem(storageKey);

      // Restore page position if saved
      if (savedPage) {
        const pageNum = parseInt(savedPage, 10);
        if (pageNum >= 0 && pageNum < totalPages && pageNum !== currentPage) {
          setCurrentPage(pageNum);
        }
      }
    } catch (error) {
      console.error("Error restoring saved page:", error);
    }
  }, [getPageStorageKey, totalPages, currentPage]);

  // Get questions for current page
  const currentPageQuestions = useMemo(() => {
    const start = currentPage * questionsPerPage;
    const end = start + questionsPerPage;
    return questions.slice(start, end);
  }, [questions, currentPage, questionsPerPage]);

  // Check if all questions on current page have the same options
  const sharedOptions = useMemo(() => {
    if (currentPageQuestions.length === 0) return null;

    const firstQuestionOptions = currentPageQuestions[0].options;
    const allSame = currentPageQuestions.every(
      (q) => JSON.stringify(q.options) === JSON.stringify(firstQuestionOptions)
    );

    return allSame ? firstQuestionOptions : null;
  }, [currentPageQuestions]);

  const allAnswered = Object.keys(answers).length === questions.length;
  const answeredCount = Object.keys(answers).length;

  const handleAnswerChange = (questionId: string, optionIndex: number) => {
    answerQuestion(questionId, optionIndex);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      // Auto-save current page
      try {
        const storageKey = getPageStorageKey();
        localStorage.setItem(storageKey, newPage.toString());
      } catch (error) {
        console.error("Error saving page to localStorage:", error);
      }
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      // Auto-save current page
      try {
        const storageKey = getPageStorageKey();
        localStorage.setItem(storageKey, newPage.toString());
      } catch (error) {
        console.error("Error saving page to localStorage:", error);
      }
    }
  };

  const handleSubmit = () => {
    if (allAnswered) {
      submitAssessment();
      setShowSuccessModal(true);
      // Clear saved state after submission
      try {
        const storageKey = getPageStorageKey();
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
    }
  };

  const handleViewReport = () => {
    setShowSuccessModal(false);
    navigate("/assessment-report");
  };

  // Auto-scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Smart pagination: show ellipsis for large question sets
  const getPaginationButtons = () => {
    if (totalPages <= 10) {
      return Array.from({ length: totalPages }).map((_, idx) => idx);
    }

    const buttons: (number | "ellipsis")[] = [];

    if (currentPage < 5) {
      for (let i = 0; i < 7; i++) buttons.push(i);
      buttons.push("ellipsis");
      buttons.push(totalPages - 1);
    } else if (currentPage > totalPages - 6) {
      buttons.push(0);
      buttons.push("ellipsis");
      for (let i = totalPages - 7; i < totalPages; i++) buttons.push(i);
    } else {
      buttons.push(0);
      buttons.push("ellipsis");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) buttons.push(i);
      buttons.push("ellipsis");
      buttons.push(totalPages - 1);
    }

    return buttons;
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20 blur-3xl"
            style={{
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              background: `radial-gradient(circle, ${
                ["#2BC6B4", "#1E3A5F", "#8B5CF6"][i]
              } 0%, transparent 70%)`,
              left: `${20 + i * 30}%`,
              top: `${10 + i * 25}%`,
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full h-full overflow-hidden">
        <div className="container mx-auto h-full px-4 py-4 sm:py-6 lg:py-8 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 h-full">
            {/* Main Questions Area */}
            <div className="lg:col-span-2 flex flex-col overflow-hidden min-w-0">
              {/* Fixed Header Section */}
              <div className="shrink-0 space-y-3 pb-4 mb-4">
                {/* Back Button */}
                <Button
                  variant="outline"
                  onClick={() => navigate("/assessment")}
                  className="cursor-pointer text-xs py-1.5 h-auto"
                  size="sm"
                >
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  Back to Assessment
                </Button>

                {/* Minimal Header */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Assessment Questions
                  </h1>
                </motion.div>
              </div>

              {/* Question Content Area - No Scroll, Only Question Changes */}
              <div className="flex-1 flex flex-col min-h-0 overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex flex-col justify-start py-2">
                  <AnimatePresence mode="wait">
                    {currentPageQuestions.map((question, idx) => {
                      const questionNumber =
                        currentPage * questionsPerPage + idx + 1;
                      const selectedAnswer = answers[question.id];

                      return (
                        <motion.div
                          key={`${question.id}-${currentPage}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="w-full"
                        >
                          {/* Question Card */}
                          <div className="w-full">
                            {/* Question Header */}
                            <div className="mb-4">
                              <div className="mb-2">
                                <span className="text-xs font-medium text-gray-500">
                                  Question {questionNumber} of{" "}
                                  {questions.length}
                                </span>
                              </div>
                              <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
                                {question.text}
                              </h3>
                              {question.description && (
                                <p className="text-sm text-gray-500 mt-1.5">
                                  {question.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Answer Options - Below question */}
                          {sharedOptions &&
                          sharedOptions.length === 5 &&
                          sharedOptions[0] === "Strongly Agree" &&
                          sharedOptions[4] === "Strongly Disagree" ? (
                            <div className="mt-4 w-full">
                              <div className="flex items-center justify-between gap-2">
                                {sharedOptions.map((option, optionIndex) => {
                                  const isSelected =
                                    selectedAnswer === optionIndex;

                                  return (
                                    <button
                                      key={optionIndex}
                                      type="button"
                                      onClick={() => {
                                        handleAnswerChange(
                                          question.id,
                                          optionIndex
                                        );
                                      }}
                                      className={cn(
                                        "flex-1 flex flex-col items-center gap-1.5 p-2.5 rounded-lg border-2 transition-all cursor-pointer bg-white",
                                        isSelected
                                          ? "border-brand-teal bg-brand-teal/10"
                                          : "border-gray-300 bg-white hover:border-brand-teal/50"
                                      )}
                                    >
                                      {/* Simple circle indicator */}
                                      <div
                                        className={cn(
                                          "w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                                          isSelected
                                            ? "border-brand-teal bg-brand-teal"
                                            : "border-gray-300"
                                        )}
                                      >
                                        {isSelected ? (
                                          <div className="w-2.5 h-2.5 rounded-full bg-white" />
                                        ) : (
                                          <span className="text-[10px] font-semibold text-gray-400">
                                            {optionIndex + 1}
                                          </span>
                                        )}
                                      </div>

                                      {/* Label */}
                                      <span
                                        className={cn(
                                          "text-[10px] font-medium text-center leading-tight",
                                          isSelected
                                            ? "text-brand-teal font-semibold"
                                            : "text-gray-600"
                                        )}
                                      >
                                        {option}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            /* Fallback to vertical list for custom options */
                            <div className="mt-4 w-full space-y-2">
                              {question.options.map((option, optionIndex) => {
                                const isSelected =
                                  selectedAnswer === optionIndex;
                                return (
                                  <button
                                    key={optionIndex}
                                    type="button"
                                    onClick={() =>
                                      handleAnswerChange(
                                        question.id,
                                        optionIndex
                                      )
                                    }
                                    className={cn(
                                      "w-full text-left p-3 rounded-lg border-2 transition-all cursor-pointer bg-white",
                                      isSelected
                                        ? "border-brand-teal bg-brand-teal/10"
                                        : "border-gray-300 bg-white hover:border-brand-teal/50"
                                    )}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={cn(
                                          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                                          isSelected
                                            ? "border-brand-teal bg-brand-teal"
                                            : "border-gray-300"
                                        )}
                                      >
                                        {isSelected && (
                                          <div className="w-2 h-2 rounded-full bg-white" />
                                        )}
                                      </div>
                                      <span
                                        className={cn(
                                          "text-sm font-medium",
                                          isSelected
                                            ? "text-gray-900"
                                            : "text-gray-700"
                                        )}
                                      >
                                        {option}
                                      </span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

              {/* Fixed Navigation */}
              <div className="shrink-0 flex flex-wrap items-center justify-between gap-2 sm:gap-4 pt-3 border-t border-gray-200 mt-4">
                <Button
                  variant="outline"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                  className="cursor-pointer text-xs py-1.5 h-auto"
                  size="sm"
                >
                  <ChevronLeft className="mr-1.5 h-3.5 w-3.5" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {getPaginationButtons().map((pageIdx, idx) => {
                    if (pageIdx === "ellipsis") {
                      return (
                        <motion.span
                          key={`ellipsis-${idx}`}
                          className="px-2 text-gray-400"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        >
                          ...
                        </motion.span>
                      );
                    }
                    const isCurrentPage = currentPage === pageIdx;
                    return (
                      <motion.button
                        key={pageIdx}
                        onClick={() => {
                          setCurrentPage(pageIdx);
                          // Auto-save current page
                          try {
                            const storageKey = getPageStorageKey();
                            localStorage.setItem(
                              storageKey,
                              pageIdx.toString()
                            );
                          } catch (error) {
                            console.error(
                              "Error saving page to localStorage:",
                              error
                            );
                          }
                        }}
                        whileHover={{
                          scale: 1.15,
                          y: -2,
                        }}
                        whileTap={{ scale: 0.9 }}
                        className={cn(
                          "w-10 h-10 rounded-lg font-medium transition-all cursor-pointer relative",
                          isCurrentPage
                            ? "bg-brand-teal text-white shadow-lg"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                        )}
                      >
                        {isCurrentPage && (
                          <motion.div
                            className="absolute inset-0 rounded-lg bg-brand-teal/30 blur-md"
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.5, 0, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                          />
                        )}
                        <span className="relative z-10">{pageIdx + 1}</span>
                      </motion.button>
                    );
                  })}
                </div>

                {currentPage === totalPages - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!allAnswered}
                    className={cn(
                      "cursor-pointer text-xs py-1.5 h-auto",
                      allAnswered
                        ? "bg-gradient-to-r from-brand-teal to-brand-navy"
                        : "bg-gray-300 cursor-not-allowed"
                    )}
                    size="sm"
                  >
                    {allAnswered ? (
                      <>
                        <Send className="mr-1.5 h-3.5 w-3.5" />
                        Submit Assessment
                      </>
                    ) : (
                      <>
                        <AlertCircle className="mr-1.5 h-3.5 w-3.5" />
                        Answer All Questions
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages - 1}
                    className="cursor-pointer text-xs py-1.5 h-auto"
                    size="sm"
                  >
                    Next
                    <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Progress Sidebar */}
            <div className="lg:col-span-1 min-w-0">
              <div className="sticky top-4 sm:top-6 space-y-3 sm:space-y-4 h-full lg:max-h-[calc(100vh-8rem)] overflow-y-auto overflow-x-hidden pr-1 sm:pr-2 custom-scrollbar">
                {/* Overall Progress Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="p-3 sm:p-4 rounded-lg border border-gray-200">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-teal" />
                      Your Progress
                    </h3>
                    <div className="space-y-2.5 sm:space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-xs sm:text-sm font-medium text-gray-700">
                            Overall Completion
                          </span>
                          <motion.span
                            className="text-3xl"
                            key={progress.percentComplete}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", duration: 0.5 }}
                          >
                            {progress.percentComplete === 0
                              ? "😴"
                              : progress.percentComplete < 20
                              ? "😕"
                              : progress.percentComplete < 40
                              ? "😐"
                              : progress.percentComplete < 60
                              ? "🙂"
                              : progress.percentComplete < 80
                              ? "😊"
                              : progress.percentComplete < 100
                              ? "🤩"
                              : "🎉"}
                          </motion.span>
                        </div>
                        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                          <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-teal to-brand-navy rounded-full"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${progress.percentComplete}%`,
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {progress.percentComplete === 0
                              ? "Just starting..."
                              : progress.percentComplete < 20
                              ? "Getting there..."
                              : progress.percentComplete < 40
                              ? "Making progress..."
                              : progress.percentComplete < 60
                              ? "Great job!"
                              : progress.percentComplete < 80
                              ? "Almost done!"
                              : progress.percentComplete < 100
                              ? "So close!"
                              : "Perfect!"}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-brand-teal">
                            {answeredCount} / {questions.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Navigation - Limited visible area, scrollable for all questions */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="p-3 sm:p-4 rounded-lg border border-gray-200">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2.5 sm:mb-3">
                      Quick Navigation
                    </h3>
                    {/* Show approximately 20 questions visible, then scroll for more */}
                    <div className="max-h-[240px] sm:max-h-[280px] overflow-y-auto overflow-x-hidden pr-1 sm:pr-2 custom-scrollbar">
                      <div className="grid grid-cols-5 gap-2">
                        {questions.map((question, idx) => {
                          const isAnswered = answers[question.id] !== undefined;
                          const isCurrent =
                            idx >= currentPage * questionsPerPage &&
                            idx < (currentPage + 1) * questionsPerPage;

                          return (
                            <motion.button
                              key={question.id}
                              onClick={() => {
                                const targetPage = Math.floor(
                                  idx / questionsPerPage
                                );
                                setCurrentPage(targetPage);
                                // Auto-save current page
                                try {
                                  const storageKey = getPageStorageKey();
                                  localStorage.setItem(
                                    storageKey,
                                    targetPage.toString()
                                  );
                                } catch (error) {
                                  console.error(
                                    "Error saving page to localStorage:",
                                    error
                                  );
                                }
                              }}
                              whileTap={{ scale: 0.9 }}
                              className={cn(
                                "w-full aspect-square rounded-lg border-2 transition-all cursor-pointer flex items-center justify-center text-[10px] sm:text-xs font-medium",
                                isAnswered
                                  ? "border-green-300 text-green-700"
                                  : isCurrent
                                  ? "border-brand-teal text-brand-teal bg-brand-teal/5"
                                  : "border-gray-200 text-gray-500"
                              )}
                              title={`Question ${
                                idx + 1
                              }: ${question.text.slice(0, 30)}...`}
                            >
                              {isAnswered ? (
                                <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                              ) : (
                                <span>{idx + 1}</span>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Completion Status */}
                {allAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg p-3 border border-green-200"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          repeatDelay: 2,
                        }}
                        className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0"
                      >
                        <Check className="h-6 w-6 text-white" />
                      </motion.div>
                      <div>
                        <p className="font-semibold text-green-900">
                          All Questions Answered!
                        </p>
                        <p className="text-xs text-green-600">
                          Ready to submit your assessment
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onViewReport={handleViewReport}
      />
    </div>
  );
};

export default AssessmentQuestions;
