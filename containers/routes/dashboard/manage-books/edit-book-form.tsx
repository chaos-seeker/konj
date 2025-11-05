"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";
import { Button } from "@/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { InputImage } from "@/components/input-image";
import toast from "react-hot-toast";
import { updateBook } from "@/actions/dashboard/manage-books/update-book";
import { getBook } from "@/actions/dashboard/manage-books/get-book";
import { getCategories } from "@/actions/dashboard/manage-categories/get-categories";
import { getPublishers } from "@/actions/dashboard/manage-publishers/get-publishers";
import { getAuthors } from "@/actions/dashboard/manage-authors/get-authors";
import { getBooks } from "@/actions/dashboard/manage-books/get-books";
import { getTranslators } from "@/actions/dashboard/manage-translators/get-translators";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import MultipleSelector from "@/ui/multiple-selector";

const bookSchema = z.object({
  name: z.string().min(1, "نام الزامی است"),
  slug: z
    .string()
    .min(1, "اسلاگ الزامی است")
    .regex(/^[a-z0-9-]+$/, "اسلاگ باید انگلیسی و بدون فاصله باشد"),
  image: z.instanceof(File).nullable().optional(),
  price: z.string().min(1, "قیمت الزامی است"),
  discount: z.string().optional(),
  description: z.string().min(1, "توضیحات الزامی است"),
  categorySlug: z.string().min(1, "دسته بندی الزامی است"),
  publisherSlug: z.string().min(1, "ناشر الزامی است"),
  authorSlugs: z.array(z.string()).min(1, "حداقل یک نویسنده الزامی است"),
  translatorSlugs: z.array(z.string()).min(1, "حداقل یک مترجم الزامی است"),
  pages: z.string().min(1, "تعداد صفحات الزامی است"),
  publicationYear: z.string().min(1, "سال انتشار الزامی است"),
});

type BookFormValues = z.infer<typeof bookSchema>;

interface EditBookFormProps {
  slug: string;
}

export function EditBookForm({ slug }: EditBookFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      name: "",
      slug: "",
      image: null,
      price: "",
      discount: "",
      description: "",
      categorySlug: "",
      publisherSlug: "",
      authorSlugs: [],
      translatorSlugs: [],
      pages: "",
      publicationYear: "",
    },
  });

  const {
    data: book,
    isLoading: isLoadingBook,
    isError,
  } = useQuery({
    queryKey: ["book", slug],
    queryFn: async () => {
      const raw = decodeURIComponent(slug || "").trim();
      const lower = raw.toLowerCase();

      const direct = await getBook(raw);
      if (direct.success && direct.data) return direct.data;

      if (lower !== raw) {
        const directLower = await getBook(lower);
        if (directLower.success && directLower.data) return directLower.data;
      }

      const all = await getBooks();
      if (all.success && Array.isArray(all.data)) {
        const found = all.data.find((b) => {
          const bs = String(b.slug || "").trim();
          return bs === raw || bs.toLowerCase() === lower;
        });
        if (found) return found;
      }
      throw new Error("NOT_FOUND");
    },
    enabled: !!slug,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 0,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const result = await getCategories();
      return result.success ? result.data : [];
    },
  });

  const { data: publishers } = useQuery({
    queryKey: ["publishers"],
    queryFn: async () => {
      const result = await getPublishers();
      return result.success ? result.data : [];
    },
  });

  const { data: authors } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const result = await getAuthors();
      return result.success ? result.data : [];
    },
  });

  const { data: translators } = useQuery({
    queryKey: ["translators"],
    queryFn: async () => {
      const result = await getTranslators();
      return result.success ? result.data : [];
    },
  });

  useEffect(() => {
    if (book) {
      form.reset({
        name: book.name,
        slug: book.slug,
        image: null,
        price: book.price.toString(),
        discount: book.discount?.toString() || "",
        description: book.description || "",
        categorySlug: book.category.slug,
        publisherSlug: book.publisher.slug,
        authorSlugs: book.authors.map((a) => a.slug),
        translatorSlugs: book.translators.map((t) => t.slug),
        pages: book.pages.toString(),
        publicationYear: book.publicationYear.toString(),
      });
    }
  }, [book, form]);

  const onSubmit = async (data: BookFormValues) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);
      formData.append("price", data.price);
      if (data.discount) {
        formData.append("discount", data.discount);
      }
      if (data.description) {
        formData.append("description", data.description);
      }
      formData.append("categorySlug", data.categorySlug);
      formData.append("publisherSlug", data.publisherSlug);
      formData.append("authorSlugs", JSON.stringify(data.authorSlugs));
      formData.append("translatorSlugs", JSON.stringify(data.translatorSlugs));
      formData.append("pages", data.pages);
      formData.append("publicationYear", data.publicationYear);

      if (data.image) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result as string;
          formData.append("image", base64);
          const result = await updateBook(slug, formData);
          if (!result.success) {
            throw new Error(result.error || "خطا در به‌روزرسانی کتاب");
          }
          toast.success(result.message || "کتاب با موفقیت به‌روزرسانی شد");
          await queryClient.invalidateQueries({ queryKey: ["book", slug] });
          await queryClient.invalidateQueries({ queryKey: ["books"] });
          router.push("/dashboard/manage-books");
        };
        reader.readAsDataURL(data.image);
      } else {
        // Keep existing image if no new image is uploaded
        if (book?.image) {
          formData.append("image", book.image);
        }
        const result = await updateBook(slug, formData);
        if (!result.success) {
          throw new Error(result.error || "خطا در به‌روزرسانی کتاب");
        }
        toast.success(result.message || "کتاب با موفقیت به‌روزرسانی شد");
        await queryClient.invalidateQueries({ queryKey: ["book", slug] });
        await queryClient.invalidateQueries({ queryKey: ["books"] });
        router.push("/dashboard/manage-books");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "خطا در به‌روزرسانی کتاب"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingBook) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !book) {
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
  }

  return (
    <section className="container">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسلاگ</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-]/g, "");
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تصویر</FormLabel>
                <FormControl>
                  <InputImage
                    value={field.value}
                    onChange={field.onChange}
                    preview={book.image || null}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>قیمت (تومان)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تخفیف (درصد)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" max="100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>توضیحات</FormLabel>
                <FormControl>
                  <Textarea rows={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="categorySlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>دسته بندی</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب دسته بندی" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.slug} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="publisherSlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ناشر</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب ناشر" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {publishers?.map((publisher) => (
                        <SelectItem key={publisher.slug} value={publisher.slug}>
                          {publisher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="authorSlugs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نویسندگان</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      value={authors
                        ?.filter((author) => field.value?.includes(author.slug))
                        .map((author) => ({
                          value: author.slug,
                          label: author.fullName,
                        }))}
                      onChange={(options) => {
                        field.onChange(options.map((opt) => opt.value));
                      }}
                      options={authors?.map((author) => ({
                        value: author.slug,
                        label: author.fullName,
                      }))}
                      placeholder="انتخاب نویسندگان"
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 text-smp">
                          نویسنده‌ای یافت نشد.
                        </p>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="translatorSlugs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>مترجمین</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      value={translators
                        ?.filter((translator) =>
                          field.value?.includes(translator.slug)
                        )
                        .map((translator) => ({
                          value: translator.slug,
                          label: translator.fullName,
                        }))}
                      onChange={(options) => {
                        field.onChange(options.map((opt) => opt.value));
                      }}
                      options={translators?.map((translator) => ({
                        value: translator.slug,
                        label: translator.fullName,
                      }))}
                      placeholder="انتخاب مترجمین"
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 text-smp">
                          مترجمی یافت نشد.
                        </p>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="pages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تعداد صفحات</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="publicationYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>سال انتشار</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full h-13">
            {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </Button>
        </form>
      </Form>
    </section>
  );
}
