import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import path from "path";

export type LambdaConstructProps = {
  alexaSkillId: string;
  alexaSkillClientId: string;
  alexaSkillClientSecret: string;
  tableArn: string;
  tableName: string;
};

export class LambdaConstruct extends Construct {
  func: lambda.Function;

  constructor(scope: Construct, id: string, props: LambdaConstructProps) {
    super(scope, id);

    this.func = new lambda.Function(this, "Function", {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset(
        path.resolve(__dirname, "..", "..", "skill", "dist")
      ),
      handler: "index.handler",
      environment: {
        ALEXA_CLIENT_ID: props.alexaSkillClientId,
        ALEXA_CLIENT_SECRET: props.alexaSkillClientSecret,
        DYNAMODB_TABLE_NAME: props.tableName,
      },
    });

    this.func.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          "dynamodb:GetItem",
          "dynamodb:DeleteItem",
          "dynamodb:PutItem",
          "dynamodb:Scan",
          "dynamodb:Query",
          "dynamodb:UpdateItem",
          "dynamodb:BatchWriteItem",
          "dynamodb:BatchGetItem",
          "dynamodb:DescribeTable",
          "dynamodb:ConditionCheckItem",
        ],
        resources: [props.tableArn, `${props.tableArn}/index/*`],
      })
    );

    this.func.addPermission("AlexaPermission", {
      principal: new iam.ServicePrincipal("alexa-connectedhome.amazon.com"),
      action: "lambda:InvokeFunction",
      eventSourceToken: props.alexaSkillId,
    });
  }
}
