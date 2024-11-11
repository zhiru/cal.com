import type { Prisma } from "@prisma/client";

import dayjs from "@calcom/dayjs";
import { readonlyPrisma as prisma } from "@calcom/prisma";

type RoutingFormInsightsTeamFilter = {
  teamId?: number | null;
  isAll: boolean;
  organizationId?: number | null;
  routingFormId?: string | null;
};

type RoutingFormInsightsFilter = RoutingFormInsightsTeamFilter & {
  startDate?: string;
  endDate?: string;
};

class RoutingEventsInsights {
  private static async getWhereForTeamOrAllTeams({
    teamId,
    isAll,
    organizationId,
    routingFormId,
  }: RoutingFormInsightsTeamFilter) {
    // Get team IDs based on organization if applicable
    let teamIds: number[] = [];
    if (isAll && organizationId) {
      const teamsFromOrg = await prisma.team.findMany({
        where: {
          parentId: organizationId,
        },
        select: {
          id: true,
        },
      });
      teamIds = [organizationId, ...teamsFromOrg.map((t) => t.id)];
    } else if (teamId) {
      teamIds = [teamId];
    }

    // Base where condition for forms
    const formsWhereCondition: Prisma.App_RoutingForms_FormWhereInput = {
      ...(teamIds.length > 0 && {
        teamId: {
          in: teamIds,
        },
      }),
      ...(routingFormId && {
        id: routingFormId,
      }),
    };

    return formsWhereCondition;
  }

  static async getRoutingFormStats({
    teamId,
    startDate,
    endDate,
    isAll = false,
    organizationId,
    routingFormId,
  }: RoutingFormInsightsFilter) {
    // Get team IDs based on organization if applicable
    const formsWhereCondition = await this.getWhereForTeamOrAllTeams({
      teamId,
      isAll,
      organizationId,
      routingFormId,
    });

    // Base where condition for responses
    const responsesWhereCondition: Prisma.App_RoutingForms_FormResponseWhereInput = {
      ...(startDate &&
        endDate && {
          createdAt: {
            gte: dayjs(startDate).startOf("day").toDate(),
            lte: dayjs(endDate).endOf("day").toDate(),
          },
        }),
      form: formsWhereCondition,
    };

    // Get total forms count
    const totalForms = await prisma.app_RoutingForms_Form.count({
      where: formsWhereCondition,
    });

    // Get total responses
    const totalResponses = await prisma.app_RoutingForms_FormResponse.count({
      where: responsesWhereCondition,
    });

    // Get responses without booking
    const responsesWithoutBooking = await prisma.app_RoutingForms_FormResponse.count({
      where: {
        ...responsesWhereCondition,
        routedToBookingUid: null,
      },
    });

    return {
      created: totalForms,
      total_responses: totalResponses,
      total_responses_without_booking: responsesWithoutBooking,
      total_responses_with_booking: totalResponses - responsesWithoutBooking,
    };
  }

  static async getRoutingFormsForFilters({
    teamId,
    isAll,
    organizationId,
  }: {
    teamId?: number;
    isAll: boolean;
    organizationId?: number | undefined;
    routingFormId?: string | undefined;
  }) {
    const formsWhereCondition = await this.getWhereForTeamOrAllTeams({ teamId, isAll, organizationId });
    return await prisma.app_RoutingForms_Form.findMany({
      where: formsWhereCondition,
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            responses: true,
          },
        },
      },
    });
  }

  static async getRoutingFormPaginatedResponses({
    teamId,
    startDate,
    endDate,
    isAll,
    organizationId,
    routingFormId,
    cursor,
    limit,
  }: RoutingFormInsightsFilter & { cursor?: number; limit?: number }) {
    const formsTeamWhereCondition = await this.getWhereForTeamOrAllTeams({
      teamId,
      isAll,
      organizationId,
      routingFormId,
    });

    const responsesWhereCondition: Prisma.App_RoutingForms_FormResponseWhereInput = {
      ...(startDate &&
        endDate && {
          createdAt: {
            gte: dayjs(startDate).startOf("day").toDate(),
            lte: dayjs(endDate).endOf("day").toDate(),
          },
        }),
      form: formsTeamWhereCondition,
    };

    const totalResponsePromise = prisma.app_RoutingForms_FormResponse.count({
      where: responsesWhereCondition,
    });

    const responsesPromise = prisma.app_RoutingForms_FormResponse.findMany({
      select: {
        id: true,
        form: {
          select: {
            id: true,
            name: true,
          },
        },
        routedToBooking: {
          select: {
            createdAt: true,
            user: {
              select: { id: true, name: true, email: true, avatarUrl: true },
            },
          },
        },
        createdAt: true,
      },
      where: responsesWhereCondition,
      orderBy: {
        createdAt: "desc",
      },
      take: limit ? limit + 1 : undefined, // Get one extra item to check if there are more pages
      cursor: cursor ? { id: cursor } : undefined,
    });

    const [totalResponses, responses] = await Promise.all([totalResponsePromise, responsesPromise]);

    return {
      total: totalResponses,
      data: responses,
      nextCursor: responses.length > (limit ?? 0) ? responses[responses.length - 1].id : undefined,
    };
  }
}

export { RoutingEventsInsights };
