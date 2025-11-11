import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Inbox, RotateCcw } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Progress,
  Textarea,
} from "@/components/ui";
import {
  DUE_DILIGENCE_CATEGORIES,
  type DueDiligenceCategory,
  type DueDiligenceQuestion,
} from "@/data/dueDiligenceCategories";
import { useDueDiligence } from "@/context/DueDiligenceContext";
import { cn } from "@/utils/cn";

const findCategory = (categoryId?: string): DueDiligenceCategory | undefined =>
  DUE_DILIGENCE_CATEGORIES.find((entry) => entry.id === categoryId);

const AssessmentCategory = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const category = useMemo(() => findCategory(categoryId), [categoryId]);

  const { responses, updateResponse, resetCategory, isLocked } =
    useDueDiligence();

  const categoryResponses = useMemo(() => {
    if (!category) return {} as Record<string, string>;
    return responses[category.id] ?? {};
  }, [category, responses]);

  const sectionProgress = useMemo(() => {
    if (!category)
      return [] as { id: string; answered: number; total: number }[];

    return category.sections.map((section) => {
      const answered = section.questions.filter(
        (question) => (categoryResponses[question.id] ?? "").trim() !== ""
      ).length;
      return {
        id: section.id,
        answered,
        total: section.questions.length,
      };
    });
  }, [category, categoryResponses]);

  const [activeSectionId, setActiveSectionId] = useState<string>("");

  useEffect(() => {
    if (sectionProgress.length > 0) {
      setActiveSectionId(sectionProgress[0].id);
    }
  }, [sectionProgress]);

  if (!category) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">
              Category not found
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              The requested assessment category is unavailable. Please select a
              category from the overview.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate("/assessment", { replace: true })}
              className="cursor-pointer"
            >
              Back to assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeSection =
    category.sections.find((section) => section.id === activeSectionId) ??
    category.sections[0];

  const totalQuestions = sectionProgress.reduce(
    (count, entry) => count + entry.total,
    0
  );
  const answeredQuestions = sectionProgress.reduce(
    (count, entry) => count + entry.answered,
    0
  );
  const completionPercent = totalQuestions
    ? Math.round((answeredQuestions / totalQuestions) * 100)
    : 0;

  const handleResponseChange = (
    question: DueDiligenceQuestion,
    value: string
  ) => {
    updateResponse(category.id, question.id, value);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer shadow-sm hover:shadow"
            onClick={() => navigate("/assessment")}
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Assessment overview
          </Button>
          <div className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700">
            {category.label}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => resetCategory(category.id)}
          disabled={isLocked}
          className="inline-flex cursor-pointer items-center gap-1.5 text-xs shadow-sm hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear responses
        </Button>
      </div>

      <Card className="m-0 border-none bg-transparent shadow-none p-0 mb-10">
        <CardContent className="p-0">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br from-slate-900 via-indigo-900 to-indigo-600 text-white shadow-[0_28px_50px_-25px_rgba(15,23,42,0.35)]">
            <div className="pointer-events-none absolute inset-x-10 bottom-[-80px] h-64 rounded-full bg-indigo-400/20 blur-[120px]" />
            <div className="relative space-y-5 p-5 md:p-7">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-200">
                Due diligence category
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold leading-tight md:text-[32px]">
                  {category.title}
                </h1>
                {category.description ? (
                  <p className="text-sm text-slate-100/80">
                    {category.description}
                  </p>
                ) : (
                  <p className="text-sm text-slate-100/80">
                    Complete each prompt to finish this category.
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-100/80">
                  <span>
                    {answeredQuestions} / {totalQuestions} responses
                  </span>
                  <span>{totalQuestions - answeredQuestions} remaining</span>
                </div>
                <Progress
                  value={completionPercent}
                  className="mt-1 h-2"
                  trackClassName="bg-white/20"
                  indicatorClassName="bg-linear-to-r from-indigo-300 via-indigo-400 to-indigo-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="flex items-center gap-2 overflow-x-auto p-0">
            {category.sections.map((section) => {
              const progress = sectionProgress.find(
                (entry) => entry.id === section.id
              );
              const isActive = section.id === activeSection?.id;
              const isComplete =
                (progress?.answered ?? 0) === (progress?.total ?? 0) &&
                (progress?.total ?? 0) > 0;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSectionId(section.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
                    isActive
                      ? "border-brand-teal bg-brand-teal text-white shadow-sm"
                      : "border-transparent bg-gray-100 text-gray-700 hover:border-brand-teal/60 hover:bg-white"
                  )}
                >
                  {section.title}
                  {progress ? (
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-bold",
                        isComplete
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      )}
                    >
                      {progress.answered}/{progress.total}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </CardContent>
        </Card>

        {activeSection ? (
          <section key={activeSection.id} className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand-teal" />
              <h2 className="text-lg font-semibold text-gray-900">
                {activeSection.title}
              </h2>
            </div>

            <div className="space-y-4">
              {activeSection.questions.map((question, index) => {
                const responseValue = categoryResponses?.[question.id] ?? "";
                const isAnswered = responseValue.trim().length > 0;
                return (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      variant="elevated"
                      className={cn(
                        "border transition-all duration-200 hover:shadow-lg",
                        isAnswered
                          ? "border-green-200 bg-green-50/40"
                          : "border-gray-200"
                      )}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>Question</span>
                              <span className="inline-flex items-center rounded-full bg-brand-teal/10 px-2 py-0.5 font-semibold text-brand-teal">
                                {index + 1}
                              </span>
                            </div>
                            <CardTitle className="text-base text-gray-900">
                              {question.prompt}
                            </CardTitle>
                          </div>
                          {isAnswered ? (
                            <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                              <Inbox className="h-3.5 w-3.5" />
                              Saved
                            </div>
                          ) : null}
                        </div>
                        {question.artifacts && question.artifacts.length > 0 ? (
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Supporting artifacts
                            </span>
                            {question.artifacts.map((artifact) => (
                              <span
                                key={artifact}
                                className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600"
                              >
                                {artifact}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Textarea
                          value={responseValue}
                          onChange={(event) =>
                            handleResponseChange(question, event.target.value)
                          }
                          placeholder="Capture your response here..."
                          description="Changes are saved automatically."
                          disabled={isLocked}
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
};

export default AssessmentCategory;
