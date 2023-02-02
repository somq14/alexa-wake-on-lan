import { util } from "@aws-appsync/utils";

export function request(ctx) {
  if (ctx.prev.result.length >= 5) {
    util.error("デバイス登録数上限に達しました。");
  }

  const { name, macAddress, description } = ctx.args;

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
    operation: "PutItem",
    key: util.dynamodb.toMapValues({
      pk: ctx.identity.sub,
      sk: util.autoUlid(),
    }),
    attributeValues: util.dynamodb.toMapValues({
      name,
      macAddress,
      description,
    }),
  };
}

export function response(ctx) {
  const item = ctx.result;
  return {
    ...item,
    id: item.sk,
  };
}
