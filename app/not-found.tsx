import Image from "next/image";
import Link from "next/link";
import { Button } from "@/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center py-5 min-h-[calc(100dvh-200px)] px-4">
      <div className="flex flex-col items-center gap-4 max-w-2xl w-full">
        <div className="relative w-full max-w-sm aspect-square">
          <Image
            src="/images/routes/not-found/not-found.png"
            alt="404 Not Found"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-foreground">صفحه مورد نظر یافت نشد!</h1>
          <p className="text-muted-foreground subtitle max-w-md mx-auto">
            متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد.
          </p>
        </div>
        <Link href="/">
          <Button size="lg" className="gap-2">
            <Home className="w-5 h-5" />
            بازگشت به صفحه اصلی
          </Button>
        </Link>
      </div>
    </div>
  );
}

