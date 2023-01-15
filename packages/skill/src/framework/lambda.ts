import { Request, Response } from "./alexa";
import { Handler } from "./handler";
import { Interceptor } from "./interceptor";

export type LambdaHandler = (req: Request) => Promise<Response>;

export const buildLambdaHandler = (params: {
  handlers: Handler[];
  interceptors?: Interceptor[];
}): LambdaHandler => {
  type Chain = (directive: Request) => Promise<Response>;

  const initChain: Chain = async (directive) => {
    const handler = params.handlers.find((it) => it.canHandle(directive));
    if (handler === undefined) {
      throw new Error("No applicable handler was found.");
    }
    return await handler.handle(directive);
  };

  const interceptors = params.interceptors ?? [];
  const chain = interceptors
    .reverse()
    .reduce<Chain>(
      (chain, interceptor) => async (directive) =>
        await interceptor.handle(directive, chain),
      initChain
    );

  return async (req) => await chain(req);
};
