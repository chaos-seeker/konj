'use client';

import { getAuthors } from '@/actions/explore/get-authors';
import { getCategories } from '@/actions/explore/get-categories';
import { getPublishers } from '@/actions/explore/get-publishers';
import { getTranslators } from '@/actions/explore/get-translators';
import type { TAuthor } from '@/types/author';
import type { TCategory } from '@/types/category';
import type { TPublisher } from '@/types/publisher';
import type { TTranslator } from '@/types/translator';
import { Checkbox } from '@/ui/checkbox';
import { useQuery } from '@tanstack/react-query';
import { Loader2, X } from 'lucide-react';

interface FiltersSidebarProps {
  searchText?: string;
  selectedCategories: string[];
  selectedPublishers: string[];
  selectedTranslators: string[];
  selectedAuthors: string[];
  onCategoryToggle: (slug: string) => void;
  onPublisherToggle: (slug: string) => void;
  onTranslatorToggle: (slug: string) => void;
  onAuthorToggle: (slug: string) => void;
  onClearSearch: () => void;
}

export function FiltersSidebar({
  searchText,
  selectedCategories,
  selectedPublishers,
  selectedTranslators,
  selectedAuthors,
  onCategoryToggle,
  onPublisherToggle,
  onTranslatorToggle,
  onAuthorToggle,
  onClearSearch,
}: FiltersSidebarProps) {
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<
    TCategory[]
  >({
    queryKey: ['explore-categories'],
    queryFn: async () => {
      const result = await getCategories();
      return result.success ? result.data : [];
    },
  });

  const { data: publishers = [], isLoading: isLoadingPublishers } = useQuery<
    TPublisher[]
  >({
    queryKey: ['explore-publishers'],
    queryFn: async () => {
      const result = await getPublishers();
      return result.success ? result.data : [];
    },
  });

  const { data: translators = [], isLoading: isLoadingTranslators } = useQuery<
    TTranslator[]
  >({
    queryKey: ['explore-translators'],
    queryFn: async () => {
      const result = await getTranslators();
      return result.success ? result.data : [];
    },
  });

  const { data: authors = [], isLoading: isLoadingAuthors } = useQuery<
    TAuthor[]
  >({
    queryKey: ['explore-authors'],
    queryFn: async () => {
      const result = await getAuthors();
      return result.success ? result.data : [];
    },
  });

  return (
    <aside className="flex h-full flex-col gap-6">
      {searchText && (
        <div className="shrink-0 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">جستجو: {searchText}</span>
            <button
              onClick={onClearSearch}
              className="hover:bg-muted rounded p-1 transition-colors"
            >
              <X className="text-muted-foreground size-4" />
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-3 font-bold">دسته‌بندی‌ها</h3>
        {isLoadingCategories ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-2">
            {categories.map((category) => (
              <label
                key={category.slug}
                className="hover:text-primary flex cursor-pointer items-center gap-2"
              >
                <Checkbox
                  checked={selectedCategories.includes(category.slug)}
                  onCheckedChange={() => onCategoryToggle(category.slug)}
                />
                <span className="text-sm">{category.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-3 font-bold">ناشرین</h3>
        {isLoadingPublishers ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-2">
            {publishers.map((publisher) => (
              <label
                key={publisher.slug}
                className="hover:text-primary flex cursor-pointer items-center gap-2"
              >
                <Checkbox
                  checked={selectedPublishers.includes(publisher.slug)}
                  onCheckedChange={() => onPublisherToggle(publisher.slug)}
                />
                <span className="text-sm">{publisher.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-3 font-bold">مترجمین</h3>
        {isLoadingTranslators ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-2">
            {translators.map((translator) => (
              <label
                key={translator.slug}
                className="hover:text-primary flex cursor-pointer items-center gap-2"
              >
                <Checkbox
                  checked={selectedTranslators.includes(translator.slug)}
                  onCheckedChange={() => onTranslatorToggle(translator.slug)}
                />
                <span className="text-sm">{translator.fullName}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-3 font-bold">نویسندگان</h3>
        {isLoadingAuthors ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-2">
            {authors.map((author) => (
              <label
                key={author.slug}
                className="hover:text-primary flex cursor-pointer items-center gap-2"
              >
                <Checkbox
                  checked={selectedAuthors.includes(author.slug)}
                  onCheckedChange={() => onAuthorToggle(author.slug)}
                />
                <span className="text-sm">{author.fullName}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
