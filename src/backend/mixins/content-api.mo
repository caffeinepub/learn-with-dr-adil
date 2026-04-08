import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Types "../types/content";
import ContentLib "../lib/content";

mixin (
  subjects : Map.Map<Text, Types.Subject>,
  modules : Map.Map<Text, Types.Module>,
  mcqs : Map.Map<Text, Types.MCQ>,
  essayModules : Map.Map<Text, Types.EssayModule>,
) {

  // ── Subjects ──────────────────────────────────────────────────────────────

  public query func getSubjects() : async [Types.Subject] {
    ContentLib.getSubjects(subjects);
  };

  public shared func addSubject(adminToken : Text, subject : Types.Subject) : async () {
    if (not ContentLib.verifyAdmin(adminToken)) {
      Runtime.trap("Unauthorized");
    };
    ContentLib.addSubject(subjects, subject);
  };

  public shared func updateSubject(adminToken : Text, subject : Types.Subject) : async () {
    if (not ContentLib.verifyAdmin(adminToken)) {
      Runtime.trap("Unauthorized");
    };
    ContentLib.updateSubject(subjects, subject);
  };

  public shared func deleteSubject(adminToken : Text, id : Text) : async () {
    if (not ContentLib.verifyAdmin(adminToken)) {
      Runtime.trap("Unauthorized");
    };
    ContentLib.deleteSubject(subjects, id);
  };

  // ── Modules ───────────────────────────────────────────────────────────────

  public query func getModules() : async [Types.Module] {
    ContentLib.getModules(modules);
  };

  public query func getModulesBySubject(subjectId : Text) : async [Types.Module] {
    ContentLib.getModulesBySubject(modules, subjectId);
  };

  public shared func addModule(adminToken : Text, mod : Types.Module) : async () {
    if (not ContentLib.verifyAdmin(adminToken)) {
      Runtime.trap("Unauthorized");
    };
    ContentLib.addModule(modules, mod);
  };

  public shared func updateModule(adminToken : Text, mod : Types.Module) : async () {
    if (not ContentLib.verifyAdmin(adminToken)) {
      Runtime.trap("Unauthorized");
    };
    ContentLib.updateModule(modules, mod);
  };

  public shared func deleteModule(adminToken : Text, id : Text) : async () {
    if (not ContentLib.verifyAdmin(adminToken)) {
      Runtime.trap("Unauthorized");
    };
    ContentLib.deleteModule(modules, id);
  };

  // ── MCQs ──────────────────────────────────────────────────────────────────

  public query func getMCQs() : async [Types.MCQ] {
    ContentLib.getMCQs(mcqs);
  };

  public query func getMCQsBySubject(subjectId : Text) : async [Types.MCQ] {
    ContentLib.getMCQsBySubject(mcqs, subjectId);
  };

  public shared func addMCQ(adminToken : Text, mcq : Types.MCQ) : async () {
    if (not ContentLib.verifyAdmin(adminToken)) {
      Runtime.trap("Unauthorized");
    };
    ContentLib.addMCQ(mcqs, mcq);
  };

  public shared func updateMCQ(adminToken : Text, mcq : Types.MCQ) : async () {
    if (not ContentLib.verifyAdmin(adminToken)) {
      Runtime.trap("Unauthorized");
    };
    ContentLib.updateMCQ(mcqs, mcq);
  };

  public shared func deleteMCQ(adminToken : Text, id : Text) : async () {
    if (not ContentLib.verifyAdmin(adminToken)) {
      Runtime.trap("Unauthorized");
    };
    ContentLib.deleteMCQ(mcqs, id);
  };

  // ── Essay Modules ─────────────────────────────────────────────────────────

  public query func getEssayModules() : async [Types.EssayModule] {
    ContentLib.getEssayModules(essayModules);
  };

  public query func getEssayModulesByType(moduleType : Text) : async [Types.EssayModule] {
    ContentLib.getEssayModulesByType(essayModules, moduleType);
  };

  public shared func addEssayModule(adminToken : Text, em : Types.EssayModule) : async () {
    if (not ContentLib.verifyAdmin(adminToken)) {
      Runtime.trap("Unauthorized");
    };
    ContentLib.addEssayModule(essayModules, em);
  };

  public shared func updateEssayModule(adminToken : Text, em : Types.EssayModule) : async () {
    if (not ContentLib.verifyAdmin(adminToken)) {
      Runtime.trap("Unauthorized");
    };
    ContentLib.updateEssayModule(essayModules, em);
  };

  public shared func deleteEssayModule(adminToken : Text, id : Text) : async () {
    if (not ContentLib.verifyAdmin(adminToken)) {
      Runtime.trap("Unauthorized");
    };
    ContentLib.deleteEssayModule(essayModules, id);
  };

  public shared func addEssayTopic(adminToken : Text, moduleId : Text, topic : Types.EssayTopic) : async () {
    if (not ContentLib.verifyAdmin(adminToken)) {
      Runtime.trap("Unauthorized");
    };
    ContentLib.addEssayTopic(essayModules, moduleId, topic);
  };

  public shared func deleteEssayTopic(adminToken : Text, moduleId : Text, topicId : Text) : async () {
    if (not ContentLib.verifyAdmin(adminToken)) {
      Runtime.trap("Unauthorized");
    };
    ContentLib.deleteEssayTopic(essayModules, moduleId, topicId);
  };
};
