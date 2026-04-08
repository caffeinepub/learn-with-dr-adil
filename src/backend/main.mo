import Map "mo:core/Map";
import Types "types/content";
import ContentMixin "mixins/content-api";



actor {
  let subjects = Map.empty<Text, Types.Subject>();
  let modules = Map.empty<Text, Types.Module>();
  let mcqs = Map.empty<Text, Types.MCQ>();
  let essayModules = Map.empty<Text, Types.EssayModule>();

  include ContentMixin(subjects, modules, mcqs, essayModules);
};
