import { util } from "@aws-appsync/utils";

export function request(ctx) {
  const { id, name, macAddress, description } = ctx.args;

  if (id.length <= 0 || id.length > 64 || id === ctx.identity.sub) {
    util.error("項目 id が不正です。");
  }

  if (name.length <= 0 || name.length > 16) {
    util.error("項目 name が不正です。");
  }

  if (!util.matches("^[0-9A-F][0-9A-F](-[0-9A-F][0-9A-F]){5}$", macAddress)) {
    util.error("項目 macAddress が不正です。");
  }

  if (description !== null && description.length > 40) {
    util.error("項目 description が不正です。");
  }

  return {
    operation: "UpdateItem",
    key: util.dynamodb.toMapValues({
      pk: ctx.identity.sub,
      sk: id,
    }),
    update: {
      expression:
        "SET #name = :name, #macAddress = :macAddress, #description = :description",
      expressionNames: {
        "#name": "name",
        "#macAddress": "macAddress",
        "#description": "description",
      },
      expressionValues: util.dynamodb.toMapValues({
        ":name": name,
        ":macAddress": macAddress,
        ":description": description,
      }),
    },
    condition: {
      expression: "#pk = :pk AND #sk = :sk",
      expressionNames: {
        "#pk": "pk",
        "#sk": "sk",
      },
      expressionValues: util.dynamodb.toMapValues({
        ":pk": ctx.identity.sub,
        ":sk": id,
      }),
    },
  };
}

export function response(ctx) {
  if (ctx.error) {
    util.error("デバイスが存在しません。");
  }

  const item = ctx.result;
  return {
    ...item,
    id: item.sk,
  };
}
