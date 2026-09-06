'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type PageContent = Record<string, string>;

export function usePageContent<T extends PageContent>(page: string, section: string, fallback: T) {
  const [content, setContent] = useState<T>(fallback);

  useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      const { data, error } = await supabase
        .from('page_content')
        .select('field, value')
        .eq('page', page)
        .eq('section', section)
        .eq('published', true);

      if (cancelled || error || !data || data.length === 0) return;

      const nextContent = { ...fallback } as PageContent;
      for (const row of data) {
        if (row.field && typeof row.value === 'string') nextContent[row.field] = row.value;
      }
      if (!cancelled) setContent(nextContent as T);
    }

    void loadContent();
    return () => {
      cancelled = true;
    };
  }, [fallback, page, section]);

  return content;
}
