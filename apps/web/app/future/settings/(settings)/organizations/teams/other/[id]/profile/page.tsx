import { _generateMetadata, getFixedT } from "app/_utils";
import { getServerSession } from "next-auth";

import { AUTH_OPTIONS } from "@calcom/features/auth/lib/next-auth-options";
import OtherTeamProfileView from "@calcom/features/ee/organizations/pages/settings/other-team-profile-view";
import SettingsHeader from "@calcom/features/settings/appDir/SettingsHeader";

export const generateMetadata = async () =>
  await _generateMetadata(
    (t) => t("profile"),
    (t) => t("profile_team_description")
  );

const Page = async () => {
  const session = await getServerSession(AUTH_OPTIONS);

  const t = await getFixedT(session?.user.locale || "en");

  return (
    <SettingsHeader title={t("profile")} description={t("profile_team_description")}>
      <OtherTeamProfileView />
    </SettingsHeader>
  );
};

export default Page;
