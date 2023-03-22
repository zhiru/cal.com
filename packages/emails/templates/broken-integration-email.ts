import type { TFunction } from "next-i18next";

import { getRichDescription } from "@calcom/lib/CalEventParser";
import { APP_NAME } from "@calcom/lib/constants";
import type { CalendarEvent } from "@calcom/types/Calendar";
import type { CredentialWithAppName } from "@calcom/types/Credential";

import { renderEmail } from "..";
import BaseEmail from "./_base-email";

export default class BrokenIntegrationEmail extends BaseEmail {
  triggerEvent: CalendarEvent;
  t: TFunction;
  integration: CredentialWithAppName;

  constructor({
    triggerEvent,
    integration,
  }: {
    triggerEvent: CalendarEvent;
    integration: CredentialWithAppName;
  }) {
    super();
    this.name = "SEND_BROKEN_INTEGRATION";
    this.triggerEvent = triggerEvent;
    this.t = this.triggerEvent.organizer.language.translate;
    this.integration = integration;
  }

  protected getNodeMailerPayload(): Record<string, unknown> {
    const toAddresses = [this.triggerEvent.organizer.email];

    return {
      from: `${APP_NAME} <${this.getMailerOptions().from}>`,
      to: toAddresses.join(","),
      subject: `[Action Required] ${this.t("confirmed_event_type_subject", {
        eventType: this.triggerEvent.type,
        name: this.triggerEvent.attendees[0].name,
        date: this.getFormattedDate(),
      })}`,
      html: renderEmail("BrokenIntegrationEmail", {
        calEvent: this.triggerEvent,
        attendee: this.triggerEvent.organizer,
        type: this.integration.type,
      }),
      text: this.getTextBody(),
    };
  }

  protected getTextBody(
    title = "",
    subtitle = "emailed_you_and_any_other_attendees",
    extraInfo = "",
    callToAction = ""
  ): string {
    return `
${this.t(
  title || this.triggerEvent.recurringEvent?.count ? "new_event_scheduled_recurring" : "new_event_scheduled"
)}
${this.t(subtitle)}
${extraInfo}
${getRichDescription(this.triggerEvent)}
${callToAction}
`.trim();
  }

  protected getTimezone(): string {
    return this.triggerEvent.organizer.timeZone;
  }

  protected getOrganizerStart(format: string) {
    return this.getRecipientTime(this.triggerEvent.startTime, format);
  }

  protected getOrganizerEnd(format: string) {
    return this.getRecipientTime(this.triggerEvent.endTime, format);
  }

  protected getFormattedDate() {
    return `${this.getOrganizerStart("h:mma")} - ${this.getOrganizerEnd("h:mma")}, ${this.t(
      this.getOrganizerStart("dddd").toLowerCase()
    )}, ${this.t(this.getOrganizerStart("MMMM").toLowerCase())} ${this.getOrganizerStart("D, YYYY")}`;
  }
}
