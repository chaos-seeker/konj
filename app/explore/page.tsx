"use client";

import { Suspense } from "react";
import { ExploreContent } from "@/containers/routes/explore/explore-content";

export default function ExplorePage() {
  return (
    <Suspense >
      <ExploreContent />
    </Suspense>
  );
}

