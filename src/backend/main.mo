import Array "mo:core/Array";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Iter "mo:core/Iter";

actor {
  type Permission = {
    #student;
    #admin;
  };

  module Permission {
    public func compare(a : Permission, b : Permission) : Order.Order {
      switch (a, b) {
        case (#student, #admin) { #less };
        case (#admin, #student) { #greater };
        case (_) { #equal };
      };
    };
  };

  type QuestionInput = {
    questionText : Text;
    options : [Text];
    correctAnswer : Nat;
    explanation : Text;
    moduleCategory : Text;
  };

  type Question = {
    id : Nat;
    questionText : Text;
    options : [Text];
    correctAnswer : Nat;
    explanation : Text;
    moduleCategory : Text;
  };

  module Question {
    public func compare(a : Question, b : Question) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  type Module = {
    id : Nat;
    title : Text;
    description : Text;
    content : Text;
  };

  module Module {
    public func compare(a : Module, b : Module) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  type QuizAttempt = {
    score : Nat;
    totalQuestions : Nat;
    timestamp : Time.Time;
    moduleCategory : Text;
  };

  module QuizAttempt {
    public func compare(a : QuizAttempt, b : QuizAttempt) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  type User = {
    id : Principal;
    name : Text;
    permission : Permission;
  };

  module User {
    public func compare(a : User, b : User) : Order.Order {
      a.id.compare(b.id);
    };
  };

  let questions = Map.empty<Nat, Question>();
  let modules = Map.empty<Nat, Module>();
  let users = Map.empty<Principal, User>();
  let attempts = Map.empty<Principal, [QuizAttempt]>();

  var questionId = 0;
  var moduleId = 0;

  // Initialize with default student user for testing
  public shared ({ caller }) func initialize(name : Text) : async () {
    if (not users.containsKey(caller)) {
      let newUser : User = {
        id = caller;
        name;
        permission = #student;
      };
      users.add(caller, newUser);
    };
  };

  public query func getQuestions() : async [Question] {
    questions.values().toArray().sort();
  };

  public query func getModules() : async [Module] {
    modules.values().toArray().sort();
  };

  public query ({ caller }) func getQuizAttempts() : async [QuizAttempt] {
    switch (attempts.get(caller)) {
      case (null) { [] };
      case (?userAttempts) { userAttempts.sort() };
    };
  };

  public query func getTopScores() : async [Nat] {
    let scores = attempts.values().toArray().map(
      func(userAttempts) {
        var userTotalScore = 0;
        for (attempt in userAttempts.values()) {
          userTotalScore += attempt.score;
        };
        userTotalScore;
      }
    );
    scores.sort();
  };

  // Permission checks
  public shared ({ caller }) func isAdmin() : async Bool {
    switch (users.get(caller)) {
      case (null) { false };
      case (?user) { user.permission == #admin };
    };
  };

  func requireAdmin(caller : Principal) {
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User not found.") };
      case (?user) {
        if (user.permission != #admin) {
          Runtime.trap("Admin permission required.");
        };
      };
    };
  };

  // Internal Helper Functions
  public shared func getQuestion(questionId : Nat) : async Question {
    switch (questions.get(questionId)) {
      case (null) { Runtime.trap("Question does not exist.") };
      case (?question) { question };
    };
  };

  public shared func getModule(moduleId : Nat) : async Module {
    switch (modules.get(moduleId)) {
      case (null) { Runtime.trap("Module does not exist.") };
      case (?mod) { mod };
    };
  };

  // Question operations
  public shared ({ caller }) func addQuestion(input : QuestionInput) : async () {
    requireAdmin(caller);
    let validQuestion : Question = validateAndCreateQuestion(input);
    questions.add(questionId, validQuestion);
    questionId += 1;
  };

  public shared ({ caller }) func deleteQuestion(id : Nat) : async () {
    requireAdmin(caller);
    ignore getQuestion(id);
    questions.remove(id);
  };

  func validateAndCreateQuestion(input : QuestionInput) : Question {
    validateNonEmpty(input.questionText, "Question text");
    validateNonEmpty(input.explanation, "Explanation");

    if (input.options.size() < 2) {
      Runtime.trap("At least two options are required");
    };

    if (input.correctAnswer >= input.options.size()) {
      Runtime.trap("Invalid correct answer index");
    };

    {
      id = questionId;
      questionText = input.questionText;
      options = input.options;
      correctAnswer = input.correctAnswer;
      explanation = input.explanation;
      moduleCategory = input.moduleCategory;
    };
  };

  // Module operations
  public shared ({ caller }) func addModule(title : Text, description : Text, content : Text) : async () {
    requireAdmin(caller);
    validateNonEmpty(title, "Module title");
    validateNonEmpty(description, "Module description");
    validateNonEmpty(content, "Module content");

    let newModule : Module = {
      id = moduleId;
      title;
      description;
      content;
    };
    modules.add(moduleId, newModule);
    moduleId += 1;
  };

  public shared ({ caller }) func submitQuiz(score : Nat, totalQuestions : Nat, moduleCategory : Text) : async () {
    validateNonEmpty(moduleCategory, "Module category");

    let attempt = {
      score;
      totalQuestions;
      timestamp = Time.now();
      moduleCategory;
    };

    let userAttempts = switch (attempts.get(caller)) {
      case (null) { [attempt] };
      case (?existingAttempts) {
        existingAttempts.concat([attempt]);
      };
    };

    attempts.add(caller, userAttempts);
  };

  // Utilities
  func validateNonEmpty(value : Text, fieldName : Text) {
    if (value.trim(#char ' ').size() == 0) {
      Runtime.trap(fieldName.concat(" cannot be empty"));
    };
  };
};
