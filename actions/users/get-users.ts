'use server';

import { supabase } from '@/lib/supabase';

export type TUser = {
  id: string;
  username: string;
  fullName: string;
  createdAt: string;
};

export async function getUsers() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, full_name, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return {
        success: false,
        error: 'خطا در دریافت کاربران',
        data: [] as TUser[],
      } as const;
    }

    if (!data || data.length === 0) {
      return {
        success: true,
        data: [] as TUser[],
      } as const;
    }

    const users: TUser[] = data.map((user) => ({
      id: user.id,
      username: user.username,
      fullName: user.full_name,
      createdAt: user.created_at,
    }));

    return {
      success: true,
      data: users,
    } as const;
  } catch {
    return {
      success: false,
      error: 'خطا در دریافت کاربران',
      data: [] as TUser[],
    } as const;
  }
}
