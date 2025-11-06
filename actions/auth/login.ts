"use server";

import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";

export async function login(data: { username: string; password: string }) {
  try {
    let username = data.username;
    let password = data.password;
    if (!username || !password) {
      return {
        success: false,
        error: "نام کاربری و رمز عبور الزامی است",
      } as const;
    }
    username = username.toLowerCase().trim();
    password = password.trim();
    const res = await supabase
      .from("users")
      .select("id, username, full_name, password")
      .eq("username", username)
      .limit(1)
      .single();
    if (res.error || !res.data) {
      return {
        success: false,
        error: "نام کاربری یا رمز عبور اشتباه است",
      } as const;
    }
    const user = res.data as {
      id: string;
      username: string;
      full_name: string;
      password: string;
    };
    if (user.password !== password) {
      return {
        success: false,
        error: "نام کاربری یا رمز عبور اشتباه است",
      } as const;
    }
    const token = randomUUID();

    return {
      success: true,
      message: "ورود با موفقیت انجام شد",
      data: {
        token,
        username: user.username,
        fullName: user.full_name,
      },
    } as const;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "خطا در ورود";
    return {
      success: false,
      error: errorMessage,
    } as const;
  }
}
