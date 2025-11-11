import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
} from "@/components/ui";
import { useDueDiligence } from "@/context/DueDiligenceContext";
import {
  DUE_DILIGENCE_CATEGORIES,
  type DueDiligenceCategory,
} from "@/data/dueDiligenceCategories";
import { cn } from "@/utils/cn";

const Assessment = () => {
  const { getCategoryProgress } = useDueDiligence();

  const overallStats = useMemo(() => {
    let totalQuestions = 0;
    let answeredQuestions = 0;
    let completedCategories = 0;

    DUE_DILIGENCE_CATEGORIES.forEach((category) => {
      const progress = getCategoryProgress(category);
      totalQuestions += progress.total;
      answeredQuestions += progress.answered;

      if (progress.total > 0 && progress.answered === progress.total) {
        completedCategories += 1;
      }
    });

    const percent = totalQuestions
      ? Math.round((answeredQuestions / totalQuestions) * 100)
      : 0;

    return {
      totalQuestions,
      answeredQuestions,
      completedCategories,
      totalCategories: DUE_DILIGENCE_CATEGORIES.length,
      percent,
    };
  }, [getCategoryProgress]);

  const renderCategoryCard = (
    category: DueDiligenceCategory,
    index: number
  ) => {
    const progress = getCategoryProgress(category);
    const isComplete =
      progress.answered === progress.total && progress.total > 0;

    return (
      <motion.div
        key={category.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card
          variant="elevated"
          className={cn(
            "group relative h-full overflow-hidden border bg-white/80 backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:shadow-xl",
            isComplete
              ? "border-green-200 shadow-green-100"
              : "border-gray-200/70"
          )}
        >
          <span
            className={cn(
              "absolute inset-x-0 top-0 h-1",
              isComplete
                ? "bg-linear-to-r from-emerald-400 via-emerald-500 to-emerald-400"
                : "bg-linear-to-r from-brand-teal via-brand-cyan to-brand-indigo"
            )}
          />
          <CardHeader className="space-y-3 pb-0 pt-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-teal">
                  <ClipboardList className="h-3.5 w-3.5" />
                  {category.label}
                </div>
                <CardTitle className="text-lg leading-snug text-gray-900">
                  {category.title}
                </CardTitle>
                {category.description ? (
                  <p className="text-xs text-gray-600">
                    {category.description}
                  </p>
                ) : null}
              </div>
              {isComplete ? (
                <div className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700 shadow-sm">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Complete
                </div>
              ) : (
                <div className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                  {progress.answered}/{progress.total}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{category.sections.length} sections</span>
              <span aria-hidden="true">•</span>
              <span>{progress.total} questions</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{progress.answered} responses</span>
                <span className="font-semibold text-gray-700">
                  {progress.percent}%
                </span>
              </div>
              <Progress
                value={progress.percent}
                trackClassName="bg-gray-200/80"
                indicatorClassName={cn(
                  "bg-linear-to-r from-brand-teal via-brand-cyan to-brand-indigo",
                  isComplete &&
                    "from-emerald-400 via-emerald-500 to-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.6)]"
                )}
              />
            </div>
            <Link
              to={`/assessment/${category.id}`}
              className="group inline-flex w-full items-center justify-between rounded-lg border border-brand-teal/60 bg-white px-3 py-2 text-sm font-semibold text-brand-teal transition-all hover:bg-brand-teal hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
            >
              <span>Open category</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-5">
      <Card className="m-0 border-none bg-transparent shadow-none p-0 mb-10">
        <CardContent className="p-0">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br from-slate-900 via-indigo-900 to-indigo-600 text-white shadow-[0_28px_50px_-25px_rgba(15,23,42,0.35)]">
            <div className="pointer-events-none absolute inset-x-10 bottom-[-80px] h-64 rounded-full bg-indigo-400/20 blur-[120px]" />
            <div className="relative grid gap-6 p-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:p-7">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-200">
                  <ClipboardList className="h-3.5 w-3.5" />
                  Employee assessment workspace
                </div>
                <h1 className="text-3xl font-semibold leading-tight md:text-[32px]">
                  Due Diligence Assessment
                </h1>
                <p className="max-w-xl text-sm text-slate-100/80">
                  Quickly review what’s complete and what still needs your
                  input.
                </p>
                <Progress
                  value={overallStats.percent}
                  className="mt-4 h-2"
                  trackClassName="bg-white/20"
                  indicatorClassName="bg-linear-to-r from-indigo-300 via-indigo-400 to-indigo-500"
                />
              </div>
              <div className="grid gap-2 text-sm text-slate-100/80">
                <div className="rounded-xl bg-white/10 p-3.5 shadow-[0_10px_35px_-20px_rgba(15,23,42,0.4)] backdrop-blur">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-100/70">
                    Snapshot
                  </div>
                  <div className="mt-2 space-y-1.5 text-sm">
                    <div>
                      {overallStats.answeredQuestions} responses captured
                    </div>
                    <div>
                      {overallStats.totalCategories -
                        overallStats.completedCategories}{" "}
                      categories remaining
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {DUE_DILIGENCE_CATEGORIES.map(renderCategoryCard)}
      </section>
    </div>
  );
};

export default Assessment;
