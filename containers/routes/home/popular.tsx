import { ProductCart } from "@/components/product-cart";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { getBooks } from "@/actions/dashboard/manage-books/get-books";

export const Popular = async () => {
  const result = await getBooks();
  const books = result.success ? result.data : [];
  const sorted = books
    .slice()
    .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));

  return (
    <section>
      <div className="container flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">پر فروش ترین کتاب ها</h2>
          <Link href="/books" className="flex items-center gap-2 group">
            <span className="group-hover:text-primary transition-colors">
              مشاهده همه
            </span>
            <ArrowLeftIcon className="size-4 group-hover:text-primary shrink-0" />
          </Link>
        </div>
        <div className="lg:hidden overflow-x-auto snap-x snap-mandatory">
          <div className="flex gap-4">
            {sorted.map((item) => (
              <div
                key={item.id}
                className="min-w-[200px] max-w-[200px] snap-start shrink-0"
              >
                <ProductCart book={item} />
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:grid grid-cols-6 gap-4">
          {sorted.slice(0, 6).map((item) => (
            <ProductCart key={item.id} book={item} />
          ))}
        </div>
      </div>
    </section>
  );
};
