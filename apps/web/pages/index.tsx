import type { GetServerSidePropsContext } from "next";

import { auth } from "@calcom/features/auth";

function RedirectPage() {
  return;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await auth(context);

  if (!session?.user?.id) {
    return { redirect: { permanent: false, destination: "/auth/login" } };
  }

  return { redirect: { permanent: false, destination: "/event-types" } };
}

export default RedirectPage;
