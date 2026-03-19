import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Chapter, ExamPaper, Note, Subject } from "../backend";
import { useActor } from "./useActor";

export function useAllSubjects() {
  const { actor, isFetching } = useActor();
  return useQuery<Subject[]>({
    queryKey: ["subjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSubjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubjectStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSubjectStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useChaptersBySubject(subjectId: bigint | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<Chapter[]>({
    queryKey: ["chapters", subjectId?.toString()],
    queryFn: async () => {
      if (!actor || subjectId === undefined) return [];
      return actor.getChaptersBySubject(subjectId);
    },
    enabled: !!actor && !isFetching && subjectId !== undefined,
  });
}

export function useNotesByChapter(chapterId: bigint | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<Note[]>({
    queryKey: ["notes", chapterId?.toString()],
    queryFn: async () => {
      if (!actor || chapterId === undefined) return [];
      return actor.getNotesByChapter(chapterId);
    },
    enabled: !!actor && !isFetching && chapterId !== undefined,
  });
}

export function useLatestNotes(count = 6) {
  const { actor, isFetching } = useActor();
  return useQuery<Note[]>({
    queryKey: ["latestNotes", count],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLatestNotes(BigInt(count));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllExamPapers() {
  const { actor, isFetching } = useActor();
  return useQuery<ExamPaper[]>({
    queryKey: ["examPapers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllExamPapers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchAll(keyword: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["search", keyword],
    queryFn: async () => {
      if (!actor || !keyword.trim())
        return { subjects: [], examPapers: [], chapters: [], notes: [] };
      return actor.searchAll(keyword);
    },
    enabled: !!actor && !isFetching && keyword.trim().length > 0,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddSubject() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      description,
      icon,
      color,
    }: { name: string; description: string; icon: string; color: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.addSubject(name, description, icon, color);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subjects"] }),
  });
}

export function useAddChapter() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      subjectId,
      order,
      description,
    }: {
      title: string;
      subjectId: bigint;
      order: bigint;
      description: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addChapter(title, subjectId, order, description);
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({
        queryKey: ["chapters", vars.subjectId.toString()],
      }),
  });
}

export function useAddNote() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      content,
      chapterId,
    }: { title: string; content: string; chapterId: bigint }) => {
      if (!actor) throw new Error("No actor");
      return actor.addNote(title, content, chapterId);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["notes", vars.chapterId.toString()] });
      qc.invalidateQueries({ queryKey: ["latestNotes"] });
    },
  });
}

export function useAddExamPaper() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      subjectId,
      year,
      description,
    }: {
      title: string;
      subjectId: bigint;
      year: bigint;
      description: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addExamPaper(title, subjectId, year, description);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["examPapers"] }),
  });
}

export function usePreloadSubjects() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.preloadSubjects();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subjects"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}
