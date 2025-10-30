/**
 * Assessment Page
 * Complete assessment flow with gamification
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAssessment } from "../context/AssessmentContext";
import { Button, Card, CardContent } from "../components/ui";
import QuestionCard from "../components/assessment/QuestionCard";
import AssessmentProgress from "../components/assessment/AssessmentProgress";
import EnergyBreak from "../components/assessment/EnergyBreak";
import AssessmentResults from "../components/assessment/AssessmentResults";
import CelebrationConfetti from "../components/assessment/CelebrationConfetti";
import { PlayCircle } from "lucide-react";

const Assessment = () => {
  const {
    progress,
    currentQuestion,
    isComplete,
    result,
    startAssessment,
    answerQuestion,
    goToPreviousQuestion,
    resetAssessment,
  } = useAssessment();

  const [showEnergyBreak, setShowEnergyBreak] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Check if we should show energy break (every 5 questions, but not at the end)
  useEffect(() => {
    if (
      progress.currentQuestionIndex > 0 &&
      progress.currentQuestionIndex % 5 === 0 &&
      progress.currentQuestionIndex < progress.totalQuestions
    ) {
      setShowEnergyBreak(true);
    }
  }, [progress.currentQuestionIndex, progress.totalQuestions]);

  // Trigger confetti at milestones
  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    if (milestones.includes(progress.percentComplete)) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 100); // Reset for next milestone
    }
  }, [progress.percentComplete]);

  const handleStart = () => {
    startAssessment();
    setHasStarted(true);
  };

  const handleContinueFromBreak = () => {
    setShowEnergyBreak(false);
  };

  const handleRetake = () => {
    resetAssessment();
    setHasStarted(false);
    setShowEnergyBreak(false);
  };

  // Not started state
  if (!hasStarted && !isComplete) {
    return (
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="elevated" className="text-center">
            <CardContent className="py-12">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-teal to-brand-navy flex items-center justify-center">
                  <PlayCircle className="w-16 h-16 text-white" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Employee Assessment
              </h1>

              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                This assessment will help us understand your current
                organizational stage across the ChaturVima framework. It takes
                about 10-15 minutes to complete.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600 mb-1">
                    {progress.totalQuestions}
                  </p>
                  <p className="text-sm text-gray-600">Questions</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600 mb-1">
                    ~12min
                  </p>
                  <p className="text-sm text-gray-600">Duration</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600 mb-1">
                    4 Stages
                  </p>
                  <p className="text-sm text-gray-600">Evaluated</p>
                </div>
              </div>

              <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-left max-w-2xl mx-auto">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Before you begin:
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>
                    ✓ Answer honestly - there are no right or wrong answers
                  </li>
                  <li>
                    ✓ Take your time - we'll show energy breaks every 5
                    questions
                  </li>
                  <li>✓ You can go back to previous questions if needed</li>
                  <li>
                    ✓ Your responses are confidential and used only for
                    organizational insights
                  </li>
                </ul>
              </div>

              <Button
                onClick={handleStart}
                size="lg"
                variant="primary"
                className="px-12"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Assessment complete state
  if (isComplete && result) {
    return <AssessmentResults result={result} onRetake={handleRetake} />;
  }

  // Assessment in progress
  return (
    <div className="space-y-6">
      <CelebrationConfetti trigger={showConfetti} />

      {/* Progress Bar */}
      <AssessmentProgress
        current={progress.currentQuestionIndex}
        total={progress.totalQuestions}
        percentage={progress.percentComplete}
      />

      {/* Question or Energy Break */}
      <AnimatePresence mode="wait">
        {showEnergyBreak ? (
          <EnergyBreak
            key="energy-break"
            questionNumber={progress.currentQuestionIndex}
            onContinue={handleContinueFromBreak}
          />
        ) : currentQuestion ? (
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            questionNumber={progress.currentQuestionIndex + 1}
            totalQuestions={progress.totalQuestions}
            onAnswer={answerQuestion}
            onPrevious={goToPreviousQuestion}
            canGoPrevious={progress.currentQuestionIndex > 0}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Assessment;
