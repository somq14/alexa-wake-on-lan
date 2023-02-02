// cf. https://developer.amazon.com/ja-JP/docs/alexa/device-apis/message-guide.html
import { JsonObject, JsonValue } from "./json";

export type Header = {
  namespace: string;
  name: string;
  messageId: string;
  correlationToken?: string;
  payloadVersion: string;
};

export type Endpoint = {
  endpointId: string;
  scope?: Scope;
  cookie?: Record<string, string>;
};

export type Scope = {
  type: string;
  token: string;
  partition?: string;
  userId?: string;
};

export type Directive = {
  header: Header;
  endpoint?: Endpoint;
  payload: Payload;
};

export type Event = {
  header: Header;
  endpoint?: Endpoint;
  payload: Payload;
};

export type Context = {
  properties?: Property[];
};

export type Payload = JsonObject;

export type Property = {
  namespace: string;
  instance?: string;
  name: string;
  value: JsonValue;
  timeOfSample: string;
  uncertaintyInMilliseconds: number;
};

export type Cause = {
  type: Type;
};

export type Type =
  | "APP_INTERACTION"
  | "PERIODIC_POLL"
  | "PHYSICAL_INTERACTION"
  | "VOICE_INTERACTION";

export type Request = {
  directive: Directive;
};

export type Response = {
  event: Event;
  context?: Context;
};
