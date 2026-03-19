import { Button } from "@/components/ui/button";
import { Link, useSearch } from "@tanstack/react-router";
import { ChevronRight, Download, FileText } from "lucide-react";

export default function PdfViewerPage() {
  const search = useSearch({ from: "/pdf-viewer" }) as {
    src?: string;
    title?: string;
    subject?: string;
    chapter?: string;
  };
  const src = search.src ?? "";
  const title = search.title ?? "Notes";
  const subject = search.subject ?? "Subject";
  const chapter = search.chapter ?? "";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6 flex-wrap">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/subjects" className="hover:text-foreground">
          Subjects
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground font-medium">{subject}</span>
        {chapter && (
          <>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">{chapter}</span>
          </>
        )}
      </nav>

      <div className="bg-white rounded-2xl border border-border shadow-card p-6 mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-foreground">
                {title}
              </h1>
              {chapter && (
                <p className="text-sm text-muted-foreground">
                  {subject} &bull; {chapter}
                </p>
              )}
            </div>
          </div>
          <a href={src} download target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" /> Download PDF
            </Button>
          </a>
        </div>
      </div>

      <div className="rounded-2xl border border-border shadow-card overflow-hidden bg-white">
        <iframe
          src={src}
          title={title}
          className="w-full"
          style={{ height: "80vh", minHeight: 400 }}
        />
      </div>
    </div>
  );
}
