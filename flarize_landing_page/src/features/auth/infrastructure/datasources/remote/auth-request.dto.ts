import { z } from 'zod';

export const AuthRequestSchema = z.object({
  // TODO: request fields
});
export type AuthRequest = z.infer<typeof AuthRequestSchema>;
