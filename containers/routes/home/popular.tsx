import { ProductCart } from "@/components/product-cart";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export const Popular = () => {
  const data = [
    {
      id: 1,
      title: "کتابخانه نیمه شب",
      author: "مت هیگ",
      image: "/images/temp/product.png",
      price: 100000,
      discount: 20,
      rating: 4.5,
      commments: 10,
    },
    {
      id: 2,
      title: "کتابخانه نیمه شب",
      author: "مت هیگ",
      image: "/images/temp/product.png",
      price: 100000,
      discount: 20,
      rating: 4.5,
      commments: 10,
    },
    {
      id: 3,
      title: "کتابخانه نیمه شب",
      author: "مت هیگ",
      image: "/images/temp/product.png",
      price: 100000,
      discount: 20,
      rating: 4.5,
      commments: 10,
    },
    {
      id: 4,
      title: "کتابخانه نیمه شب",
      author: "مت هیگ",
      image: "/images/temp/product.png",
      price: 100000,
      discount: 20,
      rating: 4.5,
      commments: 10,
    },
    {
      id: 5,
      title: "کتابخانه نیمه شب",
      author: "مت هیگ",
      image: "/images/temp/product.png",
      price: 100000,
      discount: 20,
      rating: 4.5,
      commments: 10,
    },
    {
      id: 6,
      title: "کتابخانه نیمه شب",
      author: "مت هیگ",
      image: "/images/temp/product.png",
      price: 100000,
      discount: 20,
      rating: 4.5,
      commments: 10,
    },
  ];
  return (
    <section>
      <div className="container flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2>پر فروش ترین کتاب ها</h2>
          <Link href="/books" className="flex items-center gap-2 group">
            <span className="group-hover:text-primary transition-colors">
              مشاهده همه
            </span>
            <ArrowLeftIcon className="size-4 group-hover:text-primary flex-shrink-0" />
          </Link>
        </div>
        <div className="lg:hidden overflow-x-auto snap-x snap-mandatory">
          <div className="flex gap-4">
            {data.map((item) => (
              <div
                key={item.id}
                className="min-w-[200px] max-w-[200px] snap-start flex-shrink-0"
              >
                <ProductCart {...item} />
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:grid grid-cols-6 gap-4">
          {data.slice(0, 6).map((item) => (
            <ProductCart key={item.id} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};
