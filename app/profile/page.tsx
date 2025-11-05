"use client";

import { useKillua } from "killua";
import { userSlice } from "@/slices/user";
import { ProfileSidebar } from "@/containers/routes/profile/profile-sidebar";
import { UserOrdersList } from "@/containers/routes/profile/user-orders-list";
import { ViewportAnimation } from "@/components/viewport-animation";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const user = useKillua(userSlice);
  const isAuthenticated = user.selectors.isAuthenticated();
  const fullName = user.selectors.getFullName() || "";

  if (!isAuthenticated) {
    return (
      <ViewportAnimation className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </ViewportAnimation>
    );
  }

  return (
    <ViewportAnimation>
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <ViewportAnimation className="lg:col-span-1 lg:sticky lg:top-6 lg:self-start lg:order-2">
            <ProfileSidebar />
          </ViewportAnimation>
          <ViewportAnimation className="lg:col-span-3 lg:order-1 w-full">
              <UserOrdersList fullName={fullName} />
          </ViewportAnimation>
        </div>
      </div>
    </ViewportAnimation>
  );
}
