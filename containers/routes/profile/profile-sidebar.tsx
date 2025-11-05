"use client";

import { useKillua } from "killua";
import { userSlice } from "@/slices/user";
import { Button } from "@/ui/button";
import { UserIcon, LogOut, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function ProfileSidebar() {
  const user = useKillua(userSlice);
  const router = useRouter();
  const username = user.selectors.getUsername();
  const fullName = user.selectors.getFullName();

  const handleLogout = () => {
    user.reducers.logout();
    toast.success("با موفقیت خارج شدید");
    router.push("/");
  };

  return (
    <aside className="rounded-xl border bg-white border-slate-200 p-6">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <UserIcon className="w-8 h-8 text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium">{fullName}</p>
          <p className="text-sm text-muted-foreground">{username || ""}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        <Button
          variant="default"
          className="w-full justify-start bg-primary text-white hover:bg-primary/90"
        >
          <ShoppingBag className="w-4 h-4 ml-2" />
          لیست سفارش‌ها
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start hover:bg-error/10 hover:text-error"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 ml-2" />
          خروج
        </Button>
      </nav>
    </aside>
  );
}
