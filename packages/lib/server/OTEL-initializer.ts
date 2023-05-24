import { trace, context } from '@opentelemetry/api';
import { registerOTel } from '@vercel/otel';

registerOTel('cal-app-preview');

export const tracer = trace.getTracer('next-app-tracer');
export { context };
