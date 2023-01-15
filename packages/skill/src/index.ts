import "source-map-support/register";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import axios from "axios";

import {
  buildLambdaHandler,
  ErrorInterceptor,
  UnsupportedDirectiveHandler,
  LoggingInterceptor,
} from "./framework";
import { AuthorizeHandler } from "./handlers/authorize-handler";
import { DiscoveryHandler } from "./handlers/discovery-handler";
import { TurnOnHandler } from "./handlers/turn-on-handler";
import { DeviceRepository } from "./repositories/device-repository";
import { UserRepository } from "./repositories/user-repository";
import { CognitoTokenService } from "./services/cognito-token-service";
import { LoginWithAmazonService } from "./services/login-with-amazon-service";

const ALEXA_CLIENT_ID = process.env["ALEXA_CLIENT_ID"];
if (ALEXA_CLIENT_ID === undefined) {
  throw new Error("ALEXA_CLIENT_ID is not defined.");
}

const ALEXA_CLIENT_SECRET = process.env["ALEXA_CLIENT_SECRET"];
if (ALEXA_CLIENT_SECRET === undefined) {
  throw new Error("ALEXA_CLIENT_SECRET is not defined.");
}

const DYNAMODB_TABLE_NAME = process.env["DYNAMODB_TABLE_NAME"];
if (DYNAMODB_TABLE_NAME === undefined) {
  throw new Error("DYNAMODB_TABLE_NAME is not defined.");
}

const loginWithAmazonService = new LoginWithAmazonService(
  axios.create({ timeout: 5000 }),
  ALEXA_CLIENT_ID,
  ALEXA_CLIENT_SECRET
);

const cognitoTokenService = new CognitoTokenService();

const dynamodbClient = new DynamoDBClient({});
const userRepository = new UserRepository(dynamodbClient, DYNAMODB_TABLE_NAME);
const deviceRepository = new DeviceRepository(
  dynamodbClient,
  DYNAMODB_TABLE_NAME
);

export const handler = buildLambdaHandler({
  handlers: [
    new AuthorizeHandler(
      cognitoTokenService,
      loginWithAmazonService,
      userRepository
    ),
    new DiscoveryHandler(cognitoTokenService, deviceRepository),
    new TurnOnHandler(
      cognitoTokenService,
      loginWithAmazonService,
      userRepository,
      deviceRepository
    ),
    new UnsupportedDirectiveHandler(),
  ],
  interceptors: [new ErrorInterceptor(), new LoggingInterceptor()],
});
