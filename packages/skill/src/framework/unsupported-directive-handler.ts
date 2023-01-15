import { randomUUID } from "crypto";

import { Request, Response } from "./alexa";
import { Handler } from "./handler";

export class UnsupportedDirectiveHandler implements Handler {
  canHandle(): boolean {
    return true;
  }

  async handle(req: Request): Promise<Response> {
    return {
      event: {
        header: {
          namespace: "Alexa",
          name: "ErrorResponse",
          messageId: randomUUID(),
          payloadVersion: "3",
        },
        endpoint:
          req.directive.endpoint !== undefined
            ? { endpointId: req.directive.endpoint.endpointId }
            : undefined,
        payload: {
          type: "INVALID_DIRECTIVE",
          message: "This directive is not supported.",
        },
      },
    };
  }
}
