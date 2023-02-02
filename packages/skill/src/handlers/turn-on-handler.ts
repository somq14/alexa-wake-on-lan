import axios from "axios";
import { randomUUID } from "crypto";
import { z } from "zod";

import { Handler, Request, Response } from "../framework";
import { DeviceRepository } from "../repositories/device-repository";
import { UserRepository } from "../repositories/user-repository";
import { CognitoTokenService } from "../services/cognito-token-service";
import { LoginWithAmazonService } from "../services/login-with-amazon-service";

/**
 * https://developer.amazon.com/ja-JP/docs/alexa/device-apis/alexa-powercontroller.html#turnon-directive
 * https://developer.amazon.com/ja-JP/docs/alexa/device-apis/alexa-wakeonlancontroller.html#turnon-directive
 */
export class TurnOnHandler implements Handler {
  constructor(
    private readonly cognitoTokenService: CognitoTokenService,
    private readonly loginWithAmazonService: LoginWithAmazonService,
    private readonly userRepository: UserRepository,
    private readonly deviceRepository: DeviceRepository
  ) {}

  canHandle(req: Request): boolean {
    const { namespace, name } = req.directive.header;
    return namespace === "Alexa.PowerController" && name === "TurnOn";
  }

  async handle(req: Request): Promise<Response> {
    const endpoint = z
      .object({ scope: z.object({ token: z.string() }) })
      .parse(req.directive.endpoint);

    const { sub: userId } = this.cognitoTokenService.parseAccessToken(
      endpoint.scope.token
    );
    console.debug({ userId });

    const user = await this.userRepository.get(userId);
    if (user === undefined) {
      throw new Error("user is not found.");
    }
    console.debug({ user });

    const { refreshToken, accessToken } =
      await this.loginWithAmazonService.useRefreshToken(user.refreshToken);
    console.debug({ refreshToken, accessToken });

    await this.userRepository.put({
      ...user,
      refreshToken,
    });

    const devices = await this.deviceRepository.query(userId);
    const device = devices.find(
      (it) => it.deviceId === req.directive.endpoint?.endpointId
    );
    if (device === undefined) {
      throw new Error("device is not found.");
    }
    console.debug({ device });

    await this.sendDeferredResponse({
      accessToken,
      correlationToken: req.directive.header.correlationToken,
    });
    console.debug({ message: "DeferredResponse sent" });

    await this.sendWakeUp({
      accessToken,
      correlationToken: req.directive.header.correlationToken,
      deviceId: device.deviceId,
    });
    console.debug({ message: "WakeUp sent" });

    return {
      event: {
        header: {
          namespace: "Alexa",
          name: "Response",
          messageId: randomUUID(),
          correlationToken: req.directive.header.correlationToken,
          payloadVersion: "3",
        },
        endpoint: {
          scope: {
            type: "BearerToken",
            token: accessToken,
          },
          endpointId: device.deviceId,
        },
        payload: {},
      },
      context: {
        properties: [
          {
            namespace: "Alexa.PowerController",
            name: "powerState",
            value: "ON",
            timeOfSample: new Date().toISOString(),
            uncertaintyInMilliseconds: 500,
          },
        ],
      },
    };
  }

  async sendDeferredResponse(input: {
    accessToken: string;
    correlationToken: string | undefined;
  }) {
    const deferredResponse = {
      event: {
        header: {
          namespace: "Alexa",
          name: "DeferredResponse",
          messageId: randomUUID(),
          correlationToken: input.correlationToken,
          payloadVersion: "3",
        },
        payload: {
          estimatedDeferralInSeconds: 15,
        },
      },
    };

    await axios.post(
      "https://api.fe.amazonalexa.com/v3/events",
      deferredResponse,
      { headers: { Authorization: `Bearer ${input.accessToken}` } }
    );
  }

  async sendWakeUp(input: {
    accessToken: string;
    correlationToken: string | undefined;
    deviceId: string;
  }) {
    const wakeUp = {
      event: {
        header: {
          namespace: "Alexa.WakeOnLANController",
          name: "WakeUp",
          messageId: randomUUID(),
          correlationToken: input.correlationToken,
          payloadVersion: "3",
        },
        endpoint: {
          scope: {
            type: "BearerToken",
            token: input.accessToken,
          },
          endpointId: input.deviceId,
        },
        payload: {},
      },
      context: {
        properties: [
          {
            namespace: "Alexa.PowerController",
            name: "powerState",
            value: "OFF",
            timeOfSample: new Date().toISOString(),
            uncertaintyInMilliseconds: 500,
          },
        ],
      },
    };

    await axios.post("https://api.fe.amazonalexa.com/v3/events", wakeUp, {
      headers: { Authorization: `Bearer ${input.accessToken}` },
    });
  }
}
