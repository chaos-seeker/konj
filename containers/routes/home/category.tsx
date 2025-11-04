"use client";

import Image from "next/image";
import Link from "next/link";

export const Category = () => {
  const data = [
    {
      id: 1,
      name: "کتاب صوتی",
      image: "/images/routes/home/category-1.png",
    },
    {
      id: 2,
      name: "کتاب متنی",
      image: "/images/routes/home/category-2.png",
    },
    {
      id: 3,
      name: "کتاب تاریخی",
      image: "/images/routes/home/category-3.png",
    },
    {
      id: 4,
      name: "کتاب روانشناسی",
      image: "/images/routes/home/category-4.png",
    },
    {
      id: 5,
      name: "کتاب رمان",
      image: "/images/routes/home/category-5.png",
    },
  ];

  return (
    <div className="container">
      <div className="lg:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide">
        <div className="flex gap-4">
          {data.map((item) => (
            <Link
              href={`/category/${item.id}`}
              key={item.id}
              className="flex bg-white border hover:border-primary transition-colors border-dashed py-3 rounded-lg border-2 items-center justify-center min-w-[140px] snap-start flex-shrink-0"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={50}
                height={50}
                className="pr-3"
              />
              <p className="text-caption whitespace-nowrap px-4">{item.name}</p>
            </Link>
          ))}
        </div>
      </div>
      <div className="hidden lg:flex justify-between gap-4">
        {data.map((item) => (
          <Link
            href={`/category/${item.id}`}
            key={item.id}
            className="flex bg-white border hover:border-primary transition-colors w-full border-dashed py-3 rounded-lg border-2 items-center justify-center"
          >
            <Image
              src={item.image}
              alt={item.name}
              width={50}
              height={50}
              className="pr-3"
            />
            <p className="text-caption whitespace-nowrap w-full px-4">
              {item.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};
