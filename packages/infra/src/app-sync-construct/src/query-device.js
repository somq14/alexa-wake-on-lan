import { util } from "@aws-appsync/utils";

export function request(ctx) {
  return {
    operation: "Query",
    query: {
      expression: "#pk = :pk",
      expressionNames: {
        "#pk": "pk",
      },
      expressionValues: util.dynamodb.toMapValues({
        ":pk": ctx.identity.sub,
      }),
    },
  };
}

export function response(ctx) {
  return ctx.result.items
    .filter((item) => item.pk !== item.sk)
    .map((item) => ({
      ...item,
      id: item.sk,
    }));
}
