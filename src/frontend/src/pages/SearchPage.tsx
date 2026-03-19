import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { BookOpen, FileCheck, FileText, List, Search } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useSearchAll } from "../hooks/useQueries";

const SKELETON_KEYS = ["a", "b", "c", "d", "e"];

export default function SearchPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: "/search" });
  const query = (searchParams as Record<string, string>).q ?? "";
  const [inputVal, setInputVal] = useState(query);

  const { data: results, isLoading } = useSearchAll(query);

  useEffect(() => {
    setInputVal(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim())
      navigate({ to: "/search", search: { q: inputVal.trim() } });
  };

  const total = results
    ? (results.subjects?.length ?? 0) +
      (results.chapters?.length ?? 0) +
      (results.notes?.length ?? 0) +
      (results.examPapers?.length ?? 0)
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-foreground mb-6">Search</h1>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Search subjects, chapters, notes…"
            className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
            data-ocid="search.search_input"
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
          data-ocid="search.submit_button"
        >
          Search
        </button>
      </form>

      {query && (
        <p className="text-sm text-muted-foreground mb-6">
          {isLoading
            ? "Searching…"
            : `${total} result${total !== 1 ? "s" : ""} for "${query}"`}
        </p>
      )}

      {isLoading && (
        <div className="space-y-4" data-ocid="search.loading_state">
          {SKELETON_KEYS.map((k) => (
            <Skeleton key={k} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && results && (
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {results.subjects && results.subjects.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> Subjects (
                {results.subjects.length})
              </h2>
              <div className="space-y-2">
                {results.subjects.map((s, i) => (
                  <Link
                    key={s.id.toString()}
                    to="/subjects/$id"
                    params={{ id: s.id.toString() }}
                    className="flex items-center gap-3 bg-white border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-card transition-all"
                    data-ocid={`search.subject.item.${i + 1}`}
                  >
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: s.color }}
                    >
                      <BookOpen className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {results.chapters && results.chapters.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <List className="w-5 h-5 text-primary" /> Chapters (
                {results.chapters.length})
              </h2>
              <div className="space-y-2">
                {results.chapters.map((c, i) => (
                  <Link
                    key={c.id.toString()}
                    to="/chapters/$id"
                    params={{ id: c.id.toString() }}
                    className="flex items-center gap-3 bg-white border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-card transition-all"
                    data-ocid={`search.chapter.item.${i + 1}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <List className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{c.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {results.notes && results.notes.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Notes (
                {results.notes.length})
              </h2>
              <div className="space-y-2">
                {results.notes.map((n, i) => (
                  <Link
                    key={n.id.toString()}
                    to="/notes/$id"
                    params={{ id: n.id.toString() }}
                    className="flex items-center gap-3 bg-white border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-card transition-all"
                    data-ocid={`search.note.item.${i + 1}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <p className="font-semibold text-foreground">{n.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {results.examPapers && results.examPapers.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-primary" /> Exam Papers (
                {results.examPapers.length})
              </h2>
              <div className="space-y-2">
                {results.examPapers.map((p, i) => (
                  <Link
                    key={p.id.toString()}
                    to="/papers"
                    className="flex items-center gap-3 bg-white border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-card transition-all"
                    data-ocid={`search.paper.item.${i + 1}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileCheck className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{p.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Year: {p.year.toString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {total === 0 && query && (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="search.empty_state"
            >
              <Search className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-lg">No results found for "{query}"</p>
              <p className="text-sm mt-1">
                Try different keywords or browse subjects.
              </p>
            </div>
          )}
        </motion.div>
      )}
      {!query && (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg">
            Enter a search term above to find notes, chapters, and more.
          </p>
        </div>
      )}
    </div>
  );
}
