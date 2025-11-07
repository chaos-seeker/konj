'use client';

import { getAuthors } from '@/actions/dashboard/manage-authors/get-authors';
import { createBook } from '@/actions/dashboard/manage-books/create-book';
import { getCategories } from '@/actions/dashboard/manage-categories/get-categories';
import { getPublishers } from '@/actions/dashboard/manage-publishers/get-publishers';
import { getTranslators } from '@/actions/dashboard/manage-translators/get-translators';
import { InputImage } from '@/components/input-image';
import { Button } from '@/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/form';
import { Input } from '@/ui/input';
import MultipleSelector from '@/ui/multiple-selector';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select';
import { Textarea } from '@/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

const bookSchema = z.object({
  name: z.string().min(1, 'نام الزامی است'),
  slug: z
    .string()
    .min(1, 'اسلاگ الزامی است')
    .regex(/^[a-z0-9-]+$/, 'اسلاگ باید انگلیسی و بدون فاصله باشد'),
  image: z.instanceof(File, { message: 'تصویر الزامی است' }),
  price: z.string().min(1, 'قیمت الزامی است'),
  discount: z.string().optional(),
  description: z.string().min(1, 'توضیحات الزامی است'),
  categorySlug: z.string().min(1, 'دسته بندی الزامی است'),
  publisherSlug: z.string().min(1, 'ناشر الزامی است'),
  authorSlugs: z.array(z.string()).min(1, 'حداقل یک نویسنده الزامی است'),
  translatorSlugs: z.array(z.string()).min(1, 'حداقل یک مترجم الزامی است'),
  pages: z.string().min(1, 'تعداد صفحات الزامی است'),
  publicationYear: z.string().min(1, 'سال انتشار الزامی است'),
});

type BookFormValues = z.infer<typeof bookSchema>;

export function AddBookForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      name: '',
      slug: '',
      price: '',
      discount: '',
      description: '',
      categorySlug: '',
      publisherSlug: '',
      authorSlugs: [],
      translatorSlugs: [],
      pages: '',
      publicationYear: '',
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const result = await getCategories();
      return result.success ? result.data : [];
    },
  });

  const { data: publishers } = useQuery({
    queryKey: ['publishers'],
    queryFn: async () => {
      const result = await getPublishers();
      return result.success ? result.data : [];
    },
  });

  const { data: authors } = useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      const result = await getAuthors();
      return result.success ? result.data : [];
    },
  });

  const { data: translators } = useQuery({
    queryKey: ['translators'],
    queryFn: async () => {
      const result = await getTranslators();
      return result.success ? result.data : [];
    },
  });

  const onSubmit = async (data: BookFormValues) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('slug', data.slug);
      formData.append('price', data.price);
      if (data.discount) {
        formData.append('discount', data.discount);
      }
      if (data.description) {
        formData.append('description', data.description);
      }
      formData.append('categorySlug', data.categorySlug);
      formData.append('publisherSlug', data.publisherSlug);
      formData.append('authorSlugs', JSON.stringify(data.authorSlugs));
      formData.append('translatorSlugs', JSON.stringify(data.translatorSlugs));
      formData.append('pages', data.pages);
      formData.append('publicationYear', data.publicationYear);

      if (data.image) {
        const fileToBase64 = (file: File) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

        const base64 = await fileToBase64(data.image);
        formData.append('image', base64);
        const result = await createBook(formData);
        if (!result.success) {
          throw new Error(result.error || 'خطا در افزودن کتاب');
        }
        toast.success(result.message || 'کتاب با موفقیت افزوده شد');
        await queryClient.invalidateQueries({ queryKey: ['books'] });
        router.push('/dashboard/manage-books');
      } else {
        const result = await createBook(formData);
        if (!result.success) {
          throw new Error(result.error || 'خطا در افزودن کتاب');
        }
        toast.success(result.message || 'کتاب با موفقیت افزوده شد');
        await queryClient.invalidateQueries({ queryKey: ['books'] });
        router.push('/dashboard/manage-books');
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'خطا در افزودن کتاب',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                          .replace(/\s+/g, '-')
                          .replace(/[^a-z0-9-]/g, '');
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
                  <InputImage value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                        <p className="text-smp text-center text-lg leading-10 text-gray-600">
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
                          field.value?.includes(translator.slug),
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
                        <p className="text-smp text-center text-lg leading-10 text-gray-600">
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

          <Button type="submit" disabled={isSubmitting} className="h-13 w-full">
            {isSubmitting ? 'در حال افزودن...' : 'افزودن کتاب'}
          </Button>
        </form>
      </Form>
    </section>
  );
}
