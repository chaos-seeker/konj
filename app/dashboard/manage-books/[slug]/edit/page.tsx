import { EditBookForm } from "@/containers/routes/dashboard/manage-books/edit-book-form";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <>
      <EditBookForm slug={slug} />
    </>
  );
}
