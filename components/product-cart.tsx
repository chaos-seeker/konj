"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Star } from "lucide-react";

interface ProductCartProps {
  id: string | number;
  title: string;
  author: string;
  image: string;
  price: number;
  discount?: number;
  rating: number;
  commments: number;
}

export const ProductCart = (props: ProductCartProps) => {
  const discountPrice = props.discount
    ? Math.round(props.price * (1 - props.discount / 100))
    : props.price;
  const hasDiscount = props.discount !== undefined && props.discount > 0;

  return (
    <Link href={`/product/${props.id}`} className="block group">
      <div className="relative bg-white rounded-lg overflow-hidden border hover:border-primary transition-colors">
        <div className="relative bg-gray-20 w-full aspect-3/4 overflow-hidden">
          <Image
            src={props.image}
            alt={props.title}
            fill
            className="object-cover duration-300 p-3 rounded-[20px]"
          />
        </div>
        <div className="px-4 pt-4 pb-2 text-right">
          <h3 className="font-bold truncate text-foreground leading-tight group-hover:text-primary transition-colors">
            {props.title}
          </h3>
          <p className="text-sm text-muted-foreground">{props.author}</p>
          <div className="flex mt-2 items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-warning text-warning flex-shrink-0" />
              <span className="text-xs pt-1 text-muted-foreground">
                {props.rating.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4 fill-primary text-primary flex-shrink-0" />
              <span className="text-xs pt-1 text-muted-foreground">
                {props.commments}
              </span>
            </div>
          </div>
          <hr className="my-2" />
          <div className="flex items-center px-3 justify-between gap-2">
            <span className="text-base font-bold text-primary">
              {discountPrice.toLocaleString("fa-IR")} تومان
            </span>
            {hasDiscount && (
              <span className="text-smp text-gray-400 line-through">
                {props.price.toLocaleString("fa-IR")}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
