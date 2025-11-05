"use server";

import redis from "@/lib/upstash";
import { randomUUID } from "crypto";

export async function addComment(data: {
  bookSlug: string;
  fullName: string;
  text: string;
  rating: number;
  token: string;
}) {
  try {
    const { bookSlug, fullName, text, rating, token } = data;

    if (!bookSlug || !fullName || !text || !rating || !token) {
      return {
        success: false,
        error: "تمام فیلدهای الزامی را پر کنید",
      } as const;
    }

    const tokenDataStr = await redis.get(`token:${token}`);
    if (!tokenDataStr) {
      return {
        success: false,
        error: "لطفاً دوباره وارد شوید",
      } as const;
    }

    const tokenData = typeof tokenDataStr === "string" ? JSON.parse(tokenDataStr) : tokenDataStr;

    const commentId = randomUUID();
    const comment = {
      id: commentId,
      bookSlug,
      fullName,
      text,
      rating,
      status: "pending" as const,
      createdAt: new Date().toISOString(),
    };

    await redis.set(`comment:${commentId}`, JSON.stringify(comment));
    
    await redis.zadd(`book:${bookSlug}:comments:pending`, {
      score: Date.now(),
      member: commentId,
    });

    await redis.zadd("comments:pending", {
      score: Date.now(),
      member: commentId,
    });

    return {
      success: true,
      message: "نظر شما با موفقیت ثبت شد و در انتظار تایید است",
      data: comment,
    } as const;
  } catch (error) {
    console.error("Error adding comment:", error);
    return {
      success: false,
      error: "خطا در ثبت نظر",
    } as const;
  }
}

