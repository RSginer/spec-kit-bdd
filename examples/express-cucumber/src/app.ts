import express, { Express } from "express";
import { createTodoRouter } from "./routes/todos";
import { TodoService } from "./services/todo-service";

export interface AppOptions {
  currentDate?: () => Date;
}

export function createApp(options: AppOptions = {}): Express {
  const app = express();
  app.use(express.json());

  const todoService = new TodoService(options.currentDate);

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/todos", createTodoRouter(todoService));

  return app;
}
