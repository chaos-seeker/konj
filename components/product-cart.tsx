'use client';

import type { TBook } from '@/types/book';
import { MessageCircle, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type ProductCartNormalizedProps = {
  id: string | number;
  title: string;
  author: string;
  image: string;
  price: number;
  discount?: number;
  slug: string;
  rating: number;
  commments: number;
};

type ProductCartProps = ProductCartNormalizedProps | { book: TBook };

export const ProductCart = (props: ProductCartProps) => {
  const normalized: ProductCartNormalizedProps =
    'book' in props
      ? {
          id: props.book.id,
          title: props.book.name,
          author:
            props.book.authors?.[0]?.fullName ||
            props.book.publisher?.name ||
            '',
          image: props.book.image || '/images/temp/product.png',
          price: props.book.price,
          discount: props.book.discount || 0,
          slug: props.book.slug,
          rating:
            props.book.comments && props.book.comments.length > 0
              ? props.book.comments.reduce((s, c) => s + (c.rating || 0), 0) /
                props.book.comments.length
              : 3,
          commments: props.book.comments ? props.book.comments.length : 0,
        }
      : props;

  const discountPrice = normalized.discount
    ? Math.round(normalized.price * (1 - (normalized.discount || 0) / 100))
    : normalized.price;
  const hasDiscount =
    normalized.discount !== undefined && normalized.discount > 0;

  return (
    <Link href={`/product/${normalized.slug}`} className="group block">
      <div className="hover:border-primary relative overflow-hidden rounded-lg border bg-white transition-colors">
        <div className="bg-gray-20 relative aspect-3/4 w-full overflow-hidden">
          <Image
            src={normalized.image}
            alt={normalized.title}
            fill
            className="rounded-[20px] object-cover p-3 duration-300"
          />
        </div>
        <div className="px-4 pt-4 pb-2 text-right">
          <h3 className="text-smp text-foreground group-hover:text-primary truncate leading-tight font-medium transition-colors">
            {normalized.title}
          </h3>
          <p className="text-muted-foreground text-sm">{normalized.author}</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Star className="fill-warning text-warning h-4 w-4 shrink-0" />
              <span className="text-muted-foreground pt-1 text-xs">
                {normalized.rating}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="fill-primary text-primary h-4 w-4 shrink-0" />
              <span className="text-muted-foreground pt-1 text-xs">
                {normalized.commments}
              </span>
            </div>
          </div>
          <hr className="my-2" />
          <div className="flex items-center justify-between gap-2 px-5">
            <span className="text-primary font-bold">
              {discountPrice.toLocaleString('fa-IR')}
            </span>
            {hasDiscount && (
              <span className="text-gray-400 line-through">
                {normalized.price.toLocaleString('fa-IR')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
