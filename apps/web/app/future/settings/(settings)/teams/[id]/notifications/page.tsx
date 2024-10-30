import { _generateMetadata, getFixedT } from "app/_utils";
import { redirect } from "next/navigation";

import { getServerSessionForAppDir } from "@calcom/features/auth/lib/get-server-session-for-app-dir";
import TeamNotificationPage from "@calcom/features/ee/teams/pages/team-notification-view";
import SettingsHeader from "@calcom/features/settings/appDir/SettingsHeader";
import { NotificationTriggerEvents, NotificationBelongsToEntity, MembershipRole } from "@calcom/prisma/enums";

export const generateMetadata = async () =>
  await _generateMetadata(
    (t) => t("team_members"),
    (t) => t("members_team_description")
  );

const Page = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSessionForAppDir();
  const t = await getFixedT(session?.user.locale || "en");

  if (!session?.user.organization) {
    return redirect("/settings/teams");
  }

  const teamId = Number(params.id);

  const userHasAccessToTeam = await prisma.membership.findFirst({
    where: {
      teamId,
      userId: session.user.id,
      role: {
        in: [MembershipRole.ADMIN, MembershipRole.OWNER],
      },
    },
  });

  if (!userHasAccessToTeam) {
    return redirect("/settings/teams");
  }

  // Get notification for TEAM and its settings if it exists
  const notificationTemplate = await prisma.notificationTemplate.findFirst({
    where: {
      triggerEvent: NotificationTriggerEvents.NO_SLOTS_FOR_TEAM,
      belongsTo: NotificationBelongsToEntity.TEAM,
    },
  });

  const notificationSettings = await prisma.notificationSetting.findMany({
    where: {
      templateId: notificationTemplate?.id,
      teamId,
    },
  });

  return (
    <SettingsHeader title={t("team_notifications")} description={t("team_notifications_description")}>
      <TeamNotificationPage
        notificationTemplate={notificationTemplate}
        notificationSettings={notificationSettings}
      />
    </SettingsHeader>
  );
};

export default Page;
