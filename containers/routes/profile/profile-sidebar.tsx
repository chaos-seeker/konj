'use client';

import { userSlice } from '@/slices/user';
import { Button } from '@/ui/button';
import { useKillua } from 'killua';
import { LogOut, ShoppingBag, UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function ProfileSidebar() {
  const user = useKillua(userSlice);
  const router = useRouter();
  const username = user.selectors.getUsername();
  const fullName = user.selectors.getFullName();

  const handleLogout = () => {
    user.reducers.logout();
    toast.success('با موفقیت خارج شدید');
    router.push('/');
  };

  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-6 flex items-center gap-4 border-b pb-6">
        <div className="bg-primary/10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full">
          <UserIcon className="text-primary h-8 w-8" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium">{fullName}</p>
          <p className="text-muted-foreground text-sm">{username || ''}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        <Button
          variant="default"
          className="bg-primary hover:bg-primary/90 w-full justify-start text-white"
        >
          <ShoppingBag className="ml-2 h-4 w-4" />
          لیست سفارش‌ها
        </Button>
        <Button
          variant="ghost"
          className="hover:bg-error/10 hover:text-error w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="ml-2 h-4 w-4" />
          خروج
        </Button>
      </nav>
    </aside>
  );
}
