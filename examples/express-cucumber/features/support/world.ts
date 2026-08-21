import { setWorldConstructor, World } from "@cucumber/cucumber";
import type { Response } from "supertest";

export class CustomWorld extends World {
  response?: Response;
}

setWorldConstructor(CustomWorld);
