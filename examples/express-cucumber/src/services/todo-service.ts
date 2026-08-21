import type {
  CompletionState,
  CreateTodoInput,
  Todo,
  UpdateCompletionInput,
  UpdateTodoInput,
} from "../models/todo";

type CurrentDate = () => Date;

export class TodoValidationError extends Error {}

export class TodoNotFoundError extends Error {}

export class TodoService {
  private readonly todos: Todo[] = [];
  private nextId = 1;

  constructor(private readonly currentDate: CurrentDate = () => new Date()) {}

  create(input: CreateTodoInput): Todo {
    const title = validateTitle(input.title);
    const plannedDate = validatePlannedDate(
      input.plannedDate,
      this.currentDate(),
    );
    const todo: Todo = {
      id: `todo-${this.nextId++}`,
      title,
      plannedDate,
      completionState: "incomplete",
    };

    this.todos.push(todo);
    return { ...todo };
  }

  listCurrentWeek(): Todo[] {
    const { start, end } = currentWeek(this.currentDate());
    return this.todos
      .filter((todo) => todo.plannedDate >= start && todo.plannedDate <= end)
      .map((todo) => ({ ...todo }));
  }

  findById(id: string): Todo {
    const todo = this.todos.find((candidate) => candidate.id === id);
    if (!todo) {
      throw new TodoNotFoundError("Todo not found");
    }
    return todo;
  }

  update(id: string, input: UpdateTodoInput): Todo {
    const todo = this.findById(id);
    const title = validateTitle(input.title);
    const plannedDate = validatePlannedDate(
      input.plannedDate,
      this.currentDate(),
    );
    todo.title = title;
    todo.plannedDate = plannedDate;
    return { ...todo };
  }

  updateCompletion(id: string, input: UpdateCompletionInput): Todo {
    const todo = this.findById(id);
    if (!isCompletionState(input.completionState)) {
      throw new TodoValidationError("Invalid completion state");
    }
    todo.completionState = input.completionState;
    return { ...todo };
  }

  remove(id: string): void {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index === -1) {
      throw new TodoNotFoundError("Todo not found");
    }
    this.todos.splice(index, 1);
  }
}

function validateTitle(value: unknown): string {
  if (typeof value !== "string") {
    throw new TodoValidationError("Invalid todo title");
  }
  const title = value.trim();
  if (title.length === 0 || title.length > 200) {
    throw new TodoValidationError("Invalid todo title");
  }
  return title;
}

function validatePlannedDate(value: unknown, currentDate: Date): string {
  if (typeof value !== "string" || !isIsoDate(value)) {
    throw new TodoValidationError("Invalid planned date");
  }
  const { start, end } = currentWeek(currentDate);
  if (value < start || value > end) {
    throw new TodoValidationError("Invalid planned date");
  }
  return value;
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime()) && toDateString(date) === value;
}

function isCompletionState(value: unknown): value is CompletionState {
  return value === "incomplete" || value === "complete";
}

function currentWeek(date: Date): { start: string; end: string } {
  const localDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const day = localDate.getDay();
  const daysSinceMonday = (day + 6) % 7;
  const start = new Date(localDate);
  start.setDate(localDate.getDate() - daysSinceMonday);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start: toDateString(start), end: toDateString(end) };
}

function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
