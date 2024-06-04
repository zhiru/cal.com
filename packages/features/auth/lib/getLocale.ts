import { parse } from "accept-language-parser";
import { lookup } from "bcp-47-match";

//@ts-expect-error no type definitions
import { i18n } from "@calcom/config/next-i18next.config";

export const getLocale = async (headers: { "accept-language"?: string } | Headers): Promise<string> => {
  const acceptLanguage =
    headers instanceof Headers ? headers.get("accept-language") : headers["accept-language"];

  const languages = acceptLanguage ? parse(acceptLanguage) : [];

  const code: string = languages[0]?.code ?? "";
  const region: string = languages[0]?.region ?? "";

  // the code should consist of 2 or 3 lowercase letters
  // the regex underneath is more permissive
  const testedCode = /^[a-zA-Z]+$/.test(code) ? code : "en";

  // the code should consist of either 2 uppercase letters or 3 digits
  // the regex underneath is more permissive
  const testedRegion = /^[a-zA-Z0-9]+$/.test(region) ? region : "";

  const requestedLocale = `${testedCode}${testedRegion !== "" ? "-" : ""}${testedRegion}`;

  // use fallback to closest supported locale.
  // for instance, es-419 will be transformed to es
  return lookup(i18n.locales, requestedLocale) ?? requestedLocale;
};
