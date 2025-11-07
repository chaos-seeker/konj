import { Button } from '@/ui/button';
import { Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const NotFound = () => {
  return (
    <div className="container flex min-h-[calc(100dvh-200px)] flex-shrink-0 flex-col items-center justify-center px-4 py-5">
      <div className="flex w-full max-w-2xl flex-shrink-0 flex-col items-center gap-4">
        <div className="relative aspect-square w-full max-w-sm flex-shrink-0">
          <Image
            src="/images/routes/not-found/not-found.png"
            alt="404 Not Found"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="space-y-4 text-center">
          <h1 className="text-foreground">صفحه مورد نظر یافت نشد!</h1>
          <p className="text-muted-foreground mx-auto max-w-md flex-shrink-0 text-sm">
            متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد.
          </p>
        </div>
        <Link href="/">
          <Button size="lg" className="gap-2">
            <Home className="h-5 w-5 flex-shrink-0" />
            بازگشت به صفحه اصلی
          </Button>
        </Link>
      </div>
    </div>
  );
};
