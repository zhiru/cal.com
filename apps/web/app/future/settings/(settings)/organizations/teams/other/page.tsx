import { _generateMetadata, getFixedT } from "app/_utils";
import { getServerSession } from "next-auth";

import { AUTH_OPTIONS } from "@calcom/features/auth/lib/next-auth-options";
import OtherTeamListView from "@calcom/features/ee/organizations/pages/settings/other-team-listing-view";
import SettingsHeader from "@calcom/features/settings/appDir/SettingsHeader";

export const generateMetadata = async () =>
  await _generateMetadata(
    (t) => t("org_admin_other_teams"),
    (t) => t("org_admin_other_teams_description")
  );

const Page = async () => {
  const session = await getServerSession(AUTH_OPTIONS);

  const t = await getFixedT(session?.user.locale || "en");

  return (
    <SettingsHeader title={t("org_admin_other_teams")} description={t("org_admin_other_teams_description")}>
      <OtherTeamListView />
    </SettingsHeader>
  );
};

export default Page;
