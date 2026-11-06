import { z } from 'zod';

// Zod .parse() is the equivalent of fromJson + runtime validation.
export const ProfileResponseSchema = z.object({
  id: z.string(),
  // TODO: response fields
});
export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;
