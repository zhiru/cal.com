import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";

const providers: Provider[] = [];

const GOOGLE_API_CREDENTIALS = process.env.GOOGLE_API_CREDENTIALS || "{}";
const { client_id: GOOGLE_CLIENT_ID, client_secret: GOOGLE_CLIENT_SECRET } =
  JSON.parse(GOOGLE_API_CREDENTIALS)?.web || {};

const IS_GOOGLE_LOGIN_ENABLED = !!(
  GOOGLE_CLIENT_ID &&
  GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_LOGIN_ENABLED
);
if (IS_GOOGLE_LOGIN_ENABLED) {
  providers.push(Google({ clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET }));
}

const config = {
  providers,
  debug: process.env.NODE_ENV !== "production" ? true : false,
} satisfies AuthOptions;

export const { handlers, auth, signOut, signIn } = NextAuth(config);
