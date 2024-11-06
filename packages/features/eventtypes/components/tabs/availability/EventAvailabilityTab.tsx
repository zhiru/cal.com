import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useState, memo, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { OptionProps, SingleValueProps } from "react-select";
import { components } from "react-select";

import type { GetAllSchedulesByUserIdQueryType } from "@calcom/atoms/event-types/wrappers/EventAvailabilityTabWebWrapper";
import { useIsPlatform } from "@calcom/atoms/monorepo";
import dayjs from "@calcom/dayjs";
import { SelectSkeletonLoader } from "@calcom/features/availability/components/SkeletonLoader";
import useLockedFieldsManager from "@calcom/features/ee/managed-event-types/hooks/useLockedFieldsManager";
import type { TeamMembers } from "@calcom/features/eventtypes/components/EventType";
import type {
  AvailabilityOption,
  FormValues,
  EventTypeSetup,
  Host,
  SelectClassnames,
} from "@calcom/features/eventtypes/lib/types";
import classNames from "@calcom/lib/classNames";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { weekdayNames } from "@calcom/lib/weekday";
import { weekStartNum } from "@calcom/lib/weekstart";
import { SchedulingType } from "@calcom/prisma/enums";
import type { RouterOutputs } from "@calcom/trpc/react";
import { Avatar, Badge, Button, Icon, Label, Select, SettingsToggle, SkeletonText } from "@calcom/ui";
import { Spinner } from "@calcom/ui/components/icon/Spinner";

type ScheduleQueryData = RouterOutputs["viewer"]["availability"]["schedule"]["get"];

type AvailabilityTableCustomClassnames = {
  tableContainer?: string;
  table?: string;
  tableRow?: string;
  day?: string;
  dayUnavailable?: string;
  dayAvailabilityContainer?: string;
  dayAvailabilityFrom?: string;
  dayAvailabilityTo?: string;
  dayAvailabilitySeperator?: string;
};

type TeamMemmberScheduelCustomClassnames = SelectClassnames & {
  labelAvatar?: string;
  labelContainer?: string;
};

type UserAvailabilityCustomClassnames = {
  availabilitySectionContainer?: string;
  availabilitySelectClassnames?: SelectClassnames;
  availabilityTableClassnames?: AvailabilityTableCustomClassnames;
};

type TeamAvailabilityCustomClassnames = {
  chooseHostSchedulesLabelContainer?: string;
  chooseHostSchedulesLabel?: string;
  chooseHostSchedulesLabelDescription?: string;
  teamAvailibilityContainer?: string;
  teamMemmberScheduelClassnames: TeamMemmberScheduelCustomClassnames;
};

export type EventAvailabilityTabCustomClassnames = {
  teamAvailabilityClassnames: TeamAvailabilityCustomClassnames;
  userAvailabilityClassnames: UserAvailabilityCustomClassnames;
};

type EventTypeScheduleDetailsProps = {
  scheduleQueryData?: Pick<ScheduleQueryData, "timeZone" | "id" | "isManaged" | "readOnly"> & {
    schedule: Array<Pick<ScheduleQueryData["schedule"][number], "days" | "startTime" | "endTime">>;
  };
  isSchedulePending?: boolean;
  user?: Pick<RouterOutputs["viewer"]["me"], "timeFormat" | "weekStart">;
  editAvailabilityRedirectUrl?: string;
  customClassnames?: AvailabilityTableCustomClassnames;
};

type HostSchedulesQueryType =
  | GetAllSchedulesByUserIdQueryType
  | (({ userId }: { userId: number }) => UseQueryResult<
      {
        schedules: {
          id: number;
          name: string;
          isDefault: boolean;
          userId: number;
          readOnly: boolean;
        }[];
      },
      Error
    >);

type EventTypeTeamScheduleProps = {
  hostSchedulesQuery: HostSchedulesQueryType;
  hosts?: Host[];
  customClassnames?: TeamAvailabilityCustomClassnames;
};

type TeamMember = Pick<TeamMembers[number], "avatar" | "name" | "id">;

type EventTypeScheduleProps = {
  schedulesQueryData?: Array<
    Omit<RouterOutputs["viewer"]["availability"]["list"]["schedules"][number], "availability">
  >;
  isSchedulesPending?: boolean;
  eventType: EventTypeSetup;
  teamMembers: TeamMember[];
  customClassnames?: UserAvailabilityCustomClassnames;
} & Omit<EventTypeScheduleDetailsProps, "customClassnames"> &
  Omit<EventTypeTeamScheduleProps, "customClassnames">;

export type EventAvailabilityTabBaserProps = {
  isTeamEvent: boolean;
};

type UseCommonScheduleSettingsToggle = Omit<EventTypeScheduleProps, "customClassnames"> & {
  customClassnames?: EventAvailabilityTabCustomClassnames;
};

type EventAvailabilityTabProps = EventAvailabilityTabBaserProps &
  Omit<EventTypeScheduleProps, "customClassnames"> & {
    customClassnames?: EventAvailabilityTabCustomClassnames;
  };

const Option = ({ ...props }: OptionProps<AvailabilityOption>) => {
  const { label, isDefault, isManaged = false } = props.data;
  const { t } = useLocale();
  return (
    <components.Option {...props}>
      <span>{label}</span>
      {isDefault && (
        <Badge variant="blue" className="ml-2">
          {t("default")}
        </Badge>
      )}
      {isManaged && (
        <Badge variant="gray" className="ml-2">
          {t("managed")}
        </Badge>
      )}
    </components.Option>
  );
};

const SingleValue = ({ ...props }: SingleValueProps<AvailabilityOption>) => {
  const { label, isDefault, isManaged = false } = props.data;
  const { t } = useLocale();
  return (
    <components.SingleValue {...props}>
      <span>{label}</span>
      {isDefault && (
        <Badge variant="blue" className="ml-2">
          {t("default")}
        </Badge>
      )}
      {isManaged && (
        <Badge variant="gray" className="ml-2">
          {t("managed")}
        </Badge>
      )}
    </components.SingleValue>
  );
};

const format = (date: Date, hour12: boolean) =>
  Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "numeric",
    hourCycle: hour12 ? "h12" : "h24",
  }).format(new Date(dayjs.utc(date).format("YYYY-MM-DDTHH:mm:ss")));

const EventTypeScheduleDetails = memo(
  ({
    scheduleQueryData,
    isSchedulePending,
    user,
    editAvailabilityRedirectUrl,
    customClassnames,
  }: EventTypeScheduleDetailsProps) => {
    const timeFormat = user?.timeFormat;
    const { t, i18n } = useLocale();

    const weekStart = weekStartNum(user?.weekStart);

    const filterDays = (dayNum: number) =>
      scheduleQueryData?.schedule?.filter((item) => item.days.includes((dayNum + weekStart) % 7)) || [];

    return (
      <div>
        <div className={classNames("border-subtle space-y-4 border-x p-6", customClassnames?.tableContainer)}>
          <ol className={classNames("table border-collapse text-sm", customClassnames?.table)}>
            {weekdayNames(i18n.language, weekStart, "long").map((day, index) => {
              const isAvailable = !!filterDays(index).length;
              return (
                <li
                  key={day}
                  className={classNames(
                    "my-6 flex border-transparent last:mb-2",
                    customClassnames?.tableRow
                  )}>
                  <span
                    className={classNames(
                      "w-20 font-medium sm:w-32 ",
                      !isAvailable ? "text-subtle line-through" : "text-default",
                      customClassnames?.day
                    )}>
                    {day}
                  </span>
                  {isSchedulePending ? (
                    <SkeletonText className="block h-5 w-60" />
                  ) : isAvailable ? (
                    <div className="space-y-3 text-right">
                      {filterDays(index).map((dayRange, i) => (
                        <div
                          key={i}
                          className={classNames(
                            "text-default flex items-center leading-4",
                            customClassnames?.dayAvailabilityContainer
                          )}>
                          <span
                            className={classNames(
                              "w-16 sm:w-28 sm:text-left",
                              customClassnames?.dayAvailabilityFrom
                            )}>
                            {format(dayRange.startTime, timeFormat === 12)}
                          </span>
                          <span className={classNames("ms-4", customClassnames?.dayAvailabilitySeperator)}>
                            -
                          </span>
                          <div className={classNames("ml-6 sm:w-28", customClassnames?.dayAvailabilityTo)}>
                            {format(dayRange.endTime, timeFormat === 12)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span
                      className={classNames("text-subtle ml-6 sm:ml-0", customClassnames?.dayUnavailable)}>
                      {t("unavailable")}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
        <div className="bg-muted border-subtle flex flex-col justify-center gap-2 rounded-b-md border p-6 sm:flex-row sm:justify-between">
          <span className="text-default flex items-center justify-center text-sm sm:justify-start">
            <Icon name="globe" className="h-3.5 w-3.5 ltr:mr-2 rtl:ml-2" />
            {scheduleQueryData?.timeZone || <SkeletonText className="block h-5 w-32" />}
          </span>
          {!!scheduleQueryData?.id &&
            !scheduleQueryData.isManaged &&
            !scheduleQueryData.readOnly &&
            !!editAvailabilityRedirectUrl && (
              <Button
                href={editAvailabilityRedirectUrl}
                disabled={isSchedulePending}
                color="minimal"
                EndIcon="external-link"
                target="_blank"
                rel="noopener noreferrer">
                {t("edit_availability")}
              </Button>
            )}
        </div>
      </div>
    );
  }
);

EventTypeScheduleDetails.displayName = "EventTypeScheduleDetails";

const EventTypeSchedule = ({
  eventType,
  schedulesQueryData,
  isSchedulesPending,
  customClassnames,
  ...rest
}: EventTypeScheduleProps) => {
  const { t } = useLocale();
  const formMethods = useFormContext<FormValues>();
  const { shouldLockIndicator, shouldLockDisableProps, isManagedEventType, isChildrenManagedEventType } =
    useLockedFieldsManager({ eventType, translate: t, formMethods });
  const { watch, setValue } = formMethods;

  const scheduleId = watch("schedule");

  useEffect(() => {
    // after data is loaded.
    if (schedulesQueryData && scheduleId !== 0 && !scheduleId) {
      const newValue = isManagedEventType ? 0 : schedulesQueryData.find((schedule) => schedule.isDefault)?.id;
      if (!newValue && newValue !== 0) return;
      setValue("schedule", newValue, {
        shouldDirty: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleId, schedulesQueryData]);

  if (isSchedulesPending || !schedulesQueryData) {
    return <SelectSkeletonLoader />;
  }

  const options = schedulesQueryData.map((schedule) => ({
    value: schedule.id,
    label: schedule.name,
    isDefault: schedule.isDefault,
    isManaged: false,
  }));

  // We are showing a managed event for a team admin, so adding the option to let members choose their schedule
  if (isManagedEventType) {
    options.push({
      value: 0,
      label: t("members_default_schedule"),
      isDefault: false,
      isManaged: false,
    });
  }
  // We are showing a managed event for a member and team owner selected their own schedule, so adding
  // the managed schedule option
  if (
    isChildrenManagedEventType &&
    scheduleId &&
    !schedulesQueryData.find((schedule) => schedule.id === scheduleId)
  ) {
    options.push({
      value: scheduleId,
      label: eventType.scheduleName ?? t("default_schedule_name"),
      isDefault: false,
      isManaged: false,
    });
  }
  // We push the selected schedule from the event type if it's not part of the list response. This happens if the user is an admin but not the schedule owner.
  else if (eventType.schedule && !schedulesQueryData.find((schedule) => schedule.id === eventType.schedule)) {
    options.push({
      value: eventType.schedule,
      label: eventType.scheduleName ?? t("default_schedule_name"),
      isDefault: false,
      isManaged: false,
    });
  }

  return (
    <div>
      <div
        className={classNames(
          "border-subtle rounded-t-md border p-6",
          customClassnames?.availabilitySectionContainer
        )}>
        <label
          htmlFor="availability"
          className={classNames(
            "text-default mb-2 block text-sm font-medium leading-none",
            customClassnames?.availabilitySelectClassnames?.label
          )}>
          {t("availability")}
          {(isManagedEventType || isChildrenManagedEventType) && shouldLockIndicator("schedule")}
        </label>
        <Controller
          name="schedule"
          render={({ field: { onChange, value } }) => {
            const optionValue: AvailabilityOption | undefined = options.find(
              (option) => option.value === value
            );
            return (
              <Select
                placeholder={t("select")}
                options={options}
                isDisabled={shouldLockDisableProps("schedule").disabled}
                isSearchable={false}
                onChange={(selected) => {
                  if (selected) onChange(selected.value);
                }}
                className={classNames(
                  "block w-full min-w-0 flex-1 rounded-sm text-sm",
                  customClassnames?.availabilitySelectClassnames?.select
                )}
                value={optionValue}
                components={{ Option, SingleValue }}
                isMulti={false}
                innerClassNames={customClassnames?.availabilitySelectClassnames?.innerClassNames}
              />
            );
          }}
        />
      </div>
      {scheduleId !== 0 ? (
        <EventTypeScheduleDetails
          {...rest}
          customClassnames={customClassnames?.availabilityTableClassnames}
        />
      ) : (
        isManagedEventType && (
          <p className="!mt-2 ml-1 text-sm text-gray-600">{t("members_default_schedule_description")}</p>
        )
      )}
    </div>
  );
};
const TeamMemberSchedule = ({
  host,
  index,
  teamMembers,
  hostScheduleQuery,
  customClassnames,
}: {
  host: Host;
  index: number;
  teamMembers: TeamMember[];
  hostScheduleQuery: HostSchedulesQueryType;
  customClassnames?: TeamMemmberScheduelCustomClassnames;
}) => {
  const { t } = useLocale();
  const isPlatform = useIsPlatform();

  const formMethods = useFormContext<FormValues>();
  const { getValues } = formMethods;

  const { data, isPending } = hostScheduleQuery({
    userId: host.userId,
  });

  const schedules = data?.schedules;
  const options = schedules?.map((schedule) => ({
    value: schedule.id,
    label: schedule.name,
    isDefault: schedule.isDefault,
    isManaged: false,
  }));

  //Set to defaultSchedule if Host Schedule is not previously selected
  const scheduleId = getValues(`hosts.${index}.scheduleId`);
  const value = options?.find((option) =>
    scheduleId
      ? option.value === scheduleId
      : option.value === schedules?.find((schedule) => schedule.isDefault)?.id
  );

  const member = teamMembers.find((mem) => mem.id === host.userId);
  const avatar = member?.avatar;
  const label = member?.name;

  return (
    <>
      <div className={classNames("flex w-full items-center", customClassnames?.labelContainer)}>
        {!isPlatform && <Avatar size="sm" imageSrc={avatar} alt={label || ""} />}
        {isPlatform && <Icon name="user" className={classNames("h-4 w-4", customClassnames?.labelAvatar)} />}
        <p className={classNames("text-emphasis my-auto ms-3 text-sm", customClassnames?.label)}>{label}</p>
      </div>
      <div className="flex w-full flex-col pt-2 ">
        {isPending ? (
          <Spinner className="mt-2 h-6 w-6" />
        ) : (
          <Controller
            name={`hosts.${index}.scheduleId`}
            render={({ field }) => {
              return (
                <Select
                  placeholder={t("select")}
                  options={options}
                  isSearchable={false}
                  onChange={(selected) => {
                    field.onChange(selected?.value || null);
                  }}
                  className={classNames(
                    "block w-full min-w-0 flex-1 rounded-sm text-sm",
                    customClassnames?.select
                  )}
                  innerClassNames={customClassnames?.innerClassNames}
                  value={value as AvailabilityOption}
                  components={{ Option, SingleValue }}
                  isMulti={false}
                  isDisabled={isPending}
                />
              );
            }}
          />
        )}
      </div>
    </>
  );
};

const TeamAvailability = ({
  hosts,
  teamMembers,
  hostSchedulesQuery,
  customClassnames,
}: EventTypeTeamScheduleProps & {
  teamMembers: TeamMember[];
  customClassnames?: TeamAvailabilityCustomClassnames;
}) => {
  const { t } = useLocale();
  const [animationRef] = useAutoAnimate<HTMLUListElement>();

  return (
    <>
      <div
        className={classNames(
          "border-subtle flex flex-col rounded-md",
          customClassnames?.teamAvailibilityContainer
        )}>
        <div
          className={classNames(
            "border-subtle mt-5 rounded-t-md border p-6 pb-5",
            customClassnames?.chooseHostSchedulesLabelContainer
          )}>
          <Label
            className={classNames("mb-1 text-sm font-semibold", customClassnames?.chooseHostSchedulesLabel)}>
            {t("choose_hosts_schedule")}
          </Label>
          <p
            className={classNames(
              "text-subtle max-w-full break-words text-sm leading-tight",
              customClassnames?.chooseHostSchedulesLabelDescription
            )}>
            {t("hosts_schedule_description")}
          </p>
        </div>
        <div className="border-subtle rounded-b-md border border-t-0 p-6">
          {hosts && hosts.length > 0 ? (
            <ul
              className={classNames("mb-4 mt-3 rounded-md", hosts.length >= 1 && "border-subtle border")}
              ref={animationRef}>
              {hosts?.map((host, index) => (
                <li
                  key={host.userId}
                  className={classNames(
                    `flex flex-col px-3 py-2 ${index === hosts.length - 1 ? "" : "border-subtle border-b"}`,
                    customClassnames?.teamMemmberScheduelClassnames?.container
                  )}>
                  <TeamMemberSchedule
                    host={host}
                    index={index}
                    teamMembers={teamMembers}
                    hostScheduleQuery={hostSchedulesQuery}
                    customClassnames={customClassnames?.teamMemmberScheduelClassnames}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-subtle max-w-full break-words text-sm leading-tight">
              {t("no_hosts_description")}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

const UseCommonScheduleSettingsToggle = ({
  eventType,
  customClassnames,
  ...rest
}: UseCommonScheduleSettingsToggle) => {
  const { t } = useLocale();
  const { setValue, resetField, getFieldState, getValues, watch } = useFormContext<FormValues>();

  const [useHostSchedulesForTeamEvent, setUseHostSchedulesForTeamEvent] = useState(
    !Boolean(getFieldState("schedule").isDirty ? getValues("schedule") : eventType.schedule)
  );

  const watchHosts = watch("hosts");

  return (
    <>
      <SettingsToggle
        checked={!useHostSchedulesForTeamEvent}
        onCheckedChange={(checked) => {
          setUseHostSchedulesForTeamEvent(!checked);
          if (checked) {
            if (Boolean(eventType.schedule)) resetField("schedule");
            getValues("hosts").map((_, index) => {
              setValue(`hosts.${index}.scheduleId`, null, { shouldDirty: true });
            });
          } else {
            setValue("schedule", null, { shouldDirty: Boolean(eventType.schedule) });
          }
        }}
        title={t("choose_common_schedule_team_event")}
        description={t("choose_common_schedule_team_event_description")}>
        <EventTypeSchedule
          eventType={eventType}
          {...rest}
          customClassnames={customClassnames?.userAvailabilityClassnames}
        />
      </SettingsToggle>
      {useHostSchedulesForTeamEvent && (
        <div className="lg:ml-14">
          <TeamAvailability
            hosts={watchHosts}
            teamMembers={rest.teamMembers}
            hostSchedulesQuery={rest.hostSchedulesQuery}
            customClassnames={customClassnames?.teamAvailabilityClassnames}
          />
        </div>
      )}
    </>
  );
};

export const EventAvailabilityTab = ({ eventType, isTeamEvent, ...rest }: EventAvailabilityTabProps) => {
  return isTeamEvent && eventType.schedulingType !== SchedulingType.MANAGED ? (
    <UseCommonScheduleSettingsToggle eventType={eventType} {...rest} />
  ) : (
    <EventTypeSchedule
      eventType={eventType}
      {...rest}
      customClassnames={rest?.customClassnames?.userAvailabilityClassnames}
    />
  );
};
