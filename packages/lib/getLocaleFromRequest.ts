/* eslint-disable @typescript-eslint/no-var-requires */
import parser from "accept-language-parser";

type Maybe<T> = T | null | undefined;

const { i18n } = require("@calcom/config/next-i18next.config");

export async function getLocaleFromRequest(headers: { "accept-language"?: string }): Promise<string> {
  let preferredLocale: string | null | undefined;
  if (headers["accept-language"]) {
    preferredLocale = parser.pick(i18n.locales, headers["accept-language"], {
      loose: true,
    }) as Maybe<string>;
  }
  return preferredLocale ?? i18n.defaultLocale;
}
