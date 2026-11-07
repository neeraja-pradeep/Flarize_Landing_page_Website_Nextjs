import "server-only";
import { z } from "zod";

const EnvSchema = z.object({
  /** Public origin of the site, used for metadataBase, canonical URLs and the sitemap. */
  SITE_URL: z.url().default("http://localhost:3000"),
  /** CMS endpoint that receives lead submissions. When empty, submissions are simulated. */
  LEAD_ENDPOINT: z.url().optional(),
});

export const env = EnvSchema.parse({
  SITE_URL: process.env.SITE_URL || undefined,
  LEAD_ENDPOINT: process.env.LEAD_ENDPOINT || undefined,
});
