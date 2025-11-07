'use server';

import { supabase } from '@/lib/supabase';
import type { TPublisher } from '@/types/publisher';

export async function getPublishers() {
  try {
    const res = await supabase
      .from('publishers')
      .select('id, name, slug, created_at, updated_at')
      .order('name');
    if (res.error)
      return { success: false, error: res.error.message, data: [] } as const;
    type Row = Pick<TPublisher, 'id' | 'name' | 'slug'> & {
      created_at: string;
      updated_at: string;
    };
    const data = ((res.data as Row[]) || []).map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }));
    return { success: true, data } as const;
  } catch {
    return { success: false, error: 'خطا در دریافت ناشران', data: [] } as const;
  }
}
