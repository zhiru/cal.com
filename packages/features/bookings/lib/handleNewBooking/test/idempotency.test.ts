import { v5 as uuidv5 } from "uuid";
import { describe, expect } from "vitest";

import { test } from "@calcom/web/test/fixtures/fixtures";
import {
  TestData,
  createBookingScenario,
  getBooker,
  getDate,
  getOrganizer,
  getScenarioData,
} from "@calcom/web/test/utils/bookingScenario/bookingScenario";
import { createMockNextJsRequest } from "@calcom/web/test/utils/bookingScenario/createMockNextJsRequest";
import { getMockRequestDataForBooking } from "@calcom/web/test/utils/bookingScenario/getMockRequestDataForBooking";
import { setupAndTeardown } from "@calcom/web/test/utils/bookingScenario/setupAndTeardown";

// Local test runs sometime gets too slow
const timeout = process.env.CI ? 5000 : 20000;

const UPSATSH_ENV_FOUND = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

const eventLength = 30;

describe("handleNewBooking", () => {
  setupAndTeardown();

  describe(
    "Idempotency",
    () => {
      // eslint-disable-next-line playwright/no-skipped-test
      test.skipIf(!UPSATSH_ENV_FOUND);

      test(
        `should fail if the request has already been fired.
        `,
        async ({}) => {
          const handleNewBooking = (await import("@calcom/features/bookings/lib/handleNewBooking")).default;

          const booker = getBooker({
            email: "booker@example.com",
            name: "Booker",
          });

          const organizer = getOrganizer({
            name: "Organizer",
            email: "organizer@example.com",
            id: 101,
            schedules: [TestData.schedules.IstWorkHours],
          });

          const { dateString: nextYearDateString } = getDate({ yearIncrement: 1 });

          await createBookingScenario(
            getScenarioData({
              eventTypes: [
                {
                  id: 1,
                  slotInterval: eventLength,
                  length: eventLength,
                  users: [
                    {
                      id: 101,
                    },
                  ],
                },
              ],
              organizer,
            })
          );

          const mockBookingData = getMockRequestDataForBooking({
            data: {
              start: `${nextYearDateString}T05:00:00.000Z`,
              end: `${nextYearDateString}T05:30:00.000Z`,
              eventTypeId: 1,
              responses: {
                email: booker.email,
                name: booker.name,
                location: { optionValue: "", value: "New York" },
              },
            },
          });

          const seed = `${mockBookingData.eventTypeId}.${mockBookingData.start}.${
            mockBookingData.responses.email
          }.${new Date().toTimeString()}`;
          const idempotencyKey = uuidv5(seed, uuidv5.URL);

          const { req } = createMockNextJsRequest({
            method: "POST",
            body: mockBookingData,
            headers: {
              "Idempotency-Key": idempotencyKey,
            },
          });

          await handleNewBooking(req);

          const { dateString: yearWithoutBookingsDateString } = getDate({ yearIncrement: 2 });

          const mockBookingDataFollowingYear = getMockRequestDataForBooking({
            data: {
              start: `${yearWithoutBookingsDateString}T05:00:00.000Z`,
              end: `${yearWithoutBookingsDateString}T05:30:00.000Z`,
              eventTypeId: 1,
              responses: {
                email: booker.email,
                name: booker.name,
                location: { optionValue: "", value: "New York" },
              },
            },
          });

          const { req: reqFollowingYear } = createMockNextJsRequest({
            method: "POST",
            body: mockBookingDataFollowingYear,
            // Use the same idempotency key to simulate a duplicate request
            headers: {
              "Idempotency-Key": idempotencyKey,
            },
          });

          const createdBooking = await handleNewBooking(reqFollowingYear);

          expect(createdBooking).toThrowError("idempotency_key_duplicate");
        },
        timeout
      );
    },
    timeout
  );
});
