import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type SubjectId = Nat;
  type ChapterId = Nat;
  type NoteId = Nat;
  type ExamPaperId = Nat;

  public type Subject = {
    id : SubjectId;
    name : Text;
    description : Text;
    icon : Text;
    color : Text;
  };

  public type Chapter = {
    id : ChapterId;
    title : Text;
    subjectId : SubjectId;
    order : Nat;
    description : Text;
  };

  public type Note = {
    id : NoteId;
    title : Text;
    content : Text; // Storing as plain text/markdown
    chapterId : ChapterId;
    createdDate : Time.Time;
  };

  public type ExamPaper = {
    id : ExamPaperId;
    title : Text;
    subjectId : SubjectId;
    year : Nat;
    description : Text;
  };

  let subjects = Map.empty<SubjectId, Subject>();
  let chapters = Map.empty<ChapterId, Chapter>();
  let notes = Map.empty<NoteId, Note>();
  let examPapers = Map.empty<ExamPaperId, ExamPaper>();

  var nextSubjectId = 1;
  var nextChapterId = 1;
  var nextNoteId = 1;
  var nextExamPaperId = 1;

  public shared ({ caller }) func addSubject(name : Text, description : Text, icon : Text, color : Text) : async SubjectId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add subjects");
    };
    let subject : Subject = {
      id = nextSubjectId;
      name;
      description;
      icon;
      color;
    };
    subjects.add(nextSubjectId, subject);
    nextSubjectId += 1;
    subject.id;
  };

  public shared ({ caller }) func addChapter(title : Text, subjectId : SubjectId, order : Nat, description : Text) : async ChapterId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add chapters");
    };
    let chapter : Chapter = {
      id = nextChapterId;
      title;
      subjectId;
      order;
      description;
    };
    chapters.add(nextChapterId, chapter);
    nextChapterId += 1;
    chapter.id;
  };

  public shared ({ caller }) func addNote(title : Text, content : Text, chapterId : ChapterId) : async NoteId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add notes");
    };
    let note : Note = {
      id = nextNoteId;
      title;
      content;
      chapterId;
      createdDate = Time.now();
    };
    notes.add(nextNoteId, note);
    nextNoteId += 1;
    note.id;
  };

  public shared ({ caller }) func addExamPaper(title : Text, subjectId : SubjectId, year : Nat, description : Text) : async ExamPaperId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add exam papers");
    };
    let paper : ExamPaper = {
      id = nextExamPaperId;
      title;
      subjectId;
      year;
      description;
    };
    examPapers.add(nextExamPaperId, paper);
    nextExamPaperId += 1;
    paper.id;
  };

  public query ({ caller }) func getAllSubjects() : async [Subject] {
    subjects.values().toArray();
  };

  public query ({ caller }) func getChaptersBySubject(subjectId : SubjectId) : async [Chapter] {
    chapters.values().toArray().filter(func(c) { c.subjectId == subjectId });
  };

  public query ({ caller }) func getNotesByChapter(chapterId : ChapterId) : async [Note] {
    notes.values().toArray().filter(func(n) { n.chapterId == chapterId });
  };

  public query ({ caller }) func getAllExamPapers() : async [ExamPaper] {
    examPapers.values().toArray();
  };

  public query ({ caller }) func searchAll(keyword : Text) : async {
    subjects : [Subject];
    chapters : [Chapter];
    notes : [Note];
    examPapers : [ExamPaper];
  } {
    let searchSubjects = subjects.values().toArray().filter(
      func(s) { s.name.contains(#text keyword) or s.description.contains(#text keyword) }
    );
    let searchChapters = chapters.values().toArray().filter(
      func(c) { c.title.contains(#text keyword) or c.description.contains(#text keyword) }
    );
    let searchNotes = notes.values().toArray().filter(
      func(n) { n.title.contains(#text keyword) or n.content.contains(#text keyword) }
    );
    let searchPapers = examPapers.values().toArray().filter(
      func(p) { p.title.contains(#text keyword) or p.description.contains(#text keyword) }
    );

    {
      subjects = searchSubjects;
      chapters = searchChapters;
      notes = searchNotes;
      examPapers = searchPapers;
    };
  };

  module Note {
    public func compareByCreatedDate(a : Note, b : Note) : Order.Order {
      if (a.createdDate < b.createdDate) { #less } else if (a.createdDate > b.createdDate) {
        #greater;
      } else { #equal };
    };
  };

  public query ({ caller }) func getLatestNotes(count : Nat) : async [Note] {
    let sortedNotes = notes.values().toArray().sort(Note.compareByCreatedDate);
    let limit = if (count > sortedNotes.size()) { sortedNotes.size() } else { count };
    sortedNotes.sliceToArray(0, limit);
  };

  public query ({ caller }) func getSubjectStats() : async {
    totalSubjects : Nat;
    totalChapters : Nat;
    totalNotes : Nat;
    totalExamPapers : Nat;
  } {
    {
      totalSubjects = subjects.size();
      totalChapters = chapters.size();
      totalNotes = notes.size();
      totalExamPapers = examPapers.size();
    };
  };

  public shared ({ caller }) func preloadSubjects() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can preload subjects");
    };

    let defaultSubjects = [
      {
        name = "Mathematics";
        description = "Math concepts and problems";
        icon = "math_icon";
        color = "blue";
      },
      {
        name = "Science";
        description = "Physics, Chemistry, Biology";
        icon = "science_icon";
        color = "green";
      },
      {
        name = "English";
        description = "Literature and Grammar";
        icon = "english_icon";
        color = "purple";
      },
      {
        name = "Social Studies";
        description = "History, Civics, Geography";
        icon = "social_icon";
        color = "yellow";
      },
      {
        name = "Hindi";
        description = "Language and Literature";
        icon = "hindi_icon";
        color = "red";
      },
      {
        name = "Computers";
        description = "Computer Science basics";
        icon = "computer_icon";
        color = "orange";
      },
    ];

    for (subject in defaultSubjects.values()) {
      let newSubject : Subject = {
        id = nextSubjectId;
        name = subject.name;
        description = subject.description;
        icon = subject.icon;
        color = subject.color;
      };
      subjects.add(nextSubjectId, newSubject);
      nextSubjectId += 1;
    };
  };
};
