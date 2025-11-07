'use client';

import { approveComment } from '@/actions/comments/approve-comment';
import { deleteComment } from '@/actions/comments/delete-comment';
import { getApprovedComments } from '@/actions/comments/get-approved-comments';
import { getPendingComments } from '@/actions/comments/get-pending-comments';
import { rejectComment } from '@/actions/comments/reject-comment';
import type { TComment } from '@/types/comment';
import { Button } from '@/ui/button';
import { cn } from '@/utils/cn';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Loader2, Star, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function ListComment() {
  const queryClient = useQueryClient();
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const { data: pendingComments = [], isLoading: isLoadingPending } = useQuery<
    TComment[]
  >({
    queryKey: ['pending-comments'],
    queryFn: async () => {
      const result = await getPendingComments();
      return result.success ? result.data : [];
    },
  });

  const { data: approvedComments = [], isLoading: isLoadingApproved } =
    useQuery<TComment[]>({
      queryKey: ['approved-comments'],
      queryFn: async () => {
        const result = await getApprovedComments();
        return result.success ? result.data : [];
      },
    });

  const handleApprove = async (commentId: string) => {
    setProcessingIds((prev) => new Set(prev).add(commentId));
    try {
      const result = await approveComment(commentId);
      if (!result.success) {
        toast.error(result.error || 'خطا در تایید نظر');
        return;
      }
      toast.success(result.message || 'نظر با موفقیت تایید شد');
      await queryClient.invalidateQueries({ queryKey: ['pending-comments'] });
      await queryClient.invalidateQueries({ queryKey: ['approved-comments'] });
    } catch {
      toast.error('خطا در تایید نظر');
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    }
  };

  const handleReject = async (commentId: string) => {
    setProcessingIds((prev) => new Set(prev).add(commentId));
    try {
      const result = await rejectComment(commentId);
      if (!result.success) {
        toast.error(result.error || 'خطا در رد نظر');
        return;
      }
      toast.success(result.message || 'نظر با موفقیت رد شد');
      await queryClient.invalidateQueries({ queryKey: ['pending-comments'] });
    } catch {
      toast.error('خطا در رد نظر');
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    }
  };

  const handleDelete = async (commentId: string) => {
    setProcessingIds((prev) => new Set(prev).add(commentId));
    try {
      const result = await deleteComment(commentId);
      if (!result.success) {
        toast.error(result.error || 'خطا در حذف نظر');
        return;
      }
      toast.success(result.message || 'نظر با موفقیت حذف شد');
      await queryClient.invalidateQueries({ queryKey: ['approved-comments'] });
    } catch {
      toast.error('خطا در حذف نظر');
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border bg-white p-4">
        <h2 className="mb-4 text-lg font-bold">نظرات در انتظار تایید</h2>
        {isLoadingPending ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
          </div>
        ) : pendingComments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Image
              src="/images/global/not-found.png"
              alt="empty"
              width={150}
              height={150}
            />
            <p className="text-smp text-muted-foreground py-8 text-center">
              نظری در انتظار تایید نیست
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {pendingComments.map((comment) => (
              <div
                key={comment.id}
                className="flex flex-col gap-3 rounded-lg border p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <Link
                        href={`/product/${comment.bookSlug}`}
                        className="text-primary font-medium hover:underline"
                      >
                        {comment.bookName || comment.bookSlug}
                      </Link>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground text-sm">
                        {comment.fullName}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-2 text-sm">
                      {comment.text}
                    </p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn('size-4', {
                            'fill-warning text-warning': star <= comment.rating,
                            'text-muted-foreground': star > comment.rating,
                          })}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-success border-success hover:bg-success hover:text-white"
                      onClick={() => handleApprove(comment.id)}
                      disabled={processingIds.has(comment.id)}
                    >
                      {processingIds.has(comment.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          تایید
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-error border-error hover:bg-error hover:text-white"
                      onClick={() => handleReject(comment.id)}
                      disabled={processingIds.has(comment.id)}
                    >
                      {processingIds.has(comment.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <X className="h-4 w-4" />
                          رد
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border bg-white p-4">
        <h2 className="mb-4 text-lg font-bold">نظرات تایید شده</h2>
        {isLoadingApproved ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
          </div>
        ) : approvedComments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Image
              src="/images/global/not-found.png"
              alt="empty"
              width={150}
              height={150}
            />
            <p className="text-smp text-muted-foreground py-8 text-center">
              نظری تایید نشده است
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {approvedComments.map((comment) => (
              <div
                key={comment.id}
                className="flex flex-col gap-3 rounded-lg border p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <Link
                        href={`/product/${comment.bookSlug}`}
                        className="text-primary font-medium hover:underline"
                      >
                        {comment.bookName || comment.bookSlug}
                      </Link>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground text-sm">
                        {comment.fullName}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-2 text-sm">
                      {comment.text}
                    </p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn('size-4', {
                            'fill-warning text-warning': star <= comment.rating,
                            'text-muted-foreground': star > comment.rating,
                          })}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-error border-error hover:bg-error hover:text-white"
                      onClick={() => handleDelete(comment.id)}
                      disabled={processingIds.has(comment.id)}
                    >
                      {processingIds.has(comment.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          حذف
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
