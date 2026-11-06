import { z } from 'zod';

export const ProfileRequestSchema = z.object({
  // TODO: request fields
});
export type ProfileRequest = z.infer<typeof ProfileRequestSchema>;
