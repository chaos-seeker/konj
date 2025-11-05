import { getBook } from "@/actions/dashboard/manage-books/get-book";
import { Box } from "@/containers/routes/product/box";
import { Description } from "@/containers/routes/product/description";
import { Comments } from "@/containers/routes/product/comments";
import { AddNewComment } from "@/containers/routes/product/add-new-comment";
import { RelatedByAuthor } from "@/containers/routes/product/related-by-author";
import { RelatedByPublisher } from "@/containers/routes/product/related-by-publisher";
import { ViewportAnimation } from "@/components/viewport-animation";
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
      <ViewportAnimation>
        <div className="items-center flex flex-col gap-6 justify-center py-10">
          <Image
            src="/images/global/not-found.png"
            alt="empty"
            width={200}
            height={200}
          />
          <p className="text-muted-foreground">کتاب یافت نشد!</p>
        </div>
      </ViewportAnimation>
    );
  return (
    <>
      <ViewportAnimation>
        <div className="grid grid-cols-1 gap-6 container md:grid-cols-2">
          <ViewportAnimation>
            <div className="flex flex-col gap-6">
              <ViewportAnimation>
                <Box book={res.data} />
              </ViewportAnimation>
              <ViewportAnimation>
                <Description description={res.data.description} />
              </ViewportAnimation>
              <div className="md:hidden flex flex-col gap-6">
                <ViewportAnimation>
                  <Comments book={res.data} />
                </ViewportAnimation>
                <ViewportAnimation>
                  <AddNewComment book={res.data} />
                </ViewportAnimation>
              </div>
            </div>
          </ViewportAnimation>
          <ViewportAnimation>
            <div className="hidden md:flex flex-col gap-6">
              <ViewportAnimation>
                <Comments book={res.data} />
              </ViewportAnimation>
              <ViewportAnimation>
                <AddNewComment book={res.data} />
              </ViewportAnimation>
            </div>
          </ViewportAnimation>
        </div>
      </ViewportAnimation>
      <ViewportAnimation>
        <div className="container flex flex-col gap-6">
          <ViewportAnimation>
            <RelatedByAuthor book={res.data} />
          </ViewportAnimation>
          <ViewportAnimation>
            <RelatedByPublisher book={res.data} />
          </ViewportAnimation>
        </div>
      </ViewportAnimation>
    </>
  );
}
