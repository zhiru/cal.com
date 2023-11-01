import { z } from 'zod';

export const createUserBodySchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
});

export type createUserBodyType = z.infer<typeof createUserBodySchema>;
