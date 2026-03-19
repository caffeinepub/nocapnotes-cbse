import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { BookOpen, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import SubjectCard from "../components/SubjectCard";
import { useAllSubjects } from "../hooks/useQueries";

const SKELETON_KEYS = ["a", "b", "c", "d", "e", "f", "g", "h"];

export default function SubjectsPage() {
  const { data: subjects, isLoading } = useAllSubjects();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground font-medium">Subjects</span>
      </nav>
      <h1 className="text-3xl font-extrabold text-foreground mb-2">
        All Subjects
      </h1>
      <p className="text-muted-foreground mb-8">
        Explore all Class 8 subjects and start learning.
      </p>

      {isLoading ? (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
          data-ocid="subjects.loading_state"
        >
          {SKELETON_KEYS.map((k) => (
            <div key={k} className="rounded-xl overflow-hidden">
              <Skeleton className="h-20 w-full" />
              <div className="p-4 bg-white">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-full mb-3" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : subjects && subjects.length > 0 ? (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {subjects.map((subject, i) => (
            <motion.div
              key={subject.id.toString()}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <SubjectCard subject={subject} index={i + 1} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="subjects.empty_state"
        >
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg">No subjects available yet.</p>
        </div>
      )}
    </div>
  );
}
