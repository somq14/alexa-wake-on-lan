import { Request, Response } from "./alexa";

export interface Handler {
  canHandle(req: Request): boolean;
  handle(req: Request): Promise<Response>;
}
