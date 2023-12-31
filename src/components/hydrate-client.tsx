"use client";

import { Hydrate as RQHydrate, HydrateProps } from "@tanstack/react-query";

export function ReactQueryHydrate(props: HydrateProps) {
  return <RQHydrate {...props} />;
}
