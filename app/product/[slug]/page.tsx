import { getBook } from "@/actions/dashboard/manage-books/get-book";
import { Box } from "@/containers/routes/product/box";
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
  return <Box book={res.data} />;
}
