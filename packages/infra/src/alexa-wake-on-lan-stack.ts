import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

import { AppSyncConstruct } from "./app-sync-construct";
import { CognitoConstruct } from "./cognito-construct";
import { LambdaConstruct } from "./lambda-construct";
import { WebConstruct } from "./web-construct";

export type AlexaWakeOnLanStackProps = {
  hostedZoneId: string;
  domainName: string;
  alexaSkillId: string;
  alexaSkillClientId: string;
  alexaSkillClientSecret: string;
  alexaSkillCallbackURLs: string[];
  loginWithAmazonClientId: string;
  loginWithAmazonClientSecret: string;
};

export class AlexaWakeOnLanStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: cdk.StackProps & AlexaWakeOnLanStackProps
  ) {
    super(scope, id, props);

    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      "HostedZone",
      {
        hostedZoneId: props.hostedZoneId,
        zoneName: props.domainName,
      }
    );

    const certificate = new acm.DnsValidatedCertificate(this, "Certificate", {
      region: "us-east-1",
      hostedZone,
      domainName: props.domainName,
      subjectAlternativeNames: [`*.${props.domainName}`],
    });

    const table = new dynamodb.Table(this, "Table", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
        name: "pk",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "sk",
        type: dynamodb.AttributeType.STRING,
      },
      timeToLiveAttribute: "ttl",
      pointInTimeRecovery: true,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    new WebConstruct(this, "Web", {
      hostedZone,
      domainName: props.domainName,
      certificate,
    });

    const cognito = new CognitoConstruct(this, "Cognito", {
      alexaSkillCallbackURLs: props.alexaSkillCallbackURLs,
      loginWithAmazonClientId: props.loginWithAmazonClientId,
      loginWithAmazonClientSecret: props.loginWithAmazonClientSecret,
      webCallbackURL: `https://${props.domainName}`,
      hostedZone,
      domainName: `auth.${props.domainName}`,
      certificate,
    });

    const lambda = new LambdaConstruct(this, "Lambda", {
      alexaSkillId: props.alexaSkillId,
      alexaSkillClientId: props.alexaSkillClientId,
      alexaSkillClientSecret: props.alexaSkillClientSecret,
      tableArn: table.tableArn,
      tableName: table.tableName,
    });

    new AppSyncConstruct(this, "AppSync", {
      hostedZone,
      domainName: `api.${props.domainName}`,
      certificate,
      userPool: cognito.userPool,
      userPoolClientId: cognito.webClient.userPoolClientId,
      table,
    });

    new cdk.CfnOutput(this, "LoginWithAmazonAllowedOrigins", {
      value: `https://${cognito.userPoolDomain.baseUrl()}`,
      description: "LoginWithAmazon > Web Settings > Allowed Origins",
    });
    new cdk.CfnOutput(this, "LoginWithAmazonAllowedReturnURLs", {
      value: `https://${cognito.userPoolDomain.baseUrl()}/oauth2/idpresponse`,
      description: "LoginWithAmazon > Web Settings > Allowed Return URLs",
    });

    new cdk.CfnOutput(this, "AlexaDefaultEndpoint", {
      value: lambda.func.functionArn,
      description: "Alexa > SMART HOME > Default Endpoint",
    });
    new cdk.CfnOutput(this, "AlexaYourWebAuthorizationURI", {
      value: `https://${cognito.userPoolDomain.baseUrl()}/oauth2/authorize`,
      description: "Alexa > ACCOUNT LINKING > Your Web Authorization URI",
    });
    new cdk.CfnOutput(this, "AlexaYourWebAccessTokenURI", {
      value: `https://${cognito.userPoolDomain.baseUrl()}/oauth2/token`,
      description: "Alexa > ACCOUNT LINKING > Access Token URI",
    });
    new cdk.CfnOutput(this, "AlexaYourClientId", {
      value: cognito.alexaClient.userPoolClientId,
      description: "Alexa > ACCOUNT LINKING > Your Client ID",
    });
    new cdk.CfnOutput(this, "AlexaYourClientSecret", {
      value: cognito.alexaClient.userPoolClientSecret.toString(),
      description: "Alexa > ACCOUNT LINKING > Your Secret",
    });
  }
}
