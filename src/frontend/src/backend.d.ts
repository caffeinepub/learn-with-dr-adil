import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MCQ {
    id: Id;
    moduleId: Id;
    question: string;
    explanation: string;
    correctAnswer: string;
    subjectId: Id;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
}
export interface EssayModule {
    id: Id;
    title: string;
    moduleType: string;
    topics: Array<EssayTopic>;
}
export interface EssayTopic {
    id: Id;
    title: string;
}
export interface Subject {
    id: Id;
    icon: string;
    name: string;
    color: string;
}
export interface Module {
    id: Id;
    status: string;
    title: string;
    description: string;
    subjectId: Id;
}
export type Id = string;
export interface backendInterface {
    addEssayModule(adminToken: string, em: EssayModule): Promise<void>;
    addEssayTopic(adminToken: string, moduleId: string, topic: EssayTopic): Promise<void>;
    addMCQ(adminToken: string, mcq: MCQ): Promise<void>;
    addModule(adminToken: string, mod: Module): Promise<void>;
    addSubject(adminToken: string, subject: Subject): Promise<void>;
    deleteEssayModule(adminToken: string, id: string): Promise<void>;
    deleteEssayTopic(adminToken: string, moduleId: string, topicId: string): Promise<void>;
    deleteMCQ(adminToken: string, id: string): Promise<void>;
    deleteModule(adminToken: string, id: string): Promise<void>;
    deleteSubject(adminToken: string, id: string): Promise<void>;
    getEssayModules(): Promise<Array<EssayModule>>;
    getEssayModulesByType(moduleType: string): Promise<Array<EssayModule>>;
    getMCQs(): Promise<Array<MCQ>>;
    getMCQsBySubject(subjectId: string): Promise<Array<MCQ>>;
    getModules(): Promise<Array<Module>>;
    getModulesBySubject(subjectId: string): Promise<Array<Module>>;
    getSubjects(): Promise<Array<Subject>>;
    updateEssayModule(adminToken: string, em: EssayModule): Promise<void>;
    updateMCQ(adminToken: string, mcq: MCQ): Promise<void>;
    updateModule(adminToken: string, mod: Module): Promise<void>;
    updateSubject(adminToken: string, subject: Subject): Promise<void>;
}
