'use client';

import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { cn } from '@/utils/cn';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';

interface InputImageProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  onError?: (error: string) => void;
  preview?: string | null;
  error?: string;
  className?: string;
  accept?: string;
  maxSize?: number;
  id?: string;
}

export function InputImage({
  value,
  onChange,
  onError,
  preview: externalPreview,
  error: externalError,
  className,
  accept = 'image/jpeg,image/png,image/webp',
  maxSize = 5 * 1024 * 1024,
  id,
}: InputImageProps) {
  const [preview, setPreview] = useState<string | null>(
    externalPreview || null,
  );
  const [error, setError] = useState<string | null>(externalError || null);
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const inputId = id || `image-input-${generatedId}`;

  useEffect(() => {
    if (externalPreview) {
      setPreview(externalPreview);
    }
  }, [externalPreview]);

  useEffect(() => {
    if (externalError) {
      setError(externalError);
    }
  }, [externalError]);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      setError(null);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }, [value]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      onChange(null);
      return;
    }

    setError(null);
    onError?.('');

    const acceptedTypes = accept.split(',').map((t) => t.trim());
    if (!acceptedTypes.includes(file.type)) {
      const errorMsg = 'فرمت تصویر باید jpg، png، webp یا svg باشد';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    if (file.size > maxSize) {
      const errorMsg = `حجم تصویر باید کمتر از ${Math.round(
        maxSize / 1024 / 1024,
      )} مگابایت باشد`;
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    const img = document.createElement('img');
    img.onload = () => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        setPreview(previewUrl);
        onChange(file);
      };
      reader.readAsDataURL(file);
    };
    img.onerror = () => {
      const errorMsg = 'خطا در بارگذاری تصویر';
      setError(errorMsg);
      onError?.(errorMsg);
    };
    img.src = URL.createObjectURL(file);
  };

  const removeImage = () => {
    setPreview(null);
    setError(null);
    onChange(null);
    onError?.('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const displayPreview = externalPreview || preview;
  const displayError = externalError || error;

  return (
    <div className={cn('space-y-2', className)}>
      {displayPreview ? (
        <div className="relative mx-auto aspect-square w-full max-w-[100px] rounded-lg border bg-white">
          <Image
            src={displayPreview}
            alt="Preview"
            fill
            className="rounded-lg object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 size-6.5"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className="border-border flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white transition-colors"
        >
          <Upload className="text-muted-foreground mb-2 h-8 w-8" />
          <span className="text-muted-foreground text-sm">
            کلیک کنید یا تصویر را بکشید
          </span>
        </label>
      )}
      <Input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleImageChange}
      />
      {displayError && (
        <p className="text-destructive text-sm font-medium">{displayError}</p>
      )}
    </div>
  );
}
