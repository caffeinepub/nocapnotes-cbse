import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { BookOpen, ChevronRight, FileCheck } from "lucide-react";
import { motion } from "motion/react";
import { useAllExamPapers, useAllSubjects } from "../hooks/useQueries";

const SKELETON_KEYS = ["a", "b", "c"];
const INNER_SKELETON_KEYS = ["a", "b", "c"];

export default function SamplePapersPage() {
  const { data: papers, isLoading } = useAllExamPapers();
  const { data: subjects } = useAllSubjects();

  const subjectMap = new Map((subjects ?? []).map((s) => [s.id.toString(), s]));
  const grouped = (papers ?? []).reduce<Record<string, typeof papers>>(
    (acc, paper) => {
      const key = paper.subjectId.toString();
      if (!acc[key]) acc[key] = [];
      acc[key]!.push(paper);
      return acc;
    },
    {},
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground font-medium">Sample Papers</span>
      </nav>
      <h1 className="text-3xl font-extrabold text-foreground mb-2">
        Sample Papers
      </h1>
      <p className="text-muted-foreground mb-8">
        Previous year exam papers for Class 8 — practice and prepare.
      </p>

      {isLoading ? (
        <div className="space-y-6" data-ocid="papers.loading_state">
          {SKELETON_KEYS.map((k) => (
            <div key={k}>
              <Skeleton className="h-6 w-40 mb-3" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INNER_SKELETON_KEYS.map((j) => (
                  <Skeleton key={j} className="h-20 rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : papers && papers.length > 0 ? (
        <motion.div
          className="space-y-8"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {Object.entries(grouped).map(([subjectIdKey, subjectPapers], gi) => {
            const subject = subjectMap.get(subjectIdKey);
            const color = subject?.color ?? "#2D6CDF";
            return (
              <motion.div
                key={subjectIdKey}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
                data-ocid={`papers.group.${gi + 1}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: color }}
                  >
                    <BookOpen className="w-4 h-4 text-white" />
                  </span>
                  <h2 className="text-xl font-bold text-foreground">
                    {subject?.name ?? `Subject ${subjectIdKey}`}
                  </h2>
                  <Badge variant="secondary" className="ml-auto">
                    {subjectPapers?.length} papers
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {subjectPapers?.map((paper, i) => (
                    <div
                      key={paper.id.toString()}
                      className="bg-white rounded-xl border border-border shadow-card p-4 flex items-start gap-3"
                      data-ocid={`papers.item.${i + 1}`}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        <FileCheck className="w-5 h-5" style={{ color }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-sm">
                          {paper.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {paper.description}
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          Year: {paper.year.toString()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="papers.empty_state"
        >
          <FileCheck className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg">No exam papers available yet.</p>
          <p className="text-sm mt-1">Check back soon!</p>
        </div>
      )}
    </div>
  );
}
