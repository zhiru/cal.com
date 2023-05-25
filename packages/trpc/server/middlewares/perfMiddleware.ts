import { middleware } from "../trpc";
import { tracer, context } from '../../../lib/server/OTEL-initializer';

const perfMiddleware = middleware(async ({ path, type, next }) => {
  const span = tracer.startSpan('tRPC.' + path, undefined, context.active());
  const ms = Math.floor(Math.random() * 1000);
  span.setAttribute(path, ms);
  const result = await next();
  span.end();
  return result;
});

export default perfMiddleware;
