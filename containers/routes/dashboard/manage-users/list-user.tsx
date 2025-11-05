"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/actions/users/get-users";
import type { TUser } from "@/actions/users/get-users";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { formatDate } from "@/utils/format-date";

export function ListUser() {
  const { data: users = [], isLoading } = useQuery<TUser[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const result = await getUsers();
      return result.success ? result.data : [];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="items-center flex flex-col gap-6 justify-center py-10">
        <Image
          src="/images/global/not-found.png"
          alt="empty"
          width={200}
          height={200}
        />
        <p className="text-muted-foreground">کاربری یافت نشد!</p>
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
                <TableHead>نام کاربری</TableHead>
                <TableHead>نام و نام خانوادگی</TableHead>
                <TableHead>تاریخ ثبت‌نام</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {user.username}
                    </code>
                  </TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
