import { v5 as uuidv5 } from "uuid";

import { post } from "@calcom/lib/fetch-wrapper";

import type { BookingCreateBody, BookingResponse } from "../types";

export const createBooking = async (data: BookingCreateBody) => {
  // @ts-expect-error responses isnt typed and is dynamic
  const seed = `${data.eventTypeId}.${data.start}.${data.responses.email}.${new Date().toTimeString()}`;
  const idempotencyKey = uuidv5(seed, uuidv5.URL);
  const response = await post<BookingCreateBody, BookingResponse>("/api/book/event", data, {
    headers: {
      "Idempotency-Key": idempotencyKey,
    },
  });
  return response;
};
