import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface QuestionInput {
    explanation: string;
    correctAnswer: bigint;
    questionText: string;
    moduleCategory: string;
    options: Array<string>;
}
export type Time = bigint;
export interface Question {
    id: bigint;
    explanation: string;
    correctAnswer: bigint;
    questionText: string;
    moduleCategory: string;
    options: Array<string>;
}
export interface QuizAttempt {
    score: bigint;
    totalQuestions: bigint;
    moduleCategory: string;
    timestamp: Time;
}
export interface Module {
    id: bigint;
    title: string;
    content: string;
    description: string;
}
export interface backendInterface {
    addModule(title: string, description: string, content: string): Promise<void>;
    addQuestion(input: QuestionInput): Promise<void>;
    deleteQuestion(id: bigint): Promise<void>;
    getModule(moduleId: bigint): Promise<Module>;
    getModules(): Promise<Array<Module>>;
    getQuestion(questionId: bigint): Promise<Question>;
    getQuestions(): Promise<Array<Question>>;
    getQuizAttempts(): Promise<Array<QuizAttempt>>;
    getTopScores(): Promise<Array<bigint>>;
    initialize(name: string): Promise<void>;
    isAdmin(): Promise<boolean>;
    submitQuiz(score: bigint, totalQuestions: bigint, moduleCategory: string): Promise<void>;
}
