import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type ChapterId = bigint;
export type NoteId = bigint;
export interface Chapter {
    id: ChapterId;
    title: string;
    order: bigint;
    description: string;
    subjectId: SubjectId;
}
export type Time = bigint;
export type ExamPaperId = bigint;
export interface ExamPaper {
    id: ExamPaperId;
    title: string;
    year: bigint;
    description: string;
    subjectId: SubjectId;
}
export type SubjectId = bigint;
export interface Subject {
    id: SubjectId;
    icon: string;
    name: string;
    color: string;
    description: string;
}
export interface Note {
    id: NoteId;
    title: string;
    content: string;
    createdDate: Time;
    chapterId: ChapterId;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addChapter(title: string, subjectId: SubjectId, order: bigint, description: string): Promise<ChapterId>;
    addExamPaper(title: string, subjectId: SubjectId, year: bigint, description: string): Promise<ExamPaperId>;
    addNote(title: string, content: string, chapterId: ChapterId): Promise<NoteId>;
    addSubject(name: string, description: string, icon: string, color: string): Promise<SubjectId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllExamPapers(): Promise<Array<ExamPaper>>;
    getAllSubjects(): Promise<Array<Subject>>;
    getCallerUserRole(): Promise<UserRole>;
    getChaptersBySubject(subjectId: SubjectId): Promise<Array<Chapter>>;
    getLatestNotes(count: bigint): Promise<Array<Note>>;
    getNotesByChapter(chapterId: ChapterId): Promise<Array<Note>>;
    getSubjectStats(): Promise<{
        totalExamPapers: bigint;
        totalSubjects: bigint;
        totalNotes: bigint;
        totalChapters: bigint;
    }>;
    isCallerAdmin(): Promise<boolean>;
    preloadSubjects(): Promise<void>;
    searchAll(keyword: string): Promise<{
        subjects: Array<Subject>;
        examPapers: Array<ExamPaper>;
        chapters: Array<Chapter>;
        notes: Array<Note>;
    }>;
}
