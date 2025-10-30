/**
 * Assessment Context
 * Manages assessment state, progress, and answers
 */
import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type {
  Answer,
  AssessmentProgress,
  AssessmentResult,
  StageDistribution,
  StageType,
} from "../types";
import { MOCK_QUESTIONS } from "../data/mockQuestions";
import { useUser } from "./UserContext";

interface AssessmentContextType {
  progress: AssessmentProgress;
  currentQuestion: (typeof MOCK_QUESTIONS)[0] | null;
  isComplete: boolean;
  result: AssessmentResult | null;
  startAssessment: () => void;
  answerQuestion: (optionIndex: number) => void;
  goToPreviousQuestion: () => void;
  resetAssessment: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(
  undefined
);

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used within an AssessmentProvider");
  }
  return context;
};

interface AssessmentProviderProps {
  children: ReactNode;
}

export const AssessmentProvider = ({ children }: AssessmentProviderProps) => {
  const { user } = useUser();
  const [progress, setProgress] = useState<AssessmentProgress>({
    currentQuestionIndex: 0,
    totalQuestions: MOCK_QUESTIONS.length,
    answers: [],
    percentComplete: 0,
    timeStarted: new Date(),
    timeElapsed: 0,
  });
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const currentQuestion =
    progress.currentQuestionIndex < MOCK_QUESTIONS.length
      ? MOCK_QUESTIONS[progress.currentQuestionIndex]
      : null;

  const calculateStageDistribution = useCallback(
    (answers: Answer[]): StageDistribution => {
      // Initialize stage scores
      const stageScores: Record<StageType, number> = {
        honeymoon: 0,
        "self-reflection": 0,
        "soul-searching": 0,
        "steady-state": 0,
      };

      // Calculate weighted scores for each stage
      answers.forEach((answer) => {
        const question = MOCK_QUESTIONS.find((q) => q.id === answer.questionId);
        if (!question) return;

        const stage = question.stage;
        const weight = question.weight;

        // Likert scale: 0-4 (Strongly Disagree to Strongly Agree)
        // Convert to 0-1 score and multiply by weight
        const score = (answer.selectedOption / 4) * weight;
        stageScores[stage] += score;
      });

      // Calculate total score
      const totalScore = Object.values(stageScores).reduce(
        (sum, score) => sum + score,
        0
      );

      // Convert to percentages (0-100)
      const distribution: StageDistribution = {
        honeymoon:
          totalScore > 0
            ? Math.round((stageScores.honeymoon / totalScore) * 100)
            : 0,
        "self-reflection":
          totalScore > 0
            ? Math.round((stageScores["self-reflection"] / totalScore) * 100)
            : 0,
        "soul-searching":
          totalScore > 0
            ? Math.round((stageScores["soul-searching"] / totalScore) * 100)
            : 0,
        "steady-state":
          totalScore > 0
            ? Math.round((stageScores["steady-state"] / totalScore) * 100)
            : 0,
      };

      // Ensure percentages add up to 100 (adjust for rounding)
      const sum =
        distribution.honeymoon +
        distribution["self-reflection"] +
        distribution["soul-searching"] +
        distribution["steady-state"];

      if (sum !== 100 && sum > 0) {
        // Add difference to the largest value
        const maxStage = Object.entries(distribution).reduce((a, b) =>
          a[1] > b[1] ? a : b
        )[0] as StageType;
        distribution[maxStage] += 100 - sum;
      }

      return distribution;
    },
    []
  );

  const getDominantStage = (distribution: StageDistribution): StageType => {
    return Object.entries(distribution).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0] as StageType;
  };

  const startAssessment = useCallback(() => {
    setProgress({
      currentQuestionIndex: 0,
      totalQuestions: MOCK_QUESTIONS.length,
      answers: [],
      percentComplete: 0,
      timeStarted: new Date(),
      timeElapsed: 0,
    });
    setIsComplete(false);
    setResult(null);
  }, []);

  const answerQuestion = useCallback(
    (optionIndex: number) => {
      if (!currentQuestion) return;

      const answer: Answer = {
        questionId: currentQuestion.id,
        selectedOption: optionIndex,
        timestamp: new Date(),
      };

      setProgress((prev) => {
        const newAnswers = [...prev.answers, answer];
        const newIndex = prev.currentQuestionIndex + 1;
        const percentComplete = Math.round(
          (newIndex / prev.totalQuestions) * 100
        );
        const timeElapsed = Math.floor(
          (new Date().getTime() - prev.timeStarted.getTime()) / 1000
        );

        // Check if assessment is complete
        if (newIndex >= prev.totalQuestions) {
          const distribution = calculateStageDistribution(newAnswers);
          const dominantStage = getDominantStage(distribution);

          setIsComplete(true);
          setResult({
            userId: user?.id || "unknown",
            level: "employee",
            stageDistribution: distribution,
            dominantStage,
            completedAt: new Date(),
            score: Math.round(
              Object.values(distribution).reduce((sum, val) => sum + val, 0) / 4
            ),
          });
        }

        return {
          ...prev,
          currentQuestionIndex: newIndex,
          answers: newAnswers,
          percentComplete,
          timeElapsed,
        };
      });
    },
    [currentQuestion, user, calculateStageDistribution]
  );

  const goToPreviousQuestion = useCallback(() => {
    setProgress((prev) => {
      if (prev.currentQuestionIndex === 0) return prev;

      const newIndex = prev.currentQuestionIndex - 1;
      const newAnswers = prev.answers.slice(0, -1); // Remove last answer
      const percentComplete = Math.round(
        (newIndex / prev.totalQuestions) * 100
      );

      return {
        ...prev,
        currentQuestionIndex: newIndex,
        answers: newAnswers,
        percentComplete,
      };
    });
  }, []);

  const resetAssessment = useCallback(() => {
    setProgress({
      currentQuestionIndex: 0,
      totalQuestions: MOCK_QUESTIONS.length,
      answers: [],
      percentComplete: 0,
      timeStarted: new Date(),
      timeElapsed: 0,
    });
    setIsComplete(false);
    setResult(null);
  }, []);

  const value: AssessmentContextType = {
    progress,
    currentQuestion,
    isComplete,
    result,
    startAssessment,
    answerQuestion,
    goToPreviousQuestion,
    resetAssessment,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
};
