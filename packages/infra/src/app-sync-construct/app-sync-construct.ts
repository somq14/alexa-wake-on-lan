import { Stack } from "aws-cdk-lib";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as route53 from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";
import path from "path";

type AppSyncConstructProps = {
  hostedZone: route53.IHostedZone;
  domainName: string;
  certificate: acm.ICertificate;
  userPool: cognito.IUserPool;
  userPoolClientId: string;
  table: dynamodb.ITable;
};

export class AppSyncConstruct extends Construct {
  constructor(scope: Construct, id: string, props: AppSyncConstructProps) {
    super(scope, id);

    const api = new appsync.GraphqlApi(this, "Api", {
      name: `${Stack.of(this).stackName}Api`,
      schema: appsync.SchemaFile.fromAsset(
        path.resolve(__dirname, "api.graphql")
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: props.userPool,
            appIdClientRegex: props.userPoolClientId,
          },
        },
      },
      domainName: {
        domainName: props.domainName,
        certificate: props.certificate,
      },
    });
    new route53.CnameRecord(this, "DNSRecord", {
      zone: props.hostedZone,
      recordName: "api",
      domainName: api.appSyncDomainName,
    });

    const dataSource = new appsync.DynamoDbDataSource(this, "DataSource", {
      api,
      table: props.table,
    });

    const queryDeviceFunction = new appsync.AppsyncFunction(
      this,
      "QueryDeviceFunction",
      {
        api,
        name: "QueryDeviceFunction",
        dataSource,
        runtime: appsync.FunctionRuntime.JS_1_0_0,
        code: appsync.Code.fromAsset(
          path.resolve(__dirname, "src", "query-device.js")
        ),
      }
    );

    api.createResolver("QueryDeviceResolver", {
      typeName: "Query",
      fieldName: "devices",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset(
        path.resolve(__dirname, "src", "pass-through.js")
      ),
      pipelineConfig: [queryDeviceFunction],
    });

    api.createResolver("GetDeviceResolver", {
      typeName: "Query",
      fieldName: "device",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset(
        path.resolve(__dirname, "src", "pass-through.js")
      ),
      pipelineConfig: [
        new appsync.AppsyncFunction(this, "GetDeviceFunction", {
          api,
          name: "GetDeviceFunction",
          dataSource,
          runtime: appsync.FunctionRuntime.JS_1_0_0,
          code: appsync.Code.fromAsset(
            path.resolve(__dirname, "src", "get-device.js")
          ),
        }),
      ],
    });

    api.createResolver("CreateDeviceResolver", {
      typeName: "Mutation",
      fieldName: "createDevice",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset(
        path.resolve(__dirname, "src", "pass-through.js")
      ),
      pipelineConfig: [
        new appsync.AppsyncFunction(this, "CreateDeviceFunction", {
          api,
          name: "CreateDeviceFunction",
          dataSource,
          runtime: appsync.FunctionRuntime.JS_1_0_0,
          code: appsync.Code.fromAsset(
            path.resolve(__dirname, "src", "create-device.js")
          ),
        }),
      ],
    });

    api.createResolver("UpdateDeviceResolver", {
      typeName: "Mutation",
      fieldName: "updateDevice",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset(
        path.resolve(__dirname, "src", "pass-through.js")
      ),
      pipelineConfig: [
        new appsync.AppsyncFunction(this, "UpdateDeviceFunction", {
          api,
          name: "UpdateDeviceFunction",
          dataSource,
          runtime: appsync.FunctionRuntime.JS_1_0_0,
          code: appsync.Code.fromAsset(
            path.resolve(__dirname, "src", "update-device.js")
          ),
        }),
      ],
    });

    api.createResolver("DeleteDeviceResolver", {
      typeName: "Mutation",
      fieldName: "deleteDevice",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset(
        path.resolve(__dirname, "src", "pass-through.js")
      ),
      pipelineConfig: [
        new appsync.AppsyncFunction(this, "DeleteDeviceFunction", {
          api,
          name: "DeleteDeviceFunction",
          dataSource,
          runtime: appsync.FunctionRuntime.JS_1_0_0,
          code: appsync.Code.fromAsset(
            path.resolve(__dirname, "src", "delete-device.js")
          ),
        }),
      ],
    });
  }
}
