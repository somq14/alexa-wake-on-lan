import { randomUUID } from "crypto";

import { Request, Response } from "./alexa";
import { Interceptor, InterceptorNext } from "./interceptor";

export class ErrorInterceptor implements Interceptor {
  async handle(req: Request, next: InterceptorNext): Promise<Response> {
    try {
      return await next(req);
    } catch (err) {
      return {
        event: {
          header: {
            namespace: "Alexa",
            name: "ErrorResponse",
            messageId: randomUUID(),
            payloadVersion: "3",
          },
          endpoint:
            req?.directive?.endpoint !== undefined
              ? { endpointId: req.directive.endpoint.endpointId }
              : undefined,
          payload: {
            type: "INTERNAL_ERROR",
            message: "An unexpected error has occurred.",
          },
        },
      };
    }
  }
}
