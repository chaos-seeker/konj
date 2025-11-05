"use client";

import { Suspense } from "react";
import { ExploreContent } from "@/containers/routes/explore/explore-content";
import { ViewportAnimation } from "@/components/viewport-animation";

export default function ExplorePage() {
  return (
    <Suspense>
      <ViewportAnimation>
        <ExploreContent />
      </ViewportAnimation>
    </Suspense>
  );
}

