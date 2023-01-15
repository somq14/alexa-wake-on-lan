import { randomUUID } from "crypto";
import { z } from "zod";

import { Handler, Request, Response } from "../framework";
import { UserRepository } from "../repositories/user-repository";
import { CognitoTokenService } from "../services/cognito-token-service";
import { LoginWithAmazonService } from "../services/login-with-amazon-service";

/**
 * https://developer.amazon.com/ja-JP/docs/alexa/device-apis/alexa-authorization.html
 */
export class AuthorizeHandler implements Handler {
  constructor(
    private readonly cognitoTokenService: CognitoTokenService,
    private readonly loginWithAmazonService: LoginWithAmazonService,
    private readonly userRepository: UserRepository
  ) {}

  canHandle(req: Request): boolean {
    const { namespace, name } = req.directive.header;
    return namespace === "Alexa.Authorization" && name === "AcceptGrant";
  }

  async handle(req: Request): Promise<Response> {
    const payload = z
      .object({
        grantee: z.object({ token: z.string() }),
        grant: z.object({ code: z.string() }),
      })
      .parse(req.directive.payload);

    const { sub: userId } = this.cognitoTokenService.parseAccessToken(
      payload.grantee.token
    );
    console.debug({ userId });

    const { refreshToken } =
      await this.loginWithAmazonService.useAuthorizationCode(
        payload.grant.code
      );

    const user = {
      userId,
      refreshToken,
    };
    await this.userRepository.put(user);
    console.debug({ user });

    return {
      event: {
        header: {
          namespace: "Alexa.Authorization",
          name: "AcceptGrant.Response",
          messageId: randomUUID(),
          payloadVersion: "3",
        },
        payload: {},
      },
    };
  }
}
