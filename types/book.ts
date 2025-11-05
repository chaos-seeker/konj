import type { TCategory } from "./category";
import type { TPublisher } from "./publisher";
import type { TAuthor } from "./author";
import type { TTranslator } from "./translator";

export type TBook = {
  id: string;
  name: string;
  slug: string;
  image?: string;
  price: number;
  discount?: number;
  description?: string;
  category: TCategory;
  publisher: TPublisher;
  authors: TAuthor[];
  translators: TTranslator[];
  pages: number;
  publicationYear: number;
  createdAt: string;
  updatedAt: string;
};
