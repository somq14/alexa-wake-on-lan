import { Request, Response } from "./alexa";

export type InterceptorNext = (directive: Request) => Promise<Response>;
export interface Interceptor {
  handle(req: Request, next: InterceptorNext): Promise<Response>;
}
