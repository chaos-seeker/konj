import { EditBookForm } from "@/containers/routes/dashboard/manage-books/edit-book-form";

export default function EditBookPage({ params }: { params: { slug: string } }) {
  return (
    <>
      <EditBookForm slug={params.slug} />
    </>
  );
}
