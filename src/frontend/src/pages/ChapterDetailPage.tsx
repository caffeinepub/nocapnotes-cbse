import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { BookOpen, ChevronRight, FileText } from "lucide-react";
import { motion } from "motion/react";
import { useNotesByChapter } from "../hooks/useQueries";

const SKELETON_KEYS = ["a", "b", "c", "d"];

export default function ChapterDetailPage() {
  const { id } = useParams({ from: "/chapters/$id" });
  const chapterId = id ? BigInt(id) : undefined;
  const { data: notes, isLoading } = useNotesByChapter(chapterId);

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
        <span className="text-foreground font-medium">Chapter Notes</span>
      </nav>

      <div className="bg-white rounded-2xl border border-border shadow-card p-6 mb-8">
        <h1 className="text-2xl font-extrabold text-foreground mb-1">
          Chapter Notes
        </h1>
      </div>

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" /> Notes
        </h2>
        {notes && <Badge variant="secondary">{notes.length} notes</Badge>}
      </div>

      {isLoading ? (
        <div className="space-y-3" data-ocid="notes.loading_state">
          {SKELETON_KEYS.map((k) => (
            <Skeleton key={k} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : notes && notes.length > 0 ? (
        <motion.div
          className="space-y-3"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {notes.map((note, i) => (
            <motion.div
              key={note.id.toString()}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
              data-ocid={`notes.item.${i + 1}`}
            >
              <Link
                to="/notes/$id"
                params={{ id: note.id.toString() }}
                className="flex items-center justify-between bg-white rounded-xl shadow-card border border-border p-4 hover:shadow-card-hover hover:border-primary/30 transition-all group"
                data-ocid={`notes.link.${i + 1}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {note.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(
                        Number(note.createdDate) / 1_000_000,
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
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
          data-ocid="notes.empty_state"
        >
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No notes added yet for this chapter.</p>
        </div>
      )}
    </div>
  );
}
