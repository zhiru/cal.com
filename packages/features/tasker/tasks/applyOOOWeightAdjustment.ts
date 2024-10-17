import { z } from "zod";

const applyOOOWeightAdjustmentPayload = z.object({
  oooEntryUuid: z.string(),
});

export async function sendEmail(payload: string): Promise<void> {
  try {
    const parsedPayload = applyOOOWeightAdjustmentPayload.parse(JSON.parse(payload));
  } catch (error) {
    // ... handle error
    console.error(error);
    throw error;
  }
}
