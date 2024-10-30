import { _generateMetadata, getFixedT } from "app/_utils";
import { redirect } from "next/navigation";

import { getServerSessionForAppDir } from "@calcom/features/auth/lib/get-server-session-for-app-dir";
import LegacyPage from "@calcom/features/ee/teams/pages/team-members-view";
import SettingsHeader from "@calcom/features/settings/appDir/SettingsHeader";

export const generateMetadata = async () =>
  await _generateMetadata(
    (t) => t("team_members"),
    (t) => t("members_team_description")
  );

const Page = async () => {
  const session = await getServerSessionForAppDir();
  const t = await getFixedT(session?.user.locale || "en");

  if (!session?.user.organization) {
    return redirect("/settings/teams");
  }

  return (
    <SettingsHeader title={t("team_notifications")} description={t("team_notifications_description")}>
      <LegacyPage isAppDir={true} />
    </SettingsHeader>
  );
};

export default Page;
