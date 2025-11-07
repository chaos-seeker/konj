import { getBook } from '@/actions/dashboard/manage-books/get-book';
import { ViewportAnimation } from '@/components/viewport-animation';
import { AddNewComment } from '@/containers/routes/product/add-new-comment';
import { Box } from '@/containers/routes/product/box';
import { Comments } from '@/containers/routes/product/comments';
import { Description } from '@/containers/routes/product/description';
import { RelatedByAuthor } from '@/containers/routes/product/related-by-author';
import { RelatedByPublisher } from '@/containers/routes/product/related-by-publisher';
import Image from 'next/image';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getBook(slug);
  if (!res.success || !res.data)
    return (
      <ViewportAnimation className="flex flex-col items-center justify-center gap-6 py-10">
        <Image
          src="/images/global/not-found.png"
          alt="empty"
          width={200}
          height={200}
        />
        <p className="text-muted-foreground">کتاب یافت نشد!</p>
      </ViewportAnimation>
    );
  return (
    <>
      <ViewportAnimation className="container grid grid-cols-1 gap-6 md:grid-cols-2">
        <ViewportAnimation className="flex flex-col gap-6">
          <ViewportAnimation>
            <Box book={res.data} />
          </ViewportAnimation>
          <ViewportAnimation>
            <Description description={res.data.description} />
          </ViewportAnimation>
          <div className="flex flex-col gap-6 md:hidden">
            <ViewportAnimation>
              <Comments book={res.data} />
            </ViewportAnimation>
            <ViewportAnimation>
              <AddNewComment book={res.data} />
            </ViewportAnimation>
          </div>
        </ViewportAnimation>
        <ViewportAnimation className="hidden flex-col gap-6 md:flex">
          <ViewportAnimation>
            <Comments book={res.data} />
          </ViewportAnimation>
          <ViewportAnimation>
            <AddNewComment book={res.data} />
          </ViewportAnimation>
        </ViewportAnimation>
      </ViewportAnimation>
      <ViewportAnimation className="container flex flex-col gap-6">
        <ViewportAnimation>
          <RelatedByAuthor book={res.data} />
        </ViewportAnimation>
        <ViewportAnimation>
          <RelatedByPublisher book={res.data} />
        </ViewportAnimation>
      </ViewportAnimation>
    </>
  );
}
