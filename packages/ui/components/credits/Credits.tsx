import Link from "next/link";
import { useEffect, useState } from "react";

import { COMPANY_NAME, IS_SELF_HOSTED } from "@calcom/lib/constants";
import pkg from "@calcom/web/package.json";

// eslint-disable-next-line turbo/no-undeclared-env-vars
const gitCommitSha = process.env.NEXT_PUBLIC_GIT_COMMIT_SHA ?? "unknown";

export const CalComVersion = `${
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `v.${pkg.version}`
    : `sha.${gitCommitSha.substring(0, 5)}`
}-${!IS_SELF_HOSTED ? "h" : "sh"}`;

export default function Credits() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <small className="text-default mx-3 mt-1 mb-2 hidden text-[0.5rem] opacity-50 lg:block">
      &copy; {new Date().getFullYear()}{" "}
      <Link href="https://go.cal.com/credits" target="_blank" className="hover:underline">
        {COMPANY_NAME}
      </Link>{" "}
      {hasMounted && (
        <Link href="https://go.cal.com/releases" target="_blank" className="hover:underline">
          {CalComVersion}
        </Link>
      )}
    </small>
  );
}
