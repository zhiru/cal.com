import OtherTeamProfileView from "@calcom/features/ee/organizations/pages/settings/other-team-profile-view";
import { getLayout } from "@calcom/features/settings/layouts/SettingsLayout";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Meta } from "@calcom/ui";

import PageWrapper from "@components/PageWrapper";

const Page = () => {
  const { t } = useLocale();
  return (
    <>
      <Meta title={t("profile")} description={t("profile_team_description")} />
      <OtherTeamProfileView />;
    </>
  );
};

Page.getLayout = getLayout;
Page.PageWrapper = PageWrapper;

export default Page;
