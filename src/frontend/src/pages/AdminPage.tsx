import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  FileCheck,
  FileText,
  List,
  Loader2,
  Plus,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddChapter,
  useAddExamPaper,
  useAddNote,
  useAddSubject,
  useAllExamPapers,
  useAllSubjects,
  useIsAdmin,
  usePreloadSubjects,
  useSubjectStats,
} from "../hooks/useQueries";

export default function AdminPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: stats } = useSubjectStats();
  const { data: subjects } = useAllSubjects();
  const { data: examPapers } = useAllExamPapers();

  const addSubject = useAddSubject();
  const addChapter = useAddChapter();
  const addNote = useAddNote();
  const addExamPaper = useAddExamPaper();
  const preload = usePreloadSubjects();
  const preloadMutate = preload.mutate;

  const [subjectForm, setSubjectForm] = useState({
    name: "",
    description: "",
    icon: "book",
    color: "#2D6CDF",
  });
  const [chapterForm, setChapterForm] = useState({
    title: "",
    subjectId: "",
    order: "1",
    description: "",
  });
  const [noteForm, setNoteForm] = useState({
    title: "",
    content: "",
    chapterId: "",
  });
  const [paperForm, setPaperForm] = useState({
    title: "",
    subjectId: "",
    year: new Date().getFullYear().toString(),
    description: "",
  });
  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false);
  const [chapterDialogOpen, setChapterDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [paperDialogOpen, setPaperDialogOpen] = useState(false);

  useEffect(() => {
    if (isAdmin) preloadMutate();
  }, [isAdmin, preloadMutate]);

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addSubject.mutateAsync(subjectForm);
      toast.success("Subject added!");
      setSubjectForm({
        name: "",
        description: "",
        icon: "book",
        color: "#2D6CDF",
      });
      setSubjectDialogOpen(false);
    } catch {
      toast.error("Failed to add subject");
    }
  };

  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addChapter.mutateAsync({
        title: chapterForm.title,
        subjectId: BigInt(chapterForm.subjectId),
        order: BigInt(chapterForm.order),
        description: chapterForm.description,
      });
      toast.success("Chapter added!");
      setChapterForm({ title: "", subjectId: "", order: "1", description: "" });
      setChapterDialogOpen(false);
    } catch {
      toast.error("Failed to add chapter");
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addNote.mutateAsync({
        title: noteForm.title,
        content: noteForm.content,
        chapterId: BigInt(noteForm.chapterId),
      });
      toast.success("Note added!");
      setNoteForm({ title: "", content: "", chapterId: "" });
      setNoteDialogOpen(false);
    } catch {
      toast.error("Failed to add note");
    }
  };

  const handleAddPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addExamPaper.mutateAsync({
        title: paperForm.title,
        subjectId: BigInt(paperForm.subjectId),
        year: BigInt(paperForm.year),
        description: paperForm.description,
      });
      toast.success("Exam paper added!");
      setPaperForm({
        title: "",
        subjectId: "",
        year: new Date().getFullYear().toString(),
        description: "",
      });
      setPaperDialogOpen(false);
    } catch {
      toast.error("Failed to add exam paper");
    }
  };

  if (!isLoggedIn) {
    return (
      <div
        className="max-w-md mx-auto px-4 py-20 text-center"
        data-ocid="admin.login_panel"
      >
        <div className="bg-white rounded-2xl border border-border shadow-card p-8">
          <ShieldOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Admin Access
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Please log in to access the admin panel.
          </p>
          <Button
            onClick={() => login()}
            className="w-full rounded-xl"
            data-ocid="admin.login_button"
          >
            {loginStatus === "logging-in" ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Login to Continue
          </Button>
        </div>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div
        className="flex items-center justify-center py-20"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="max-w-md mx-auto px-4 py-20 text-center"
        data-ocid="admin.error_state"
      >
        <div className="bg-white rounded-2xl border border-border shadow-card p-8">
          <ShieldOff className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground text-sm">
            You do not have admin privileges.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-extrabold text-foreground">
              Admin Panel
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Manage subjects, chapters, notes, and exam papers.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => preload.mutate()}
          disabled={preload.isPending}
          className="rounded-xl"
          data-ocid="admin.preload_button"
        >
          {preload.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}{" "}
          Seed Sample Data
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Subjects",
              value: stats.totalSubjects.toString(),
              icon: BookOpen,
              color: "text-blue-600",
            },
            {
              label: "Chapters",
              value: stats.totalChapters.toString(),
              icon: List,
              color: "text-green-600",
            },
            {
              label: "Notes",
              value: stats.totalNotes.toString(),
              icon: FileText,
              color: "text-orange-600",
            },
            {
              label: "Exam Papers",
              value: stats.totalExamPapers.toString(),
              icon: FileCheck,
              color: "text-purple-600",
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-white rounded-xl shadow-card border border-border p-4 flex items-center gap-3"
            >
              <Icon className={`w-8 h-8 ${color}`} />
              <div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Tabs defaultValue="subjects">
        <TabsList className="mb-6" data-ocid="admin.tab">
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="chapters">Chapters</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="papers">Exam Papers</TabsTrigger>
        </TabsList>

        <TabsContent value="subjects">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">
              Subjects ({subjects?.length ?? 0})
            </h2>
            <Dialog
              open={subjectDialogOpen}
              onOpenChange={setSubjectDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  className="rounded-xl gap-2"
                  data-ocid="admin.add_subject_button"
                >
                  <Plus className="w-4 h-4" /> Add Subject
                </Button>
              </DialogTrigger>
              <DialogContent data-ocid="admin.subject_dialog">
                <DialogHeader>
                  <DialogTitle>Add New Subject</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddSubject} className="space-y-4">
                  <div>
                    <Label htmlFor="s-name">Name</Label>
                    <Input
                      id="s-name"
                      value={subjectForm.name}
                      onChange={(e) =>
                        setSubjectForm((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="Mathematics"
                      required
                      data-ocid="admin.subject.name_input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="s-desc">Description</Label>
                    <Textarea
                      id="s-desc"
                      value={subjectForm.description}
                      onChange={(e) =>
                        setSubjectForm((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Subject description"
                      required
                      data-ocid="admin.subject.description_input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="s-icon">Icon keyword</Label>
                    <Input
                      id="s-icon"
                      value={subjectForm.icon}
                      onChange={(e) =>
                        setSubjectForm((p) => ({ ...p, icon: e.target.value }))
                      }
                      placeholder="calculator"
                      data-ocid="admin.subject.icon_input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="s-color">Color</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        id="s-color"
                        type="color"
                        value={subjectForm.color}
                        onChange={(e) =>
                          setSubjectForm((p) => ({
                            ...p,
                            color: e.target.value,
                          }))
                        }
                        className="w-16 h-10 p-1 cursor-pointer"
                        data-ocid="admin.subject.color_input"
                      />
                      <Input
                        value={subjectForm.color}
                        onChange={(e) =>
                          setSubjectForm((p) => ({
                            ...p,
                            color: e.target.value,
                          }))
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-xl"
                    disabled={addSubject.isPending}
                    data-ocid="admin.subject.submit_button"
                  >
                    {addSubject.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Add Subject
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {subjects?.map((s, i) => (
              <motion.div
                key={s.id.toString()}
                className="bg-white rounded-xl border border-border shadow-card p-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                data-ocid={`admin.subject.item.${i + 1}`}
              >
                <div
                  className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center"
                  style={{ backgroundColor: s.color }}
                >
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <p className="font-bold text-sm text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {s.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  ID: {s.id.toString()}
                </p>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chapters">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Chapters</h2>
            <Dialog
              open={chapterDialogOpen}
              onOpenChange={setChapterDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  className="rounded-xl gap-2"
                  data-ocid="admin.add_chapter_button"
                >
                  <Plus className="w-4 h-4" /> Add Chapter
                </Button>
              </DialogTrigger>
              <DialogContent data-ocid="admin.chapter_dialog">
                <DialogHeader>
                  <DialogTitle>Add New Chapter</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddChapter} className="space-y-4">
                  <div>
                    <Label>Subject</Label>
                    <Select
                      onValueChange={(v) =>
                        setChapterForm((p) => ({ ...p, subjectId: v }))
                      }
                    >
                      <SelectTrigger data-ocid="admin.chapter.subject_select">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects?.map((s) => (
                          <SelectItem
                            key={s.id.toString()}
                            value={s.id.toString()}
                          >
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="c-title">Title</Label>
                    <Input
                      id="c-title"
                      value={chapterForm.title}
                      onChange={(e) =>
                        setChapterForm((p) => ({ ...p, title: e.target.value }))
                      }
                      placeholder="Chapter title"
                      required
                      data-ocid="admin.chapter.title_input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="c-order">Order</Label>
                    <Input
                      id="c-order"
                      type="number"
                      value={chapterForm.order}
                      onChange={(e) =>
                        setChapterForm((p) => ({ ...p, order: e.target.value }))
                      }
                      min="1"
                      data-ocid="admin.chapter.order_input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="c-desc">Description</Label>
                    <Textarea
                      id="c-desc"
                      value={chapterForm.description}
                      onChange={(e) =>
                        setChapterForm((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Chapter description"
                      data-ocid="admin.chapter.description_input"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-xl"
                    disabled={addChapter.isPending}
                    data-ocid="admin.chapter.submit_button"
                  >
                    {addChapter.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Add Chapter
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-muted-foreground text-sm">
            Use the dialog to add chapters. Find subject IDs from the Subjects
            tab.
          </p>
        </TabsContent>

        <TabsContent value="notes">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Notes</h2>
            <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="rounded-xl gap-2"
                  data-ocid="admin.add_note_button"
                >
                  <Plus className="w-4 h-4" /> Add Note
                </Button>
              </DialogTrigger>
              <DialogContent
                className="max-w-2xl"
                data-ocid="admin.note_dialog"
              >
                <DialogHeader>
                  <DialogTitle>Add New Note</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddNote} className="space-y-4">
                  <div>
                    <Label htmlFor="n-chapterid">Chapter ID</Label>
                    <Input
                      id="n-chapterid"
                      value={noteForm.chapterId}
                      onChange={(e) =>
                        setNoteForm((p) => ({
                          ...p,
                          chapterId: e.target.value,
                        }))
                      }
                      placeholder="Chapter ID (see Subject page)"
                      required
                      data-ocid="admin.note.chapterid_input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="n-title">Title</Label>
                    <Input
                      id="n-title"
                      value={noteForm.title}
                      onChange={(e) =>
                        setNoteForm((p) => ({ ...p, title: e.target.value }))
                      }
                      placeholder="Note title"
                      required
                      data-ocid="admin.note.title_input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="n-content">Content (Markdown)</Label>
                    <Textarea
                      id="n-content"
                      value={noteForm.content}
                      onChange={(e) =>
                        setNoteForm((p) => ({ ...p, content: e.target.value }))
                      }
                      placeholder="# Title\n\nWrite notes in **markdown**..."
                      className="min-h-48 font-mono text-sm"
                      required
                      data-ocid="admin.note.content_input"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-xl"
                    disabled={addNote.isPending}
                    data-ocid="admin.note.submit_button"
                  >
                    {addNote.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Add Note
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-muted-foreground text-sm">
            Notes support markdown formatting. Find chapter IDs from the
            Subjects page.
          </p>
        </TabsContent>

        <TabsContent value="papers">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">
              Exam Papers ({examPapers?.length ?? 0})
            </h2>
            <Dialog open={paperDialogOpen} onOpenChange={setPaperDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="rounded-xl gap-2"
                  data-ocid="admin.add_paper_button"
                >
                  <Plus className="w-4 h-4" /> Add Paper
                </Button>
              </DialogTrigger>
              <DialogContent data-ocid="admin.paper_dialog">
                <DialogHeader>
                  <DialogTitle>Add Exam Paper</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddPaper} className="space-y-4">
                  <div>
                    <Label>Subject</Label>
                    <Select
                      onValueChange={(v) =>
                        setPaperForm((p) => ({ ...p, subjectId: v }))
                      }
                    >
                      <SelectTrigger data-ocid="admin.paper.subject_select">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects?.map((s) => (
                          <SelectItem
                            key={s.id.toString()}
                            value={s.id.toString()}
                          >
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="p-title">Title</Label>
                    <Input
                      id="p-title"
                      value={paperForm.title}
                      onChange={(e) =>
                        setPaperForm((p) => ({ ...p, title: e.target.value }))
                      }
                      placeholder="Annual Exam 2024"
                      required
                      data-ocid="admin.paper.title_input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="p-year">Year</Label>
                    <Input
                      id="p-year"
                      type="number"
                      value={paperForm.year}
                      onChange={(e) =>
                        setPaperForm((p) => ({ ...p, year: e.target.value }))
                      }
                      min="2000"
                      max="2100"
                      data-ocid="admin.paper.year_input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="p-desc">Description</Label>
                    <Textarea
                      id="p-desc"
                      value={paperForm.description}
                      onChange={(e) =>
                        setPaperForm((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Paper description"
                      data-ocid="admin.paper.description_input"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-xl"
                    disabled={addExamPaper.isPending}
                    data-ocid="admin.paper.submit_button"
                  >
                    {addExamPaper.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Add Exam Paper
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {examPapers?.map((paper, i) => {
              const subject = subjects?.find((s) => s.id === paper.subjectId);
              return (
                <div
                  key={paper.id.toString()}
                  className="bg-white rounded-xl border border-border shadow-card p-4"
                  data-ocid={`admin.paper.item.${i + 1}`}
                >
                  <p className="font-bold text-sm text-foreground">
                    {paper.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {subject?.name ?? "Unknown Subject"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {paper.description}
                  </p>
                  <p className="text-xs font-mono text-muted-foreground mt-1">
                    Year: {paper.year.toString()}
                  </p>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
