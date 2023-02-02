import { z } from "zod";

import { parseJSON } from "../framework";

export type CognitoAccessToken = {
  sub: string;
};

export class CognitoTokenService {
  parseAccessToken(token: string): CognitoAccessToken {
    const [, payloadBase64] = token.split(".");
    if (payloadBase64 === undefined) {
      throw new Error("token must be JWT.");
    }
    const payloadString = Buffer.from(payloadBase64, "base64").toString();
    const payloadJson = parseJSON(payloadString);
    const payload = z.object({ sub: z.string() }).parse(payloadJson);
    return { sub: payload.sub };
  }
}
