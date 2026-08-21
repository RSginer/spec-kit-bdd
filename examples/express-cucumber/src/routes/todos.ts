import { Router } from "express";
import type {
  CreateTodoInput,
  UpdateCompletionInput,
  UpdateTodoInput,
} from "../models/todo";
import {
  TodoNotFoundError,
  TodoService,
  TodoValidationError,
} from "../services/todo-service";

export function createTodoRouter(todoService: TodoService): Router {
  const router = Router();

  router.post("/", (req, res) => {
    try {
      const todo = todoService.create(req.body as CreateTodoInput);
      res.status(201).json(todo);
    } catch (error) {
      sendError(res, error);
    }
  });

  router.get("/", (_req, res) => {
    res.status(200).json(todoService.listCurrentWeek());
  });

  router.put("/:id", (req, res) => {
    try {
      const todo = todoService.update(
        req.params.id,
        req.body as UpdateTodoInput,
      );
      res.status(200).json(todo);
    } catch (error) {
      sendError(res, error);
    }
  });

  router.patch("/:id", (req, res) => {
    try {
      const todo = todoService.updateCompletion(
        req.params.id,
        req.body as UpdateCompletionInput,
      );
      res.status(200).json(todo);
    } catch (error) {
      sendError(res, error);
    }
  });

  router.delete("/:id", (req, res) => {
    try {
      todoService.remove(req.params.id);
      res.status(204).send();
    } catch (error) {
      sendError(res, error);
    }
  });

  return router;
}

function sendError(
  response: Parameters<Parameters<Router["post"]>[1]>[1],
  error: unknown,
): void {
  if (error instanceof TodoNotFoundError) {
    response.status(404).json({ error: error.message });
    return;
  }
  if (error instanceof TodoValidationError) {
    response.status(400).json({ error: error.message });
    return;
  }
  response.status(500).json({ error: "Internal server error" });
}
