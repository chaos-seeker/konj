"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { getPublishers } from "@/actions/get-publishers";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export function ListPublisher() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["publishers"],
    queryFn: async () => {
      const result = await getPublishers();
      if (!result.success) {
        toast.error(result.error!);
      }
      return result.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-destructive">
          {error instanceof Error ? error.message : "خطا در دریافت ناشران"}
        </p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="items-center flex flex-col gap-6 justify-center py-10">
        <Image
          src="/images/global/not-found.png"
          alt="empty"
          width={200}
          height={200}
        />
        <p className="text-muted-foreground">ناشری یافت نشد!</p>
      </div>
    );
  }

  return (
    <section>
      <div className="container">
        <div className="rounded-xl border bg-white border-slate-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">تصویر</TableHead>
                <TableHead>نام</TableHead>
                <TableHead>اسلاگ</TableHead>
                <TableHead>تاریخ ایجاد</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((publisher) => (
                <TableRow key={publisher.id}>
                  <TableCell>
                    <div className="relative size-16 rounded-md overflow-hidden">
                      <Image
                        src={publisher.image}
                        alt={publisher.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {publisher.name}
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {publisher.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    {new Date(publisher.createdAt).toLocaleDateString("fa-IR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
