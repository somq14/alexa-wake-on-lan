import * as cdk from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";

import { Construct } from "constructs";

export class CognitoConstruct extends Construct {
  userPool: cognito.UserPool;
  userPoolDomain: cognito.UserPoolDomain;
  alexaClient: cognito.UserPoolClient;
  webClient: cognito.UserPoolClient;

  constructor(
    scope: Construct,
    id: string,
    props: {
      loginWithAmazonClientId: string;
      loginWithAmazonClientSecret: string;
      alexaSkillCallbackURLs: string[];
      webCallbackURL: string;
      hostedZone: route53.IHostedZone;
      domainName: string;
      certificate: acm.ICertificate;
    }
  ) {
    super(scope, id);

    this.userPool = new cognito.UserPool(this, "UserPool", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const loginWithAmazonIdentityProvider =
      new cognito.UserPoolIdentityProviderAmazon(this, "LoginWithAmazon", {
        userPool: this.userPool,
        clientId: props.loginWithAmazonClientId,
        clientSecret: props.loginWithAmazonClientSecret,
        scopes: ["profile:user_id"],
      });

    this.userPoolDomain = this.userPool.addDomain("HostedUI", {
      customDomain: {
        certificate: props.certificate,
        domainName: props.domainName,
      },
    });
    new route53.ARecord(this, "DNSRecord", {
      zone: props.hostedZone,
      recordName: "auth",
      target: route53.RecordTarget.fromAlias(
        new route53Targets.UserPoolDomainTarget(this.userPoolDomain)
      ),
    });

    this.alexaClient = this.userPool.addClient("AlexaClient", {
      generateSecret: true,
      oAuth: {
        flows: { authorizationCodeGrant: true },
        callbackUrls: props.alexaSkillCallbackURLs,
        scopes: [cognito.OAuthScope.OPENID],
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.AMAZON,
      ],
    });
    this.alexaClient.node.addDependency(loginWithAmazonIdentityProvider);

    this.webClient = this.userPool.addClient("WebClient", {
      oAuth: {
        flows: { authorizationCodeGrant: true },
        callbackUrls: [props.webCallbackURL],
        logoutUrls: [props.webCallbackURL],
        scopes: [cognito.OAuthScope.OPENID],
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.AMAZON,
      ],
    });
    this.webClient.node.addDependency(loginWithAmazonIdentityProvider);
  }
}
