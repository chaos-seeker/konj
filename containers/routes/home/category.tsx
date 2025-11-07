'use client';

import Image from 'next/image';
import Link from 'next/link';

export const Category = () => {
  const data = [
    {
      id: 1,
      name: 'کتاب صوتی',
      image: '/images/routes/home/category-1.png',
    },
    {
      id: 2,
      name: 'کتاب متنی',
      image: '/images/routes/home/category-2.png',
    },
    {
      id: 3,
      name: 'کتاب تاریخی',
      image: '/images/routes/home/category-3.png',
    },
    {
      id: 4,
      name: 'کتاب روانشناسی',
      image: '/images/routes/home/category-4.png',
    },
    {
      id: 5,
      name: 'کتاب رمان',
      image: '/images/routes/home/category-5.png',
    },
  ];

  return (
    <div className="container">
      <div className="snap-x snap-mandatory overflow-x-auto lg:hidden">
        <div className="flex gap-4">
          {data.map((item) => (
            <Link
              href={`/explore`}
              key={item.id}
              className="hover:border-primary flex min-w-[140px] flex-shrink-0 snap-start items-center justify-center rounded-lg border border-2 border-dashed bg-white py-3 transition-colors"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={50}
                height={50}
                className="pr-3"
              />
              <p className="px-4 text-xs whitespace-nowrap">{item.name}</p>
            </Link>
          ))}
        </div>
      </div>
      <div className="hidden justify-between gap-4 lg:flex">
        {data.map((item) => (
          <Link
            href={`/explore/category/${item.id}`}
            key={item.id}
            className="hover:border-primary flex w-full items-center justify-center rounded-lg border border-2 border-dashed bg-white py-3 transition-colors"
          >
            <Image
              src={item.image}
              alt={item.name}
              width={50}
              height={50}
              className="pr-3"
            />
            <p className="w-full px-4 text-xs whitespace-nowrap">{item.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
