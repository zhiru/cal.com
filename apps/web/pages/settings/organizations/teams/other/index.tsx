import OtherTeamListView from "@calcom/features/ee/organizations/pages/settings/other-team-listing-view";
import { getLayout } from "@calcom/features/settings/layouts/SettingsLayout";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Meta } from "@calcom/ui";

import PageWrapper from "@components/PageWrapper";

const Page = () => {
  const { t } = useLocale();
  return (
    <>
      <Meta title={t("org_admin_other_teams")} description={t("org_admin_other_teams_description")} />
      <OtherTeamListView />;
    </>
  );
};
Page.getLayout = getLayout;
Page.PageWrapper = PageWrapper;

export default Page;
