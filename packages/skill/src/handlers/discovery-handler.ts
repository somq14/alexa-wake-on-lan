import { randomUUID } from "crypto";
import { z } from "zod";

import { Handler, JsonObject, Request, Response } from "../framework";
import { DeviceRepository } from "../repositories/device-repository";
import { CognitoTokenService } from "../services/cognito-token-service";

/**
 * https://developer.amazon.com/ja-JP/docs/alexa/device-apis/alexa-discovery.html
 * https://developer.amazon.com/ja-JP/docs/alexa/device-apis/alexa-wakeonlancontroller.html
 */
export class DiscoveryHandler implements Handler {
  constructor(
    private readonly cognitoTokenService: CognitoTokenService,
    private readonly deviceRepository: DeviceRepository
  ) {}

  canHandle(req: Request): boolean {
    const { namespace, name } = req.directive.header;
    return namespace === "Alexa.Discovery" && name === "Discover";
  }

  async handle(req: Request): Promise<Response> {
    const payload = z
      .object({ scope: z.object({ token: z.string() }) })
      .parse(req.directive.payload);

    const { sub: userId } = this.cognitoTokenService.parseAccessToken(
      payload.scope.token
    );
    console.debug({ userId });

    const devices = await this.deviceRepository.query(userId);
    console.debug({ devices });

    const endpoints = devices.map((device) => ({
      endpointId: device.deviceId,
      manufacturerName: "アレクサ、パソコンつけて",
      description: `MACアドレス: ${device.macAddress}  メモ: ${
        device.description ?? "メモはありません"
      }`,
      friendlyName: device.name,
      displayCategories: ["COMPUTER"],
      cookie: {},
      capabilities: [
        {
          type: "AlexaInterface",
          interface: "Alexa",
          version: "3",
        } as JsonObject,
        {
          type: "AlexaInterface",
          interface: "Alexa.PowerController",
          version: "3",
          properties: {
            supported: [{ name: "powerState" }],
            proactivelyReported: false,
            retrievable: false,
          },
        },
        {
          type: "AlexaInterface",
          interface: "Alexa.WakeOnLANController",
          version: "3",
          properties: {},
          configuration: {
            MACAddresses: [device.macAddress],
          },
        },
      ],
    }));

    return {
      event: {
        header: {
          namespace: "Alexa.Discovery",
          name: "Discover.Response",
          messageId: randomUUID(),
          payloadVersion: "3",
        },
        payload: {
          endpoints,
        },
      },
    };
  }
}
