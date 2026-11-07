"use client";

import { useEffect } from "react";
import { track } from "@/shared/lib/analytics";
import { ANALYTICS_EVENTS } from "../constants";

export function PageViewTracker() {
  useEffect(() => {
    track(ANALYTICS_EVENTS.pageView, { page: "meta_ads_solar_lp" });
  }, []);
  return null;
}
