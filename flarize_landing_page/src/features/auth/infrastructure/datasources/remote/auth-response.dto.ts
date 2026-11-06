import { z } from 'zod';

// Zod .parse() is the equivalent of fromJson + runtime validation.
export const AuthResponseSchema = z.object({
  id: z.string(),
  // TODO: response fields
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
