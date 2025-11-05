import { getBook } from "@/actions/dashboard/manage-books/get-book";
import { Box } from "@/containers/routes/product/box";
import { Description } from "@/containers/routes/product/description";
import { Comments } from "@/containers/routes/product/comments";
import { AddNewComment } from "@/containers/routes/product/add-new-comment";
import { RelatedByAuthor } from "@/containers/routes/product/related-by-author";
import { RelatedByPublisher } from "@/containers/routes/product/related-by-publisher";
import Image from "next/image";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getBook(slug);
  if (!res.success || !res.data)
    return (
      <div className="items-center flex flex-col gap-6 justify-center py-10">
        <Image
          src="/images/global/not-found.png"
          alt="empty"
          width={200}
          height={200}
        />
        <p className="text-muted-foreground">کتاب یافت نشد!</p>
      </div>
    );
  return (
    <>
      <div className="grid grid-cols-1 gap-6 container md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Box book={res.data} />
          <Description description={res.data.description} />
          <div className="md:hidden flex flex-col gap-6">
            <Comments book={res.data} />
            <AddNewComment book={res.data} />
          </div>
        </div>
        <div className="hidden md:flex flex-col gap-6">
          <Comments book={res.data} />
          <AddNewComment book={res.data} />
        </div>
      </div>
      <div className="container flex flex-col gap-6">
        <RelatedByAuthor book={res.data} />
        <RelatedByPublisher book={res.data} />
      </div>
    </>
  );
}
