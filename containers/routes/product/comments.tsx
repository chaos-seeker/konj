'use client';

import { getBookComments } from '@/actions/comments/get-book-comments';
import type { TBook } from '@/types/book';
import type { TComment } from '@/types/comment';
import { cn } from '@/utils/cn';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Star, User } from 'lucide-react';
import { useState } from 'react';

interface CommentsProps {
  book: TBook;
}

export function Comments({ book }: CommentsProps) {
  const [showAll, setShowAll] = useState(false);
  const { data: comments = [] } = useQuery<TComment[]>({
    queryKey: ['book-comments', book.slug],
    queryFn: async () => {
      const result = await getBookComments(book.slug);
      return result.success ? result.data : [];
    },
  });
  const displayedComments = showAll ? comments : comments.slice(0, 2);

  return (
    <section>
      <div className="flex flex-col gap-6">
        <div className="rounded-xl bg-white p-4">
          <h2 className="text-mdp mb-4 font-bold">نقد ها و امتیازات</h2>
          <div className="flex flex-col gap-4">
            {displayedComments.length > 0 ? (
              displayedComments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="shrink-0">
                    <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                      <User className="text-muted-foreground size-5" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {comment.fullName}
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn('size-4', {
                              'fill-warning text-warning':
                                star <= comment.rating,
                              'text-muted-foreground': star > comment.rating,
                            })}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {comment.text}
                    </p>
                    {displayedComments.indexOf(comment) <
                      displayedComments.length - 1 && (
                      <hr className="mt-4 border-t" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                هنوز نظری ثبت نشده است
              </p>
            )}
          </div>
          {comments.length > 2 && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-primary hover:text-primary/80 mt-4 flex items-center gap-2 transition-colors"
              >
                <span>{showAll ? 'بستن' : 'نمایش همه ی نظرات'}</span>
                <ChevronDown
                  className={cn('size-4 transition-transform', {
                    'rotate-180': showAll,
                  })}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
