import { setWorldConstructor, World } from "@cucumber/cucumber";
import type { Express } from "express";
import type { Response } from "supertest";

export class CustomWorld extends World {
  app?: Express;
  currentDate = new Date();
  todoIds = new Map<string, string>();
  response?: Response;
}

setWorldConstructor(CustomWorld);
