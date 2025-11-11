import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useUser } from "./UserContext";
import {
  DUE_DILIGENCE_CATEGORIES,
  type DueDiligenceCategory,
} from "@/data/dueDiligenceCategories";

type CategoryResponses = Record<string, string>;
type ResponsesState = Record<string, CategoryResponses>;

interface DueDiligenceContextValue {
  responses: ResponsesState;
  updateResponse: (
    categoryId: string,
    questionId: string,
    value: string
  ) => void;
  lastSavedAt: Date | null;
  isLocked: boolean;
  lockAssessment: () => void;
  getCategoryProgress: (category: DueDiligenceCategory) => {
    total: number;
    answered: number;
    percent: number;
  };
}

const DueDiligenceContext = createContext<DueDiligenceContextValue | undefined>(
  undefined
);

const STORAGE_PREFIX = "itdd_employee_responses_";
const LOCK_STORAGE_PREFIX = "itdd_employee_submitted_";

const buildInitialState = (): ResponsesState => {
  return DUE_DILIGENCE_CATEGORIES.reduce<ResponsesState>((acc, category) => {
    const sectionResponses = category.sections.reduce<CategoryResponses>(
      (sectionAcc, section) => {
        section.questions.forEach((question) => {
          sectionAcc[question.id] = "";
        });
        return sectionAcc;
      },
      {}
    );

    acc[category.id] = sectionResponses;
    return acc;
  }, {});
};

export const DueDiligenceProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();

  const storageKey = useMemo(() => {
    const emailKey = user?.email
      ? user.email.toLowerCase().replace(/[^a-z0-9]/g, "_")
      : "anonymous";
    return `${STORAGE_PREFIX}${emailKey}`;
  }, [user?.email]);

  const lockStorageKey = useMemo(() => {
    const emailKey = user?.email
      ? user.email.toLowerCase().replace(/[^a-z0-9]/g, "_")
      : "anonymous";
    return `${LOCK_STORAGE_PREFIX}${emailKey}`;
  }, [user?.email]);

  const [responses, setResponses] = useState<ResponsesState>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored) as ResponsesState;
      }
    } catch (error) {
      console.error("Failed to parse stored responses", error);
    }
    return buildInitialState();
  });

  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(lockStorageKey);
      return stored === "true";
    } catch (error) {
      return false;
    }
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setResponses(JSON.parse(stored) as ResponsesState);
      } else {
        setResponses(buildInitialState());
      }
    } catch (error) {
      console.error("Unable to hydrate responses from storage", error);
      setResponses(buildInitialState());
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(lockStorageKey);
      setIsLocked(stored === "true");
    } catch (error) {
      console.error("Unable to hydrate submission lock from storage", error);
      setIsLocked(false);
    }
  }, [lockStorageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(responses));
      setLastSavedAt(new Date());
    } catch (error) {
      console.error("Unable to persist due diligence responses", error);
    }
  }, [responses, storageKey]);

  const updateResponse = useCallback(
    (categoryId: string, questionId: string, value: string) => {
      if (isLocked) return;
      setResponses((prev) => ({
        ...prev,
        [categoryId]: {
          ...(prev[categoryId] ?? {}),
          [questionId]: value,
        },
      }));
    },
    [isLocked]
  );

  const lockAssessment = useCallback(() => {
    setIsLocked(true);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(lockStorageKey, String(isLocked));
    } catch (error) {
      console.error("Unable to persist submission lock", error);
    }
  }, [isLocked, lockStorageKey]);

  const getCategoryProgress = useCallback(
    (category: DueDiligenceCategory) => {
      const categoryResponses = responses[category.id] ?? {};
      const total = category.sections.reduce(
        (count, section) => count + section.questions.length,
        0
      );
      const answered = category.sections.reduce((count, section) => {
        return (
          count +
          section.questions.filter(
            (question) => (categoryResponses[question.id] ?? "").trim() !== ""
          ).length
        );
      }, 0);

      return {
        total,
        answered,
        percent: total ? Math.round((answered / total) * 100) : 0,
      };
    },
    [responses]
  );

  const value: DueDiligenceContextValue = {
    responses,
    updateResponse,
    lastSavedAt,
    isLocked,
    lockAssessment,
    getCategoryProgress,
  };

  return (
    <DueDiligenceContext.Provider value={value}>
      {children}
    </DueDiligenceContext.Provider>
  );
};

export const useDueDiligence = () => {
  const context = useContext(DueDiligenceContext);
  if (!context) {
    throw new Error(
      "useDueDiligence must be used within a DueDiligenceProvider"
    );
  }
  return context;
};
