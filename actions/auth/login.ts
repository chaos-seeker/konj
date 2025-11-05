"use server";

import redis from "@/lib/upstash";
import { randomUUID } from "crypto";

export async function login(data: { username: string; password: string }) {
  try {
    let { username, password } = data;

    if (!username || !password) {
      return {
        success: false,
        error: "نام کاربری و رمز عبور الزامی است",
      } as const;
    }

    username = username.toLowerCase().trim();
    password = password.trim();

    console.log("Attempting login for username:", username);
    const userDataStr = await redis.get(`user:${username}`);
    console.log("User data from Redis:", userDataStr ? "Found" : "Not found");

    if (!userDataStr) {
      return {
        success: false,
        error: "نام کاربری یا رمز عبور اشتباه است",
      } as const;
    }

    let userData;
    try {
      userData =
        typeof userDataStr === "string" ? JSON.parse(userDataStr) : userDataStr;
    } catch (parseError) {
      console.error(
        "Error parsing user data:",
        parseError,
        "Data:",
        userDataStr
      );
      return {
        success: false,
        error: "خطا در خواندن اطلاعات کاربر",
      } as const;
    }

    console.log("Parsed user data:", {
      username: userData?.username,
      hasPassword: !!userData?.password,
    });
    console.log(
      "Comparing passwords - stored:",
      userData?.password,
      "provided:",
      password
    );

    if (!userData || userData.password !== password) {
      console.log("Password mismatch or userData missing");
      return {
        success: false,
        error: "نام کاربری یا رمز عبور اشتباه است",
      } as const;
    }

    console.log("Login successful for user:", username);
    const token = randomUUID();
    await redis.set(
      `token:${token}`,
      JSON.stringify({
        userId: userData.id,
        username: userData.username,
        fullName: userData.fullName,
        createdAt: new Date().toISOString(),
      })
    );

    return {
      success: true,
      message: "ورود با موفقیت انجام شد",
      data: {
        token,
        username: userData.username,
        fullName: userData.fullName,
      },
    } as const;
  } catch (error) {
    console.error("Error logging in:", error);
    const errorMessage = error instanceof Error ? error.message : "خطا در ورود";
    return {
      success: false,
      error: errorMessage,
    } as const;
  }
}
