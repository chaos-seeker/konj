"use server";

import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";

export async function register(data: {
  fullName: string;
  username: string;
  password: string;
}) {
  try {
    let fullName = data.fullName;
    let username = data.username;
    let password = data.password;
    if (!fullName || !username || !password) {
      return {
        success: false,
        error: "تمام فیلدهای الزامی را پر کنید",
      } as const;
    }
    username = username.toLowerCase().trim();
    fullName = fullName.trim();
    password = password.trim();
    const check = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .limit(1)
      .maybeSingle();
    if (check.error) {
      return { success: false, error: check.error.message } as const;
    }
    if (check.data) {
      return {
        success: false,
        error: "این نام کاربری قبلاً استفاده شده است",
      } as const;
    }
    const userId = randomUUID();
    const insert = await supabase.from("users").insert({
      id: userId,
      full_name: fullName,
      username: username,
      password: password,
      created_at: new Date().toISOString(),
    });
    if (insert.error) {
      return { success: false, error: insert.error.message } as const;
    }

    return {
      success: true,
      message: "ثبت‌نام با موفقیت انجام شد",
      data: { username, fullName },
    } as const;
  } catch {
    return {
      success: false,
      error: "خطا در ثبت‌نام",
    } as const;
  }
}
