export function request() {
  return {};
}

export function response(ctx) {
  return ctx.prev.result;
}
