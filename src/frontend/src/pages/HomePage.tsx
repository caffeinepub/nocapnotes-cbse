import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Calendar,
  ChevronRight,
  FileText,
  GraduationCap,
  Search,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import SubjectCard from "../components/SubjectCard";
import {
  useAllExamPapers,
  useAllSubjects,
  useLatestNotes,
  useSubjectStats,
} from "../hooks/useQueries";

const SKELETON_KEYS = ["a", "b", "c", "d", "e", "f"];
const NOTE_SKELETON_KEYS = ["a", "b", "c", "d"];

const FEATURED_PDFS = [
  {
    label: "Science Ch-5: Conservation of Plants and Animals",
    subject: "Science",
    chapter: "Chapter 5",
    src: "/assets/uploads/Conservation-of-Plants-and-Animals-Class-Notes-1.pdf",
    title: "Conservation of Plants and Animals - Class Notes",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQ, setSearchQ] = useState("");

  const { data: subjects, isLoading: subjectsLoading } = useAllSubjects();
  const { data: stats } = useSubjectStats();
  const { data: latestNotes, isLoading: notesLoading } = useLatestNotes(6);
  const { data: examPapers } = useAllExamPapers();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQ.trim())
      navigate({ to: "/search", search: { q: searchQ.trim() } });
  };

  const upcomingExams = examPapers?.slice(0, 4) ?? [];

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: "400px" }}
      >
        <img
          src="/assets/generated/hero-cover.dim_1200x400.jpg"
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30" />

        <div className="relative z-10 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block bg-white/15 text-white/90 text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-white/25 backdrop-blur-sm">
                  CBSE Class 8 • No Cap, Just Facts 🔥
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
                  Your Notes Just{" "}
                  <span className="nocapnotes-gradient">Hit Different</span> 💫
                </h1>
                <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8">
                  CBSE Class 8 notes, no cap. Search any subject, chapter, or
                  topic and slay your exams.
                </p>
                <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
                  <input
                    type="text"
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    placeholder="Search subjects, chapters, topics... fr fr 🔍"
                    className="flex-1 pl-4 pr-4 py-3 rounded-xl bg-white/95 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    data-ocid="hero.search_input"
                  />
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-3 rounded-xl flex items-center justify-center transition-colors"
                    data-ocid="hero.search_button"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </form>
                {stats && (
                  <div className="flex gap-6 mt-8">
                    {[
                      {
                        label: "Subjects",
                        value: stats.totalSubjects.toString(),
                      },
                      {
                        label: "Chapters",
                        value: stats.totalChapters.toString(),
                      },
                      { label: "Notes", value: stats.totalNotes.toString() },
                      {
                        label: "Exam Papers",
                        value: stats.totalExamPapers.toString(),
                      },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <p className="text-2xl font-bold text-white">
                          {stat.value}
                        </p>
                        <p className="text-white/60 text-xs">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured PDFs */}
      <section className="py-8 bg-gradient-to-r from-primary/5 to-purple-500/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> 📚 Featured Notes
          </h2>
          <div className="flex flex-wrap gap-3">
            {FEATURED_PDFS.map((pdf) => (
              <Link
                key={pdf.src}
                to="/pdf-viewer"
                search={{
                  src: pdf.src,
                  title: pdf.title,
                  subject: pdf.subject,
                  chapter: pdf.chapter,
                }}
                className="flex items-center gap-3 bg-white rounded-xl border border-border shadow-card px-4 py-3 hover:border-primary/40 hover:shadow-card-hover transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    {pdf.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF • View or Download
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors ml-2" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Explore Class 8 Subjects
                </h2>
                <Link
                  to="/subjects"
                  className="text-primary text-sm font-medium flex items-center gap-1"
                  data-ocid="subjects.link"
                >
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              {subjectsLoading ? (
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 gap-4"
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {subjects.slice(0, 6).map((subject, i) => (
                    <SubjectCard
                      key={subject.id.toString()}
                      subject={subject}
                      index={i + 1}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="text-center py-12 text-muted-foreground"
                  data-ocid="subjects.empty_state"
                >
                  <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p>No subjects available yet.</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-card border border-border p-5">
                <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" /> Upcoming Exams
                </h3>
                {upcomingExams.length > 0 ? (
                  <ul className="space-y-3">
                    {upcomingExams.map((paper, i) => (
                      <li
                        key={paper.id.toString()}
                        className="border-b border-border pb-3 last:border-0 last:pb-0"
                        data-ocid={`exams.item.${i + 1}`}
                      >
                        <Link to="/papers" className="group">
                          <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                            {paper.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Year: {paper.year.toString()}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div
                    className="py-4 text-center"
                    data-ocid="exams.empty_state"
                  >
                    <p className="text-sm text-muted-foreground">
                      No exam papers yet.
                    </p>
                    <Link
                      to="/papers"
                      className="text-primary text-sm font-medium mt-1 block"
                      data-ocid="exams.link"
                    >
                      View Sample Papers
                    </Link>
                  </div>
                )}
                <Link
                  to="/papers"
                  className="mt-4 block text-center text-primary text-sm font-medium hover:underline"
                  data-ocid="exams.view_all_link"
                >
                  View all papers →
                </Link>
              </div>

              <div className="bg-white rounded-xl shadow-card border border-border p-5">
                <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" /> Top
                  Resources
                </h3>
                <ul className="space-y-3">
                  {[
                    {
                      label: "NCERT Textbooks",
                      desc: "Official curriculum books",
                    },
                    { label: "Study Guides", desc: "Chapter-wise summaries" },
                    { label: "Practice Questions", desc: "Exercise questions" },
                    { label: "Mind Maps", desc: "Visual concept maps" },
                  ].map((r, i) => (
                    <li
                      key={r.label}
                      className="flex items-start gap-3"
                      data-ocid={`resources.item.${i + 1}`}
                    >
                      <span className="mt-0.5 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {r.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {r.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest notes */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-6">
            <FileText className="w-6 h-6 text-primary" /> Latest Study Notes
          </h2>
          {notesLoading ? (
            <div className="space-y-4" data-ocid="notes.loading_state">
              {NOTE_SKELETON_KEYS.map((k) => (
                <div key={k} className="border-b border-border pb-4">
                  <Skeleton className="h-5 w-64 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </div>
          ) : latestNotes && latestNotes.length > 0 ? (
            <div className="divide-y divide-border">
              {latestNotes.map((note, i) => (
                <motion.div
                  key={note.id.toString()}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="py-4 flex items-start justify-between group"
                  data-ocid={`notes.item.${i + 1}`}
                >
                  <div>
                    <Link
                      to="/notes/$id"
                      params={{ id: note.id.toString() }}
                      className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm sm:text-base"
                      data-ocid={`notes.link.${i + 1}`}
                    >
                      {note.title}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(
                        Number(note.createdDate) / 1_000_000,
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Link
                    to="/notes/$id"
                    params={{ id: note.id.toString() }}
                    className="text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                    data-ocid={`notes.read_button.${i + 1}`}
                  >
                    Read <ChevronRight className="w-3 h-3" />
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="notes.empty_state"
            >
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>No notes available yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
