import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { BookOpen, ChevronRight, List } from "lucide-react";
import { motion } from "motion/react";
import { useAllSubjects, useChaptersBySubject } from "../hooks/useQueries";

const SKELETON_KEYS = ["a", "b", "c", "d", "e"];

export default function SubjectDetailPage() {
  const { id } = useParams({ from: "/subjects/$id" });
  const subjectId = id ? BigInt(id) : undefined;

  const { data: subjects } = useAllSubjects();
  const { data: chapters, isLoading } = useChaptersBySubject(subjectId);
  const subject = subjects?.find((s) => s.id === subjectId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/subjects" className="hover:text-foreground">
          Subjects
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground font-medium">
          {subject?.name ?? "Subject"}
        </span>
      </nav>

      {subject && (
        <div
          className="rounded-2xl p-6 mb-8 text-white"
          style={{ backgroundColor: subject.color || "#2D6CDF" }}
        >
          <h1 className="text-3xl font-extrabold mb-2">{subject.name}</h1>
          <p className="text-white/80 text-sm">{subject.description}</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <List className="w-5 h-5 text-primary" /> Chapters
        </h2>
        {chapters && (
          <Badge variant="secondary">{chapters.length} chapters</Badge>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3" data-ocid="chapters.loading_state">
          {SKELETON_KEYS.map((k) => (
            <Skeleton key={k} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : chapters && chapters.length > 0 ? (
        <motion.div
          className="space-y-3"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {[...chapters]
            .sort((a, b) => Number(a.order) - Number(b.order))
            .map((chapter, i) => (
              <motion.div
                key={chapter.id.toString()}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                data-ocid={`chapters.item.${i + 1}`}
              >
                <Link
                  to="/chapters/$id"
                  params={{ id: chapter.id.toString() }}
                  className="flex items-center justify-between bg-white rounded-xl shadow-card border border-border p-4 hover:shadow-card-hover hover:border-primary/30 transition-all group"
                  data-ocid={`chapters.link.${i + 1}`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{ backgroundColor: subject?.color || "#2D6CDF" }}
                    >
                      {Number(chapter.order)}
                    </span>
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {chapter.title}
                      </p>
                      {chapter.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {chapter.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </motion.div>
            ))}
        </motion.div>
      ) : (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="chapters.empty_state"
        >
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No chapters added yet.</p>
        </div>
      )}
    </div>
  );
}
