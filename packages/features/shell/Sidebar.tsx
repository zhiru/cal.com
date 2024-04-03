import type { User as UserAuth } from "next-auth";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useMemo } from "react";

import { useOrgBranding } from "@calcom/ee/organizations/context/provider";
import { getOrgFullOrigin } from "@calcom/ee/organizations/lib/orgDomains";
import { classNames } from "@calcom/lib";
import { ENABLE_PROFILE_SWITCHER, IS_VISUAL_REGRESSION_TESTING } from "@calcom/lib/constants";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Avatar, ButtonOrLink, Logo, Tooltip, showToast, Credits } from "@calcom/ui";
import { ArrowLeft, ArrowRight, Copy, ExternalLink, Link, Settings } from "@calcom/ui/components/icon";

import { KBarTrigger } from "../kbar/Kbar";
import { ProfileDropdown } from "./ProfileDropdown";
import type { NavigationItemType } from "./Shell";
import { UserDropdown } from "./UserDropdown";

type SideBarContainerProps = {
  bannersHeight: number;
};

type SideBarProps = {
  bannersHeight: number;
  user?: UserAuth | null;
};

// need to import without ssr to prevent hydration errors
const Tips = dynamic(() => import("@calcom/features/tips").then((mod) => mod.Tips), {
  ssr: false,
});

export function SideBarContainer({ bannersHeight }: SideBarContainerProps) {
  const { status, data } = useSession();

  // Make sure that Sidebar is rendered optimistically so that a refresh of pages when logged in have SideBar from the beginning.
  // This improves the experience of refresh on app store pages(when logged in) which are SSG.
  // Though when logged out, app store pages would temporarily show SideBar until session status is confirmed.
  if (status !== "loading" && status !== "authenticated") return null;
  return <SideBar bannersHeight={bannersHeight} user={data?.user} />;
}

function SideBar({ bannersHeight, user }: SideBarProps) {
  const { t, isLocaleReady } = useLocale();
  const orgBranding = useOrgBranding();

  const publicPageUrl = useMemo(() => {
    if (!user?.org?.id) return `${process.env.NEXT_PUBLIC_WEBSITE_URL}/${user?.username}`;
    const publicPageUrl = orgBranding?.slug ? getOrgFullOrigin(orgBranding.slug) : "";
    return publicPageUrl;
  }, [orgBranding?.slug, user?.username, user?.org?.id]);

  const bottomNavItems: NavigationItemType[] = [
    {
      name: "view_public_page",
      href: publicPageUrl,
      icon: ExternalLink,
      target: "__blank",
    },
    {
      name: "copy_public_page_link",
      href: "",
      onClick: (e: { preventDefault: () => void }) => {
        e.preventDefault();
        navigator.clipboard.writeText(publicPageUrl);
        showToast(t("link_copied"), "success");
      },
      icon: Copy,
    },
    {
      name: "settings",
      href: user?.org ? `/settings/organizations/profile` : "/settings/my-account/profile",
      icon: Settings,
    },
  ];
  return (
    <div className="relative">
      <aside
        style={{ maxHeight: `calc(100vh - ${bannersHeight}px)`, top: `${bannersHeight}px` }}
        className="todesktop:!bg-transparent bg-muted border-muted fixed left-0 hidden h-full max-h-screen w-14 flex-col overflow-y-auto overflow-x-hidden border-r md:sticky md:flex lg:w-56 lg:px-3">
        <div className="flex h-full flex-col justify-between py-3 lg:pt-4">
          <header className="todesktop:-mt-3 todesktop:flex-col-reverse todesktop:[-webkit-app-region:drag] items-center justify-between md:hidden lg:flex">
            {orgBranding ? (
              !ENABLE_PROFILE_SWITCHER ? (
                <Link href="/settings/organizations/profile" className="w-full px-1.5">
                  <div className="flex items-center gap-2 font-medium">
                    <Avatar
                      alt={`${orgBranding.name} logo`}
                      imageSrc={`${orgBranding.fullDomain}/org/${orgBranding.slug}/avatar.png`}
                      size="xsm"
                    />
                    <p className="text line-clamp-1 text-sm">
                      <span>{orgBranding.name}</span>
                    </p>
                  </div>
                </Link>
              ) : (
                <ProfileDropdown />
              )
            ) : (
              <div data-testid="user-dropdown-trigger" className="todesktop:mt-4 w-full">
                <span className="hidden lg:inline">
                  <UserDropdown />
                </span>
                <span className="hidden md:inline lg:hidden">
                  <UserDropdown small />
                </span>
              </div>
            )}
            <div className="flex justify-end rtl:space-x-reverse">
              <button
                color="minimal"
                onClick={() => window.history.back()}
                className="todesktop:block hover:text-emphasis text-subtle group hidden text-sm font-medium">
                <ArrowLeft className="group-hover:text-emphasis text-subtle h-4 w-4 flex-shrink-0" />
              </button>
              <button
                color="minimal"
                onClick={() => window.history.forward()}
                className="todesktop:block hover:text-emphasis text-subtle group hidden text-sm font-medium">
                <ArrowRight className="group-hover:text-emphasis text-subtle h-4 w-4 flex-shrink-0" />
              </button>
              {!!orgBranding && (
                <div data-testid="user-dropdown-trigger" className="flex items-center">
                  <UserDropdown small />
                </div>
              )}
              <KBarTrigger />
            </div>
          </header>

          {/* logo icon for tablet */}
          <Link href="/event-types" className="text-center md:inline lg:hidden">
            <Logo small icon />
          </Link>

          <Navigation />
        </div>

        <div>
          <Tips />
          {bottomNavItems.map(({ icon: Icon, ...item }, index) => (
            <Tooltip side="right" content={t(item.name)} className="lg:hidden" key={item.name}>
              <ButtonOrLink
                id={item.name}
                href={item.href || undefined}
                aria-label={t(item.name)}
                target={item.target}
                className={classNames(
                  "text-left",
                  "[&[aria-current='page']]:bg-emphasis text-default justify-right group flex items-center rounded-md px-2 py-1.5 text-sm font-medium transition",
                  "[&[aria-current='page']]:text-emphasis mt-0.5 w-full text-sm",
                  isLocaleReady ? "hover:bg-emphasis hover:text-emphasis" : "",
                  index === 0 && "mt-3"
                )}
                onClick={item.onClick}>
                {!!Icon && (
                  <Icon
                    className={classNames(
                      "h-4 w-4 flex-shrink-0 [&[aria-current='page']]:text-inherit",
                      "me-3 md:mx-auto lg:ltr:mr-2 lg:rtl:ml-2"
                    )}
                    aria-hidden="true"
                  />
                )}
                {isLocaleReady ? (
                  <span className="hidden w-full justify-between lg:flex">
                    <div className="flex">{t(item.name)}</div>
                  </span>
                ) : (
                  <SkeletonText className="h-[20px] w-full" />
                )}
              </ButtonOrLink>
            </Tooltip>
          ))}
          {!IS_VISUAL_REGRESSION_TESTING && <Credits />}
        </div>
      </aside>
    </div>
  );
}
