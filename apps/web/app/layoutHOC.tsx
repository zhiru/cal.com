import type { LayoutProps, PageProps } from "app/_types";
import { type GetServerSidePropsContext } from "next";
import { cookies, headers } from "next/headers";

import { buildLegacyCtx } from "@lib/buildLegacyCtx";

import PageWrapper from "@components/PageWrapperAppDir";

type WithLayoutParams = {
  getLayout: ((page: React.ReactElement) => React.ReactNode) | null;
  isBookingPage?: boolean;
  requiresLicense?: boolean;
};

export function WithLayout({ getLayout, isBookingPage, requiresLicense }: WithLayoutParams) {
  return async (p: LayoutProps) => {
    const h = headers();
    const nonce = h.get("x-nonce") ?? undefined;
    const children = "children" in p ? p.children : null;

    return (
      <PageWrapper
        getLayout={getLayout}
        requiresLicense={
          requiresLicense || !!(children && "requiresLicense" in children && children.requiresLicense)
        }
        nonce={nonce}
        themeBasis={null}
        isBookingPage={
          isBookingPage || !!(children && "isBookingPage" in children && children.isBookingPage)
        }>
        {children}
      </PageWrapper>
    );
  };
}

type WithPageWrapperProps<T extends Record<string, any>> = {
  getLayout: ((page: React.ReactElement) => React.ReactNode) | null;
  Page?: (props: T | PageProps) => React.ReactElement | Promise<React.ReactElement | null> | null;
  getData?: (arg: GetServerSidePropsContext) => Promise<T | undefined>;
  isBookingPage?: boolean;
  requiresLicense?: boolean;
};

export function WithPageWrapper<T extends Record<string, any>>({
  getLayout,
  getData,
  Page,
  isBookingPage,
  requiresLicense,
}: WithPageWrapperProps<T>) {
  return async (p: PageProps) => {
    const h = headers();
    const nonce = h.get("x-nonce") ?? undefined;
    let props = {} as PageProps | T;

    if ("searchParams" in p && getData) {
      props = (await getData(buildLegacyCtx(h, cookies(), p.params, p.searchParams))) ?? ({} as T);
    } else {
      props = { ...p };
    }

    const pageContent = await Page?.(props);

    return (
      <PageWrapper
        getLayout={getLayout}
        requiresLicense={requiresLicense || !!(Page && "requiresLicense" in Page && Page.requiresLicense)}
        nonce={nonce}
        themeBasis={null}
        isBookingPage={isBookingPage || !!(Page && "isBookingPage" in Page && Page.isBookingPage)}
        {...props}>
        {pageContent}
      </PageWrapper>
    );
  };
}
