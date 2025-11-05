"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserOrders } from "@/actions/orders/get-user-orders";
import type { TOrder } from "@/actions/orders/get-orders";
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

interface UserOrdersListProps {
  fullName: string;
}

export function UserOrdersList({ fullName }: UserOrdersListProps) {
  const { data: orders = [], isLoading } = useQuery<TOrder[]>({
    queryKey: ["user-orders", fullName],
    queryFn: async () => {
      const result = await getUserOrders(fullName);
      return result.success ? result.data : [];
    },
    enabled: !!fullName,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="items-center flex flex-col gap-6 justify-center py-10">
        <Image
          src="/images/global/not-found.png"
          alt="empty"
          width={200}
          height={200}
        />
        <p className="text-muted-foreground">سفارشی یافت نشد!</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white border-slate-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>تاریخ</TableHead>
            <TableHead>قیمت کل</TableHead>
            <TableHead>مقدار تخفیف</TableHead>
            <TableHead>قیمت نهایی</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>
                {order.totalPrice.toLocaleString()} تومان
              </TableCell>
              <TableCell>
                {order.totalDiscount > 0 ? (
                  <span>
                    -{order.totalDiscount.toLocaleString()} تومان
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {order.finalPrice.toLocaleString()} تومان
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

