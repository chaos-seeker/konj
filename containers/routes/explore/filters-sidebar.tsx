"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/actions/explore/get-categories";
import { getPublishers } from "@/actions/explore/get-publishers";
import { getTranslators } from "@/actions/explore/get-translators";
import { getAuthors } from "@/actions/explore/get-authors";
import type { TCategory } from "@/types/category";
import type { TPublisher } from "@/types/publisher";
import type { TTranslator } from "@/types/translator";
import type { TAuthor } from "@/types/author";
import { Checkbox } from "@/ui/checkbox";
import { X, Loader2 } from "lucide-react";

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
    queryKey: ["explore-categories"],
    queryFn: async () => {
      const result = await getCategories();
      return result.success ? result.data : [];
    },
  });

  const { data: publishers = [], isLoading: isLoadingPublishers } = useQuery<
    TPublisher[]
  >({
    queryKey: ["explore-publishers"],
    queryFn: async () => {
      const result = await getPublishers();
      return result.success ? result.data : [];
    },
  });

  const { data: translators = [], isLoading: isLoadingTranslators } = useQuery<
    TTranslator[]
  >({
    queryKey: ["explore-translators"],
    queryFn: async () => {
      const result = await getTranslators();
      return result.success ? result.data : [];
    },
  });

  const { data: authors = [], isLoading: isLoadingAuthors } = useQuery<
    TAuthor[]
  >({
    queryKey: ["explore-authors"],
    queryFn: async () => {
      const result = await getAuthors();
      return result.success ? result.data : [];
    },
  });

  return (
    <aside className="flex flex-col gap-6 h-full">
      {searchText && (
        <div className="rounded-xl border bg-white border-slate-200 p-4 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">جستجو: {searchText}</span>
            <button
              onClick={onClearSearch}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      )}
      <div className="rounded-xl border bg-white border-slate-200 p-4 flex flex-col">
        <h3 className="font-bold mb-3">دسته‌بندی‌ها</h3>
        {isLoadingCategories ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex flex-col gap-2 flex-1">
            {categories.map((category) => (
              <label
                key={category.slug}
                className="flex items-center gap-2 cursor-pointer hover:text-primary"
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

      <div className="rounded-xl border bg-white border-slate-200 p-4 flex flex-col">
        <h3 className="font-bold mb-3">ناشرین</h3>
        {isLoadingPublishers ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex flex-col gap-2 flex-1">
            {publishers.map((publisher) => (
              <label
                key={publisher.slug}
                className="flex items-center gap-2 cursor-pointer hover:text-primary"
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

      <div className="rounded-xl border bg-white border-slate-200 p-4 flex flex-col">
        <h3 className="font-bold mb-3">مترجمین</h3>
        {isLoadingTranslators ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex flex-col gap-2 flex-1">
            {translators.map((translator) => (
              <label
                key={translator.slug}
                className="flex items-center gap-2 cursor-pointer hover:text-primary"
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

      <div className="rounded-xl border bg-white border-slate-200 p-4 flex flex-col">
        <h3 className="font-bold mb-3">نویسندگان</h3>
        {isLoadingAuthors ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex flex-col gap-2 flex-1">
            {authors.map((author) => (
              <label
                key={author.slug}
                className="flex items-center gap-2 cursor-pointer hover:text-primary"
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
