// Stub hooks — AdminPage.tsx is replaced by the newer ContentManagerPage/AdminDashboardPage.
// These stubs exist only to satisfy the import without runtime errors.
import { useMutation, useQuery } from "@tanstack/react-query";

export interface Question {
  id: number;
  questionText: string;
  moduleCategory: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Module {
  id: number;
  title: string;
  description: string;
}

export function useGetQuestions() {
  return useQuery<Question[]>({
    queryKey: ["questions"],
    queryFn: async () => [],
  });
}

export function useGetModules() {
  return useQuery<Module[]>({ queryKey: ["modules"], queryFn: async () => [] });
}

export function useAddQuestion() {
  return useMutation({ mutationFn: async (_input: unknown) => {} });
}

export function useAddModule() {
  return useMutation({ mutationFn: async (_input: unknown) => {} });
}

export function useDeleteQuestion() {
  return useMutation({ mutationFn: async (_id: unknown) => {} });
}
