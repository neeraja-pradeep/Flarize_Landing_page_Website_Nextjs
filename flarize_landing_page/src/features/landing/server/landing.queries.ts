import "server-only";
import { LandingContentSchema, type LandingContent } from "../schemas/landing-content.schema";
import { LANDING_CONTENT } from "../data/landing-content";

/**
 * Single data seam for the page. Today it parses the static content; when the CMS/API is
 * ready, replace the body with `apiFetch('/landing', { schema: LandingContentSchema, ... })`
 * and nothing downstream changes.
 */
export async function getLandingContent(): Promise<LandingContent> {
  return LandingContentSchema.parse(LANDING_CONTENT);
}
