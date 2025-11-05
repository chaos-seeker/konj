"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Star } from "lucide-react";
import type { TBook } from "@/types/book";

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
    "book" in props
      ? {
          id: props.book.id,
          title: props.book.name,
          author:
            props.book.authors?.[0]?.fullName ||
            props.book.publisher?.name ||
            "",
          image: props.book.image || "/images/temp/product.png",
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
    <Link href={`/product/${normalized.slug}`} className="block group">
      <div className="relative bg-white rounded-lg overflow-hidden border hover:border-primary transition-colors">
        <div className="relative bg-gray-20 w-full aspect-3/4 overflow-hidden">
          <Image
            src={normalized.image}
            alt={normalized.title}
            fill
            className="object-cover duration-300 p-3 rounded-[20px]"
          />
        </div>
        <div className="px-4 pt-4 pb-2 text-right">
          <h3 className="font-medium text-smp truncate text-foreground leading-tight group-hover:text-primary transition-colors">
            {normalized.title}
          </h3>
          <p className="text-sm text-muted-foreground">{normalized.author}</p>
          <div className="flex mt-2 items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-warning text-warning shrink-0" />
              <span className="text-xs pt-1 text-muted-foreground">
                {normalized.rating}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4 fill-primary text-primary shrink-0" />
              <span className="text-xs pt-1 text-muted-foreground">
                {normalized.commments}
              </span>
            </div>
          </div>
          <hr className="my-2" />
          <div className="flex items-center px-5 justify-between gap-2">
            <span className="font-bold text-primary">
              {discountPrice.toLocaleString("fa-IR")}
            </span>
            {hasDiscount && (
              <span className="text-gray-400 line-through">
                {normalized.price.toLocaleString("fa-IR")}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
