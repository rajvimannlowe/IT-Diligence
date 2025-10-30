import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui";
import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import { STAGES } from "../../data/stages";
import { MOCK_STAGE_TRANSITIONS } from "../../data/mockTargets";
import type { StageType } from "../../types";

export const StageTransitionMatrix = () => {
  const stages: StageType[] = [
    "honeymoon",
    "self-reflection",
    "soul-searching",
    "steady-state",
  ];

  // Group transitions by source stage
  const getTransitionsFrom = (stage: StageType) => {
    return MOCK_STAGE_TRANSITIONS.filter((t) => t.from === stage);
  };

  // Get transition color intensity based on percentage
  const getTransitionOpacity = (percentage: number): string => {
    if (percentage >= 30) return "100";
    if (percentage >= 20) return "75";
    if (percentage >= 10) return "50";
    return "25";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Stage Transition Flow</CardTitle>
          <CardDescription>
            How employees move between stages over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Visual Flow */}
          <div className="space-y-6">
            {stages.map((sourceStage, sourceIndex) => {
              const stageInfo = STAGES[sourceStage];
              const transitions = getTransitionsFrom(sourceStage);

              return (
                <motion.div
                  key={sourceStage}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + sourceIndex * 0.1 }}
                  className="relative"
                >
                  {/* Source Stage */}
                  <div className="flex items-start space-x-4">
                    <div
                      className="flex w-48 shrink-0 items-center space-x-3 rounded-lg border-2 p-3 transition-all hover:shadow-md"
                      style={{
                        borderColor: stageInfo.color.main,
                        backgroundColor: `${stageInfo.color.main}10`,
                      }}
                    >
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold"
                        style={{
                          backgroundColor: stageInfo.color.main,
                          color: "white",
                        }}
                      >
                        {stageInfo.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {stageInfo.name}
                        </p>
                        <p className="text-xs text-gray-600">From here</p>
                      </div>
                    </div>

                    {/* Transitions */}
                    <div className="flex-1 space-y-2">
                      {transitions.map((transition, transIndex) => {
                        const targetStage = STAGES[transition.to];
                        const opacity = getTransitionOpacity(
                          transition.percentage
                        );

                        return (
                          <motion.div
                            key={`${transition.from}-${transition.to}`}
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{
                              delay:
                                0.5 + sourceIndex * 0.1 + transIndex * 0.05,
                              duration: 0.4,
                            }}
                            whileHover={{ scale: 1.02 }}
                            className="group relative flex items-center rounded-lg border border-gray-200 p-3 transition-all hover:border-gray-300 hover:shadow-sm"
                            style={{
                              background: `linear-gradient(to right, ${stageInfo.color.main}${opacity}, ${targetStage.color.main}${opacity})`,
                            }}
                          >
                            {/* Arrow */}
                            <ArrowRight className="mr-3 h-5 w-5 text-gray-600 transition-transform group-hover:translate-x-1" />

                            {/* Target Stage */}
                            <div className="flex flex-1 items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">
                                  {targetStage.icon}
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                  {targetStage.name}
                                </span>
                              </div>

                              {/* Stats */}
                              <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center space-x-1 text-gray-600">
                                  <Users className="h-4 w-4" />
                                  <span className="font-semibold">
                                    {transition.value}
                                  </span>
                                </div>
                                <div className="rounded-full bg-white/90 px-3 py-1 font-bold text-gray-900 shadow-sm">
                                  {transition.percentage}%
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4"
          >
            <h4 className="mb-2 text-sm font-semibold text-gray-900">
              Understanding Transition Flow
            </h4>
            <div className="grid gap-2 text-xs text-gray-600 md:grid-cols-2">
              <div className="flex items-start space-x-2">
                <div className="mt-0.5 h-4 w-4 shrink-0 rounded bg-gradient-to-r from-purple-500/75 to-teal-500/75" />
                <p>
                  <span className="font-medium">High-intensity color</span>{" "}
                  indicates strong transition flow (30%+)
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="mt-0.5 h-4 w-4 shrink-0 rounded bg-gradient-to-r from-purple-500/25 to-teal-500/25" />
                <p>
                  <span className="font-medium">Low-intensity color</span>{" "}
                  indicates weak transition flow (&lt;10%)
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
                <p>
                  <span className="font-medium">Employee count</span> shows
                  number of people making this transition
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="mt-0.5 flex h-4 w-8 shrink-0 items-center justify-center rounded bg-white text-xs font-bold text-gray-900">
                  %
                </div>
                <p>
                  <span className="font-medium">Percentage</span> relative to
                  total transitions from source stage
                </p>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
