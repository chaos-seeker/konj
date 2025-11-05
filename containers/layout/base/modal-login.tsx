"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useKillua } from "killua";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { Input } from "@/ui/input";
import toast from "react-hot-toast";
import { userSlice } from "@/slices/user";
import { login } from "@/actions/auth/login";

const loginSchema = z.object({
  username: z.string().min(1, "نام کاربری الزامی است"),
  password: z.string().min(1, "رمز عبور الزامی است"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface ModalLoginProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToRegister?: () => void;
}

export function ModalLogin({
  open,
  onOpenChange,
  onSwitchToRegister,
}: ModalLoginProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useKillua(userSlice);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      const result = await login(values);
      if (!result.success) {
        toast.error(result.error || "خطا در ورود");
        return;
      }

      if (result.data) {
        user.reducers.setUser({
          token: result.data.token,
          username: result.data.username,
          fullName: result.data.fullName,
        });
      }

      toast.success(result.message || "ورود با موفقیت انجام شد");
      form.reset();
      onOpenChange(false);
    } catch {
      toast.error("خطا در ورود");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ورود</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام کاربری</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="نام کاربری خود را وارد کنید"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رمز عبور</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="رمز عبور خود را وارد کنید"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex-col gap-2">
              <Button
                type="submit"
                disabled={!form.formState.isValid || isSubmitting}
                className="w-full h-11"
              >
                {isSubmitting ? "در حال ورود..." : "ورود"}
              </Button>
              {onSwitchToRegister && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    onSwitchToRegister();
                  }}
                  className="text-sm text-primary pt-1 hover:underline"
                >
                  حساب کاربری ندارید؟ ثبت‌نام کنید
                </button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
