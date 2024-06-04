import type { GetServerSidePropsContext } from "next";
import { getCsrfToken } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { auth } from "@calcom/features/auth";
import { getLocale } from "@calcom/features/auth/lib/getLocale";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, res } = context;

  const session = await auth(context);
  // @TODO res will not be available in future pages (app dir)
  if (session) {
    res.writeHead(302, { Location: "/" });
    res.end();
    return { props: {} };
  }
  const locale = await getLocale(req.headers);
  return {
    props: {
      csrfToken: await getCsrfToken(),
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
