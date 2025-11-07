'use client';

import { BooksList } from '@/containers/routes/explore/books-list';
import { FiltersSidebar } from '@/containers/routes/explore/filters-sidebar';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';

export function ExploreContent() {
  const [searchText, setSearchText] = useQueryState(
    'text',
    parseAsString.withDefault(''),
  );

  const [selectedCategories, setSelectedCategories] = useQueryState(
    'categories',
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  const [selectedPublishers, setSelectedPublishers] = useQueryState(
    'publishers',
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  const [selectedTranslators, setSelectedTranslators] = useQueryState(
    'translators',
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  const [selectedAuthors, setSelectedAuthors] = useQueryState(
    'authors',
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  const handleCategoryToggle = (slug: string) => {
    const newCategories = selectedCategories.includes(slug)
      ? selectedCategories.filter((c) => c !== slug)
      : [...selectedCategories, slug];
    setSelectedCategories(newCategories.length > 0 ? newCategories : null);
  };

  const handlePublisherToggle = (slug: string) => {
    const newPublishers = selectedPublishers.includes(slug)
      ? selectedPublishers.filter((p) => p !== slug)
      : [...selectedPublishers, slug];
    setSelectedPublishers(newPublishers.length > 0 ? newPublishers : null);
  };

  const handleTranslatorToggle = (slug: string) => {
    const newTranslators = selectedTranslators.includes(slug)
      ? selectedTranslators.filter((t) => t !== slug)
      : [...selectedTranslators, slug];
    setSelectedTranslators(newTranslators.length > 0 ? newTranslators : null);
  };

  const handleAuthorToggle = (slug: string) => {
    const newAuthors = selectedAuthors.includes(slug)
      ? selectedAuthors.filter((a) => a !== slug)
      : [...selectedAuthors, slug];
    setSelectedAuthors(newAuthors.length > 0 ? newAuthors : null);
  };

  return (
    <div className="container flex-1">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:sticky lg:top-6 lg:col-span-1 lg:self-start">
          <FiltersSidebar
            searchText={searchText || undefined}
            selectedCategories={selectedCategories}
            selectedPublishers={selectedPublishers}
            selectedTranslators={selectedTranslators}
            selectedAuthors={selectedAuthors}
            onCategoryToggle={handleCategoryToggle}
            onPublisherToggle={handlePublisherToggle}
            onTranslatorToggle={handleTranslatorToggle}
            onAuthorToggle={handleAuthorToggle}
            onClearSearch={() => setSearchText(null)}
          />
        </div>
        <div className="lg:col-span-3">
          <BooksList
            searchText={searchText || undefined}
            categories={selectedCategories}
            publishers={selectedPublishers}
            translators={selectedTranslators}
            authors={selectedAuthors}
          />
        </div>
      </div>
    </div>
  );
}
