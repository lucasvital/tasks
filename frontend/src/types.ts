// src/types.ts
export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "to-do" | "in-progress" | "done";
  dueDate: string; // Ou Date, dependendo do formato que você retorna da API
  userId: string;
}
