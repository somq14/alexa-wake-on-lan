import * as cdk from "aws-cdk-lib";

import { AlexaWakeOnLanStack } from "./alexa-wake-on-lan-stack";

const app = new cdk.App();

new AlexaWakeOnLanStack(app, "AlexaWakeOnLan", {
  env: { region: "us-west-2" },
  hostedZoneId: process.env["HOSTED_ZONE_ID"]!,
  domainName: process.env["DOMAIN_NAME"]!,
  alexaSkillId: process.env["ALEXA_SKILL_ID"]!,
  alexaSkillClientId: process.env["ALEXA_SKILL_CLIENT_ID"]!,
  alexaSkillClientSecret: process.env["ALEXA_SKILL_CLIENT_SECRET"]!,
  alexaSkillCallbackURLs: process.env["ALEXA_SKILL_CALLBACK_URLS"]!.split(" "),
  loginWithAmazonClientId: process.env["LOGIN_WITH_AMAZON_CLIENT_ID"]!,
  loginWithAmazonClientSecret: process.env["LOGIN_WITH_AMAZON_CLIENT_SECRET"]!,
});
