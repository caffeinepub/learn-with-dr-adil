import Map "mo:core/Map";
import Types "../types/content";

module {
  let ADMIN_TOKEN : Text = "Tesla369";

  // ── Admin auth ────────────────────────────────────────────────────────────

  public func verifyAdmin(token : Text) : Bool {
    token == ADMIN_TOKEN;
  };

  // ── Subjects ─────────────────────────────────────────────────────────────

  public func getSubjects(subjects : Map.Map<Text, Types.Subject>) : [Types.Subject] {
    subjects.values().toArray();
  };

  public func addSubject(subjects : Map.Map<Text, Types.Subject>, subject : Types.Subject) : () {
    subjects.add(subject.id, subject);
  };

  public func updateSubject(subjects : Map.Map<Text, Types.Subject>, subject : Types.Subject) : () {
    subjects.add(subject.id, subject);
  };

  public func deleteSubject(subjects : Map.Map<Text, Types.Subject>, id : Text) : () {
    subjects.remove(id);
  };

  // ── Modules ───────────────────────────────────────────────────────────────

  public func getModules(modules : Map.Map<Text, Types.Module>) : [Types.Module] {
    modules.values().toArray();
  };

  public func getModulesBySubject(modules : Map.Map<Text, Types.Module>, subjectId : Text) : [Types.Module] {
    let sid = subjectId;
    let all : [Types.Module] = modules.values().toArray();
    all.filter(func x = x.subjectId == sid);
  };

  public func addModule(modules : Map.Map<Text, Types.Module>, mod : Types.Module) : () {
    modules.add(mod.id, mod);
  };

  public func updateModule(modules : Map.Map<Text, Types.Module>, mod : Types.Module) : () {
    modules.add(mod.id, mod);
  };

  public func deleteModule(modules : Map.Map<Text, Types.Module>, id : Text) : () {
    modules.remove(id);
  };

  // ── MCQs ──────────────────────────────────────────────────────────────────

  public func getMCQs(mcqs : Map.Map<Text, Types.MCQ>) : [Types.MCQ] {
    mcqs.values().toArray();
  };

  public func getMCQsBySubject(mcqs : Map.Map<Text, Types.MCQ>, subjectId : Text) : [Types.MCQ] {
    let sid = subjectId;
    let all : [Types.MCQ] = mcqs.values().toArray();
    all.filter(func x = x.subjectId == sid);
  };

  public func addMCQ(mcqs : Map.Map<Text, Types.MCQ>, mcq : Types.MCQ) : () {
    mcqs.add(mcq.id, mcq);
  };

  public func updateMCQ(mcqs : Map.Map<Text, Types.MCQ>, mcq : Types.MCQ) : () {
    mcqs.add(mcq.id, mcq);
  };

  public func deleteMCQ(mcqs : Map.Map<Text, Types.MCQ>, id : Text) : () {
    mcqs.remove(id);
  };

  // ── Essay Modules ─────────────────────────────────────────────────────────

  public func getEssayModules(essayModules : Map.Map<Text, Types.EssayModule>) : [Types.EssayModule] {
    essayModules.values().toArray();
  };

  public func getEssayModulesByType(essayModules : Map.Map<Text, Types.EssayModule>, moduleType : Text) : [Types.EssayModule] {
    let mtype = moduleType;
    let all : [Types.EssayModule] = essayModules.values().toArray();
    all.filter(func x = x.moduleType == mtype);
  };

  public func addEssayModule(essayModules : Map.Map<Text, Types.EssayModule>, em : Types.EssayModule) : () {
    essayModules.add(em.id, em);
  };

  public func updateEssayModule(essayModules : Map.Map<Text, Types.EssayModule>, em : Types.EssayModule) : () {
    essayModules.add(em.id, em);
  };

  public func deleteEssayModule(essayModules : Map.Map<Text, Types.EssayModule>, id : Text) : () {
    essayModules.remove(id);
  };

  public func addEssayTopic(essayModules : Map.Map<Text, Types.EssayModule>, moduleId : Text, topic : Types.EssayTopic) : () {
    switch (essayModules.get(moduleId)) {
      case null {};
      case (?em) {
        let updatedTopics = em.topics.concat([topic]);
        essayModules.add(moduleId, { em with topics = updatedTopics });
      };
    };
  };

  public func deleteEssayTopic(essayModules : Map.Map<Text, Types.EssayModule>, moduleId : Text, topicId : Text) : () {
    switch (essayModules.get(moduleId)) {
      case null {};
      case (?em) {
        let tid = topicId;
        let updatedTopics = em.topics.filter(func x = x.id != tid);
        essayModules.add(moduleId, { em with topics = updatedTopics });
      };
    };
  };

  public func updateEssayTopicTitle(essayModules : Map.Map<Text, Types.EssayModule>, moduleId : Text, topicId : Text, newTitle : Text) : () {
    switch (essayModules.get(moduleId)) {
      case null {};
      case (?em) {
        let tid = topicId;
        let updatedTopics = em.topics.map(
          func(t) {
            if (t.id == tid) { { t with title = newTitle } } else { t }
          }
        );
        essayModules.add(moduleId, { em with topics = updatedTopics });
      };
    };
  };

  public func reorderEssayTopics(essayModules : Map.Map<Text, Types.EssayModule>, moduleId : Text, topicIds : [Text]) : () {
    switch (essayModules.get(moduleId)) {
      case null {};
      case (?em) {
        // Build ordered list: first topics matching topicIds in order, then any remaining
        let ordered = topicIds.map(
          func(tid) { em.topics.find(func(t) { t.id == tid }) }
        );
        var result : [Types.EssayTopic] = [];
        for (opt in ordered.vals()) {
          switch (opt) {
            case (?t) { result := result.concat([t]) };
            case null {};
          };
        };
        // Append topics not in the provided list
        let remaining = em.topics.filter(func(t) {
          topicIds.find(func(tid) { tid == t.id }) == null
        });
        result := result.concat(remaining);
        essayModules.add(moduleId, { em with topics = result });
      };
    };
  };
};
