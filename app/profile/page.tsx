'use client';

import { ViewportAnimation } from '@/components/viewport-animation';
import { ProfileSidebar } from '@/containers/routes/profile/profile-sidebar';
import { UserOrdersList } from '@/containers/routes/profile/user-orders-list';
import { userSlice } from '@/slices/user';
import { useKillua } from 'killua';
import Image from 'next/image';

export default function ProfilePage() {
  const user = useKillua(userSlice);
  const isAuthenticated = user.selectors.isAuthenticated();
  const username = user.selectors.getUsername() || '';

  if (!isAuthenticated) {
    return (
      <ViewportAnimation className="flex flex-col items-center justify-center gap-6 py-10">
        <Image
          src="/images/global/not-found.png"
          alt="empty"
          width={200}
          height={200}
        />
        <p className="text-muted-foreground">ابتدا وارد حساب کاربری شوید</p>
      </ViewportAnimation>
    );
  }

  return (
    <ViewportAnimation>
      <div className="container">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <ViewportAnimation className="lg:sticky lg:top-6 lg:col-span-1 lg:self-start">
            <ProfileSidebar />
          </ViewportAnimation>
          <ViewportAnimation className="w-full lg:col-span-3">
            <UserOrdersList username={username} />
          </ViewportAnimation>
        </div>
      </div>
    </ViewportAnimation>
  );
}
