export type JsonPrimitives = null | boolean | number | string;
export type JsonValue = JsonPrimitives | JsonArray | JsonObject;
export type JsonObject = { [key in string]: JsonValue };
export type JsonArray = JsonValue[];

export const parseJSON = (value: string): JsonValue => {
  return JSON.parse(value);
};
