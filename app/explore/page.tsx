'use client';

import { ViewportAnimation } from '@/components/viewport-animation';
import { ExploreContent } from '@/containers/routes/explore/explore-content';
import { Suspense } from 'react';

export default function ExplorePage() {
  return (
    <Suspense>
      <ViewportAnimation>
        <ExploreContent />
      </ViewportAnimation>
    </Suspense>
  );
}
