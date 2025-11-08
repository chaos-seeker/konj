'use client';

import { ModalLogin } from './modal-login';
import { ModalRegister } from './modal-register';
import { cartSlice } from '@/slices/cart';
import { userSlice } from '@/slices/user';
import { Button } from '@/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/tooltip';
import { useKillua } from 'killua';
import {
  LayoutDashboard,
  SearchIcon,
  ShoppingBag,
  UserIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Header() {
  return (
    <TooltipProvider>
      <header>
        <div className="container flex flex-col gap-4 rounded-b-xl border border-slate-200 bg-white py-4 lg:flex-row">
          <div className="flex w-full items-center justify-between gap-4">
            <div className="shrink-0">
              <Logo />
            </div>
            <Search />
            <div className="flex shrink-0 items-center gap-2">
              <Dashboard />
              <Cart />
              <User />
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}

function Logo() {
  return (
    <Link href="/">
      <Image
        src="/images/layout/logo.png"
        unoptimized
        alt="logo"
        width={60}
        height={60}
        className="lg:w-[80px]"
      />
    </Link>
  );
}

const Dashboard = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={'outline'}
          size="icon"
          className="hover:bg-primary hover:border-primary hidden hover:text-white sm:flex lg:size-10"
          asChild
        >
          <button
            onClick={() => (window.location.href = '/dashboard/manage-books')}
          >
            <LayoutDashboard className="size-4 lg:size-5" />
          </button>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>داشبورد</p>
      </TooltipContent>
    </Tooltip>
  );
};

const Cart = () => {
  const cart = useKillua(cartSlice);
  const count = cart.selectors.totalCount();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="hover:bg-primary hover:border-primary relative hover:text-white lg:size-10"
          asChild
        >
          <Link href="/cart">
            <ShoppingBag className="size-4 lg:size-5" />
            {count > 0 && (
              <span className="bg-primary absolute -top-1 -right-1.5 rounded-full border border-white px-1.5 py-0.5 text-[8px] text-white">
                {count}
              </span>
            )}
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>سبد خرید</p>
      </TooltipContent>
    </Tooltip>
  );
};

const User = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const user = useKillua(userSlice);
  const isAuthenticated = user.selectors.isAuthenticated();

  if (isAuthenticated) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="hover:bg-primary hover:border-primary hover:text-white lg:size-10"
            asChild
          >
            <Link href="/profile">
              <UserIcon className="size-5 lg:size-6" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>پروفایل</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="hover:bg-primary hover:border-primary hover:text-white lg:size-10"
            onClick={() => setLoginOpen(true)}
          >
            <UserIcon className="size-5 lg:size-6" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>ورود / ثبت‌نام</p>
        </TooltipContent>
      </Tooltip>
      <ModalLogin
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToRegister={() => setRegisterOpen(true)}
      />
      <ModalRegister
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onSwitchToLogin={() => setLoginOpen(true)}
      />
    </>
  );
};

const Search = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = searchText.trim();
    if (trimmedText) {
      router.push(`/explore?text=${encodeURIComponent(trimmedText)}`);
    } else {
      router.push('/explore');
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="focus-within:border-primary focus-visible:ring-ring/50 flex w-full max-w-[150px] shrink-0 items-center justify-between gap-2 rounded-md border px-2 py-1 focus-visible:ring-[3px] sm:max-w-[300px] lg:p-2"
    >
      <input
        type="text"
        placeholder="جستجو کنید ..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="w-full flex-1 outline-none"
      />
      <button type="submit">
        <SearchIcon className="hover:text-primary text-muted-foreground size-4 shrink-0 transition-colors lg:size-5" />
      </button>
    </form>
  );
};
