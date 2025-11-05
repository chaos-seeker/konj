"use server";

import redis from "@/lib/upstash";
import { randomUUID } from "crypto";

export async function register(data: {
  fullName: string;
  username: string;
  password: string;
}) {
  try {
    let { fullName, username, password } = data;

    if (!fullName || !username || !password) {
      return {
        success: false,
        error: "تمام فیلدهای الزامی را پر کنید",
      } as const;
    }

    username = username.toLowerCase().trim();
    fullName = fullName.trim();
    password = password.trim();

    const existingUser = await redis.get(`user:${username}`);
    if (existingUser) {
      return {
        success: false,
        error: "این نام کاربری قبلاً استفاده شده است",
      } as const;
    }

    const userId = randomUUID();
    const userData = {
      id: userId,
      fullName,
      username,
      password,
      createdAt: new Date().toISOString(),
    };

    await redis.set(`user:${username}`, JSON.stringify(userData));
    await redis.zadd("users:list", { score: Date.now(), member: username });

    return {
      success: true,
      message: "ثبت‌نام با موفقیت انجام شد",
      data: { username, fullName },
    } as const;
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      success: false,
      error: "خطا در ثبت‌نام",
    } as const;
  }
}

