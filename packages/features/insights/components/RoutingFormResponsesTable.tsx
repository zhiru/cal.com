"use client";

import { keepPreviousData } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import Link from "next/link";
import { useRef, useMemo } from "react";

import dayjs from "@calcom/dayjs";
import { useCopy } from "@calcom/lib/hooks/useCopy";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { BookingStatus } from "@calcom/prisma/enums";
import { trpc, type RouterOutputs } from "@calcom/trpc";
import { DataTable, useFetchMoreOnBottomReached, Badge, Avatar, Icon, Button } from "@calcom/ui";
import type { BadgeProps } from "@calcom/ui/components/badge/Badge";

import { useFilterContext } from "../context/provider";

type RoutingFormResponse = RouterOutputs["viewer"]["insights"]["routingFormResponses"]["data"][number];

type RoutingFormTableRow = {
  id: number;
  formName: string;
  createdAt: Date;
  routedToBooking: RoutingFormResponse["routedToBooking"];
  [key: string]: any;
};

function bookingStatusToText(status: BookingStatus) {
  return status.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function RoutingFormResponsesTable() {
  const { t } = useLocale();
  const { filter } = useFilterContext();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { copyToClipboard, isCopied } = useCopy();

  const { dateRange, selectedTeamId, isAll, initialConfig, selectedRoutingFormId, selectedMemberUserId } =
    filter;
  const initialConfigIsReady = !!(initialConfig?.teamId || initialConfig?.userId || initialConfig?.isAll);
  const [startDate, endDate] = dateRange;

  const { data, fetchNextPage, isFetching, hasNextPage } =
    trpc.viewer.insights.routingFormResponses.useInfiniteQuery(
      {
        teamId: selectedTeamId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        userId: selectedMemberUserId ?? undefined,
        isAll: isAll ?? false,
        routingFormId: selectedRoutingFormId ?? undefined,
        limit: 20,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        placeholderData: keepPreviousData,
        trpc: {
          context: { skipBatch: true },
        },
        enabled: initialConfigIsReady,
      }
    );

  const flatData = useMemo(() => data?.pages?.flatMap((page) => page.data) ?? [], [data]);
  const totalDBRowCount = data?.pages?.[0]?.total ?? 0;
  const totalFetched = flatData.length;

  const processedData = useMemo(() => {
    return flatData.map((response) => {
      const row: RoutingFormTableRow = {
        id: response.id,
        formName: response.form.name,
        formId: response.form.id,
        createdAt: response.createdAt,
        routedToBooking: response.routedToBooking,
      };

      // Get the headers from the first page
      const headers = data?.pages?.[0]?.headers;

      Object.entries(response.response).forEach(([fieldId, field]) => {
        const header = headers?.find((h) => h.id === fieldId);

        if (header?.options) {
          if (Array.isArray(field.value)) {
            // Map the IDs to their corresponding labels for array values
            const labels = field.value.map((id) => {
              const option = header.options?.find((opt) => opt.id === id);
              return option?.label ?? id;
            });
            row[fieldId] = labels;
          } else {
            // Handle single value case
            const option = header.options?.find((opt) => opt.id === field.value);
            row[fieldId] = option?.label ?? field.value;
          }
        } else {
          row[fieldId] = field.value;
        }
      });

      return row;
    });
  }, [flatData, data?.pages]);

  const columnHelper = createColumnHelper<RoutingFormTableRow>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("formName", {
        id: "formName",
        header: t("form_name"),
        cell: (info) => {
          const routingFormId = info.row.original.formId;
          return (
            <div className="relative">
              <span className="group/form_name inline-flex items-center">
                <span className="inline-block">{info.getValue().slice(0, 4)}</span>
                <span className="inline-block group-hover/form_name:blur-[1px]">
                  {info.getValue().slice(4)}
                </span>
                <Button
                  href={`/apps/routing-forms/form-edit/${routingFormId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="secondary"
                  size="sm"
                  className="invisible absolute rounded-lg rounded-md group-hover/form_name:visible group-hover/form_name:translate-x-0 group-hover/form_name:opacity-100">
                  Open
                </Button>
              </span>
            </div>
          );
        },
      }),
      ...(data?.pages?.[0]?.headers?.map((header) =>
        columnHelper.accessor(header.id, {
          id: header.id,
          header: header.label,
          cell: (info) => {
            let value = info.getValue();

            value = Array.isArray(value) ? value : [value];
            if (value.length === 0) return null;

            return (
              <div className="flex flex-wrap gap-1">
                {value.length > 2 ? (
                  <>
                    {value.slice(0, 2).map((v: string, i: number) => (
                      <Badge key={i} variant="gray">
                        {v}
                      </Badge>
                    ))}
                    <div className="group/badge relative">
                      <Badge variant="gray">+{value.length - 2}</Badge>
                      <div className="bg-default invisible absolute left-0 top-full z-20 translate-y-[-8px] rounded-md p-2 opacity-0 shadow-md transition-all duration-200 group-hover/badge:visible group-hover/badge:translate-y-0 group-hover/badge:opacity-100">
                        <div className="flex flex-col gap-1">
                          {value.slice(2).map((v: string, i: number) => (
                            <span key={i} className="text-sm text-gray-600">
                              {v}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  value.map((v: string, i: number) => (
                    <Badge key={i} variant="gray">
                      {v}
                    </Badge>
                  ))
                )}
              </div>
            );
          },
        })
      ) ?? []),
      columnHelper.accessor("routedToBooking", {
        id: "bookingStatus",
        header: t("booking_status"),
        cell: (info) => {
          const booking = info.getValue();
          if (!booking || !booking.user)
            return (
              <Badge variant="error" className="ml-6">
                {t("no_booking")}
              </Badge>
            );

          let badgeVariant: BadgeProps["variant"] = "default";
          switch (booking.status) {
            case BookingStatus.REJECTED:
            case BookingStatus.CANCELLED:
              badgeVariant = "warning";
              break;
          }

          return (
            <div className="group/booking_status relative flex items-center gap-2">
              <Avatar size="xs" imageSrc={booking.user.avatarUrl ?? ""} alt={booking.user.name ?? ""} />
              <Link href={`/booking/${booking.uid}`}>
                <Badge variant={badgeVariant}>{dayjs(booking.createdAt).format("MMM D, YYYY HH:mm")}</Badge>
              </Link>
              <div className="bg-default invisible absolute left-0 top-full z-20 translate-y-[-8px] rounded-md p-2 opacity-0 shadow-md transition-all duration-200 group-hover/booking_status:visible group-hover/booking_status:translate-y-0 group-hover/booking_status:opacity-100 ">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Avatar size="sm" imageSrc={booking.user.avatarUrl ?? ""} alt={booking.user.name ?? ""} />
                    <div>
                      <p className="text-sm font-medium">{booking.user.name}</p>
                      <p className="group/booking_status_email text-subtle flex items-center text-xs">
                        <span className="truncate">{booking.user.email}</span>
                        <button
                          className="invisible ml-2 group-hover/booking_status_email:visible"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            copyToClipboard(booking.user?.email ?? "");
                          }}>
                          <Icon name="copy" />
                        </button>
                      </p>
                    </div>
                  </div>
                  <div className="text-emphasis mt-4 flex items-center gap-2 text-xs">
                    <span>Status:</span>
                    <Badge variant={badgeVariant}>{bookingStatusToText(booking.status)}</Badge>
                  </div>
                </div>
              </div>
            </div>
          );
        },
      }),
    ],
    [data?.pages, t]
  );

  const table = useReactTable<RoutingFormTableRow>({
    data: processedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const fetchMoreOnBottomReached = useFetchMoreOnBottomReached(
    tableContainerRef,
    fetchNextPage,
    isFetching,
    totalFetched,
    totalDBRowCount
  );

  return (
    <div className="flex-1">
      <DataTable
        table={table}
        tableContainerRef={tableContainerRef}
        onScroll={(e) => {
          if (hasNextPage) {
            fetchMoreOnBottomReached(e.target as HTMLDivElement);
          }
        }}
        isPending={isFetching && !data}
      />
    </div>
  );
}
