import type { GetServerSidePropsContext } from "next";
import { getProviders, getCsrfToken } from "next-auth/react";

import { auth } from "@calcom/features/auth";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await auth(context);
  const csrfToken = await getCsrfToken();
  const providers = await getProviders();
  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }
  return {
    props: {
      csrfToken,
      providers,
    },
  };
}
