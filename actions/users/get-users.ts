"use server";

import redis from "@/lib/upstash";

export type TUser = {
  id: string;
  username: string;
  fullName: string;
  createdAt: string;
};

export async function getUsers() {
  try {
    const usernames = await redis.zrange("users:list", 0, -1);

    if (!usernames || usernames.length === 0) {
      return {
        success: true,
        data: [] as TUser[],
      } as const;
    }

    const users = await Promise.all(
      usernames.map(async (username) => {
        const userStr = await redis.get(`user:${username}`);
        if (!userStr) return null;
        const user = typeof userStr === "string" ? JSON.parse(userStr) : userStr;
        return {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          createdAt: user.createdAt,
        };
      })
    );

    const validUsers = users.filter((u): u is TUser => u !== null);

    validUsers.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      success: true,
      data: validUsers,
    } as const;
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      error: "خطا در دریافت کاربران",
      data: [] as TUser[],
    } as const;
  }
}

