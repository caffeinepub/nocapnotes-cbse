import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { BookOpen, Calendar, ChevronRight } from "lucide-react";
import type { Note } from "../backend";
import { useActor } from "../hooks/useActor";

const SKELETON_KEYS = ["a", "b", "c", "d", "e", "f", "g", "h"];

function renderMarkdown(content: string): string {
  let html = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/^&gt; (.+)$/gm, "<blockquote>$1</blockquote>");
  html = html.replace(/((?:^[*-] .+\n?)+)/gm, (match) => {
    const items = match
      .trim()
      .split("\n")
      .map((l) => `<li>${l.replace(/^[*-] /, "")}</li>`)
      .join("");
    return `<ul>${items}</ul>`;
  });
  html = html.replace(/((?:^\d+\. .+\n?)+)/gm, (match) => {
    const items = match
      .trim()
      .split("\n")
      .map((l) => `<li>${l.replace(/^\d+\. /, "")}</li>`)
      .join("");
    return `<ol>${items}</ol>`;
  });
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (/^<(h[1-6]|ul|ol|pre|blockquote)/.test(trimmed)) return trimmed;
      return `<p>${trimmed.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");
  return html;
}

export default function NoteDetailPage() {
  const { id } = useParams({ from: "/notes/$id" });
  const noteId = id ? BigInt(id) : undefined;
  const { actor, isFetching } = useActor();

  const { data: note, isLoading } = useQuery<Note | null>({
    queryKey: ["note", noteId?.toString()],
    queryFn: async () => {
      if (!actor || noteId === undefined) return null;
      const notes = await actor.getLatestNotes(BigInt(100));
      return notes.find((n) => n.id === noteId) ?? null;
    },
    enabled: !!actor && !isFetching && noteId !== undefined,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
          {note?.title ?? "Note"}
        </span>
      </nav>

      {isLoading ? (
        <div data-ocid="note.loading_state">
          <Skeleton className="h-9 w-3/4 mb-4" />
          <Skeleton className="h-4 w-40 mb-8" />
          <div className="space-y-3">
            {SKELETON_KEYS.map((k) => (
              <Skeleton key={k} className="h-4 w-full" />
            ))}
          </div>
        </div>
      ) : note ? (
        <article>
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-foreground mb-3">
              {note.title}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(
                  Number(note.createdDate) / 1_000_000,
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </header>
          <div
            className="prose-notes bg-white rounded-2xl border border-border shadow-card p-6 sm:p-8"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: intentional markdown render
            dangerouslySetInnerHTML={{ __html: renderMarkdown(note.content) }}
          />
        </article>
      ) : (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="note.error_state"
        >
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg">Note not found.</p>
          <Link
            to="/subjects"
            className="text-primary font-medium mt-2 inline-block hover:underline"
          >
            Browse Subjects
          </Link>
        </div>
      )}
    </div>
  );
}
