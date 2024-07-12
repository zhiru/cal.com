import { recordCreatedBooking } from "./record/recordCreatedBooking";
import type { TbRecordCreatedBookingInput } from "./record/recordCreatedBooking";

export class TinybirdClient {
  static async recordCreatedBooking(input: TbRecordCreatedBookingInput) {
    return await recordCreatedBooking(input);
  }
}
