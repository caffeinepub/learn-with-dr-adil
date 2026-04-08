import Common "common";

module {
  public type Id = Common.Id;

  // Subject: top-level grouping for modules and MCQs
  public type Subject = {
    id : Id;
    name : Text;
    icon : Text;
    color : Text;
  };

  // Module: belongs to a subject
  public type Module = {
    id : Id;
    subjectId : Id;
    title : Text;
    description : Text;
    status : Text; // e.g. "active", "draft"
  };

  // MCQ: multiple-choice question tied to subject (and optionally module)
  public type MCQ = {
    id : Id;
    subjectId : Id;
    moduleId : Id;
    question : Text;
    optionA : Text;
    optionB : Text;
    optionC : Text;
    optionD : Text;
    correctAnswer : Text; // "A" | "B" | "C" | "D"
    explanation : Text;
  };

  // EssayTopic: a topic within an essay module
  public type EssayTopic = {
    id : Id;
    title : Text;
  };

  // EssayModule: a module grouping for PYQ essays / short essays / short notes
  public type EssayModule = {
    id : Id;
    moduleType : Text; // "essay" | "shortEssay" | "shortNote"
    title : Text;
    topics : [EssayTopic];
  };
};
