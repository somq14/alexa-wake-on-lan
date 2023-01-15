import { Request, Response } from "./alexa";
import { Interceptor, InterceptorNext } from "./interceptor";

export class LoggingInterceptor implements Interceptor {
  async handle(req: Request, next: InterceptorNext): Promise<Response> {
    try {
      console.info(JSON.stringify({ req }));
      const res = await next(req);
      console.info(JSON.stringify({ req, res }));
      return res;
    } catch (err) {
      console.error(
        JSON.stringify({ req, err }, (key, value) =>
          value instanceof Error
            ? {
                ...value,
                name: value.name,
                message: value.message,
                stack: value.stack,
              }
            : value
        )
      );
      throw err;
    }
  }
}
