import { TRPCError } from "@trpc/server";

import { middleware } from "../trpc";

export const csrfMiddleware = middleware(({ ctx, next }) => {
  // Verify CSRF token
  const csrfCookie = ctx.req?.cookies["csrf_token"];
  const csrfToken = ctx.req?.headers["x-csrf-token"];
  console.table({
    "CSRF Token (from cookie)": csrfCookie,
    "CSRF Token (from headers)": csrfToken,
  });
  if (csrfToken && process.env.CSRF_SECRET && csrfToken === process.env.CSRF_SECRET) {
    console.info("CSRF secret detected, skipping middleware", process.env.CSRF_SECRET, csrfToken);
    return next();
  }
  if (!csrfToken || csrfToken !== csrfCookie) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Invalid CSRF token" });
  }
  return next();
});
