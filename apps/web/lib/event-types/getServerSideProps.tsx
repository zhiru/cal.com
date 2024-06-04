import type { GetServerSidePropsContext } from "next";

import { auth } from "@calcom/features/auth";

import { ssrInit } from "@server/lib/ssr";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const ssr = await ssrInit(context);
  const session = await auth(context);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login",
      },
    };
  }

  return { props: { trpcState: ssr.dehydrate() } };
};
