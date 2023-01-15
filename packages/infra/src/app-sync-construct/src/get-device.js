import { util } from "@aws-appsync/utils";

export function request(ctx) {
  const { id } = ctx.args;

  if (id.length <= 0 || id.length > 64 || id === ctx.identity.sub) {
    util.error("項目 id が不正です。");
  }

  return {
    operation: "GetItem",
    key: util.dynamodb.toMapValues({
      pk: ctx.identity.sub,
      sk: id,
    }),
  };
}

export function response(ctx) {
  const item = ctx.result;
  if (item === undefined) {
    util.error("デバイスが存在しません。");
  }

  return {
    ...item,
    id: item.sk,
  };
}
