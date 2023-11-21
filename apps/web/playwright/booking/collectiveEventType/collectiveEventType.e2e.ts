import { loginUser } from "../../fixtures/regularBookings";
import { test } from "../../lib/fixtures";

test.describe("Create Collective Event Type and Create Booking", () => {
  test("Create collective Event type and create booking", async ({ page, users, bookingPage }) => {
    await loginUser(users);
    await page.goto("/event-types");
    await bookingPage.createTeam("Team example");
    await bookingPage.createTeamEventType("test-collective", { isCollectiveType: true });
    const eventTypePage = await bookingPage.previewEventType();
    await bookingPage.selectTimeSlot(eventTypePage);
    await bookingPage.fillAllQuestions(eventTypePage, [], { includeGuests: true });

    await bookingPage.rescheduleBooking(eventTypePage);
    await bookingPage.assertBookingRescheduled(eventTypePage);
    await bookingPage.cancelBookingWithReason(eventTypePage);
    await bookingPage.assertBookingCanceled(eventTypePage);
  });
});
