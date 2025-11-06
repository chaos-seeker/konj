"use client";

import { useKillua } from "killua";
import { userSlice } from "@/slices/user";
import { ProfileSidebar } from "@/containers/routes/profile/profile-sidebar";
import { UserOrdersList } from "@/containers/routes/profile/user-orders-list";
import { ViewportAnimation } from "@/components/viewport-animation";
import Image from "next/image";

export default function ProfilePage() {
  const user = useKillua(userSlice);
  const isAuthenticated = user.selectors.isAuthenticated();
  const username = user.selectors.getUsername() || "";

  if (!isAuthenticated) {
    return (
      <ViewportAnimation className="items-center flex flex-col gap-6 justify-center py-10">
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <ViewportAnimation className="lg:col-span-1 lg:sticky lg:top-6 lg:self-start">
            <ProfileSidebar />
          </ViewportAnimation>
          <ViewportAnimation className="lg:col-span-3 w-full">
            <UserOrdersList username={username} />
          </ViewportAnimation>
        </div>
      </div>
    </ViewportAnimation>
  );
}
