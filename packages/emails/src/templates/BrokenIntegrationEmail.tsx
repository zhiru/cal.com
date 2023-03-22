import type { TFunction } from "next-i18next";
import { Trans } from "react-i18next";

import { AppStoreLocationType } from "@calcom/app-store/locations";
import { WEBAPP_URL } from "@calcom/lib/constants";
import type { CalendarEvent, Person } from "@calcom/types/Calendar";
import type { CredentialWithAppName } from "@calcom/types/Credential";

import { BaseScheduledEmail } from "./BaseScheduledEmail";

// https://stackoverflow.com/questions/56263980/get-key-of-an-enum-from-its-value-in-typescript
export function getEnumKeyByEnumValue(myEnum: any, enumValue: number | string): string {
  const keys = Object.keys(myEnum).filter((x) => myEnum[x] == enumValue);
  return keys.length > 0 ? keys[0] : "";
}

const BrokenVideoIntegration = (props: { location: string; eventTypeId?: number | null; t: TFunction }) => {
  return (
    <Trans i18nKey="broken_video_action" t={props.t}>
      We could not add the <span>{props.location}</span> meeting link to your scheduled event. Contact your
      invitees or update your calendar event to add the details. You can either&nbsp;
      <a
        href={
          props.eventTypeId ? `${WEBAPP_URL}/event-types/${props.eventTypeId}` : `${WEBAPP_URL}/event-types`
        }>
        change your location on the event type
      </a>
      &nbsp;or try&nbsp;
      <a href={`${WEBAPP_URL}/apps/installed`}>removing and adding the app again.</a>
    </Trans>
  );
};

const BrokenCalendarIntegration = (props: {
  calendar: string;
  eventTypeId?: number | null;
  t: TFunction;
}) => {
  const { t } = props;

  return (
    <Trans i18nKey="broken_calendar_action" t={props.t}>
      We could not update your <span>{props.calendar}</span>.{" "}
      <a href={`${WEBAPP_URL}/apps/installed`}>
        Please check your calendar settings or remove and add your calendar again
      </a>
    </Trans>
  );
};

export const BrokenVideoIntegrationEmail = (
  props: {
    calEvent: CalendarEvent;
    attendee: Person;
  } & Partial<React.ComponentProps<typeof BaseScheduledEmail>>
) => {
  const { calEvent, t = calEvent.organizer.language.translate } = props;
  let location = calEvent.location ? getEnumKeyByEnumValue(AppStoreLocationType, calEvent.location) : " ";
  if (location === "Daily") {
    location = "Cal Video";
  }
  if (location === "GoogleMeet") {
    location = location.slice(0, 5) + " " + location.slice(5);
  }

  return (
    <BaseScheduledEmail
      t={t}
      timeZone={calEvent.organizer.timeZone}
      subject={t("broken_integration")}
      title={t("problem_adding_video_link")}
      subtitle={<BrokenVideoIntegration location={location} eventTypeId={calEvent.eventTypeId} t={t} />}
      headerType="xCircle"
      {...props}
    />
  );
};

export const BrokenCalendarIntegrationEmail = (
  props: {
    calEvent: CalendarEvent;
    attendee: Person;
  } & Partial<React.ComponentProps<typeof BaseScheduledEmail>>
) => {
  const { calEvent, t = calEvent.organizer.language.translate } = props;

  return (
    <BaseScheduledEmail
      timeZone={calEvent.organizer.timeZone}
      t={t}
      subject={t("broken_integration")}
      title={t("problem_updating_calendar")}
      subtitle={
        <BrokenCalendarIntegration
          calendar="This is the broken calendar"
          eventTypeId={calEvent.eventTypeId}
          t={t}
        />
      }
      headerType="xCircle"
      {...props}
    />
  );
};

// Factory.
export const BrokenIntegrationEmail = (
  props: {
    calEvent: CalendarEvent;
    attendee: Person;
    type: CredentialWithAppName["type"];
  } & Partial<React.ComponentProps<typeof BaseScheduledEmail>>
) => {
  const t = props.t || props.calEvent.organizer.language.translate;
  switch (props.type) {
    case "video":
      return <BrokenVideoIntegrationEmail {...props} t={t} />;
    case "calendar":
      return <BrokenCalendarIntegrationEmail {...props} t={t} />;
    default:
      return (
        <BaseScheduledEmail
          timeZone={props.calEvent.organizer.timeZone}
          t={t}
          subject={t("broken_integration")}
          title={t("problem_updating_calendar")}
          headerType="xCircle"
          {...props}
        />
      );
  }
};
