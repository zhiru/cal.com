import type { DestinationCalendar } from "@prisma/client";
import { describe, it, expect } from "vitest";

import type { CredentialPayload } from "@calcom/types/Credential";
import {
  getOrganizer,
  TestData,
  getGoogleCalendarCredential,
} from "@calcom/web/test/utils/bookingScenario/bookingScenario";

import EventManager from "./EventManager";

describe("EventManager tests", () => {
  describe("Constructor", () => {
    it("Should create an instance and organize all credentials", () => {
      const organizerEmail = "organizer@example.com";
      const organizer = getOrganizer({
        name: "Organizer",
        email: organizerEmail,
        id: 101,
        schedules: [TestData.schedules.IstWorkHours],
      });

      const googleCalendarCredential = {
        ...getGoogleCalendarCredential({ userId: organizer.id, teamId: null, id: 1 }),
        user: { email: organizerEmail },
      };

      const destinationCalendar: DestinationCalendar = {
        id: 1,
        integration: "google_calendar",
        externalId: "test@google-calendar.com",
        primaryEmail: "test@test.com",
        userId: organizer.id,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        credentialId: googleCalendarCredential.id,
        eventTypeId: null,
      };

      const credentials = [googleCalendarCredential] as unknown as CredentialPayload[];

      const eventManager = new EventManager({ ...organizer, destinationCalendar, credentials });

      // Ensure that credentials are being correctly sorted
      expect(eventManager.calendarCredentials).toEqual(
        expect.arrayContaining([expect.objectContaining({ type: googleCalendarCredential.type })])
      );
      expect(eventManager.videoCredentials).toEqual(
        expect.arrayContaining([expect.objectContaining({ type: "daily_video" })])
      );
      // TODO: Add case for CRM apps
    });
  });
});
