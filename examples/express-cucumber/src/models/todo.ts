export type CompletionState = "incomplete" | "complete";

export interface Todo {
  id: string;
  title: string;
  plannedDate: string;
  completionState: CompletionState;
}

export interface CreateTodoInput {
  title: unknown;
  plannedDate: unknown;
}

export interface UpdateTodoInput {
  title: unknown;
  plannedDate: unknown;
}

export interface UpdateCompletionInput {
  completionState: unknown;
}
