import { prisma } from "@calcom/prisma";

import type { TrpcSessionUser } from "../../../trpc";

type AdminGetAllOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
};

export const adminGetUnverifiedHandler = async ({}: AdminGetAllOptions) => {
  // TODO: This might be better to query by OrganizationSettings
  const allOrgs = await prisma.team.findMany({
    where: {
      organizationSettings: {
        id: {
          not: undefined,
        },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      metadata: true,
      members: {
        where: {
          role: "OWNER",
        },
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      organizationSettings: {
        select: {
          isOrganizationConfigured: true,
          orgAutoAcceptEmail: true,
          isOrganizationVerified: true,
        },
      },
    },
  });

  return allOrgs;
};

export default adminGetUnverifiedHandler;
