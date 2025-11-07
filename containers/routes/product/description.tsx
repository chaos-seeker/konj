'use client';

import { Button } from '@/ui/button';
import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface IDescriptionProps {
  description: string;
}

export function Description(props: IDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section>
      <div>
        <div className="text-smp relative rounded-xl bg-white p-4">
          <h2 className="text-mdp mb-4 font-bold">توضیحات</h2>
          <p className={`${isExpanded ? '' : 'line-clamp-4'} text-justify`}>
            {props.description}
          </p>
          {!isExpanded && (
            <div className="pointer-events-none absolute right-0 bottom-12 left-0 h-16 bg-linear-to-t from-white to-transparent" />
          )}
          <div className="mt-4 flex justify-center">
            <Button
              variant="ghost"
              className="text-primary hover:text-primary/80"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'بستن' : 'مشاهده بیشتر'}
              <ChevronDown
                className={cn('size-4 transition-transform', {
                  'rotate-180': isExpanded,
                })}
              />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
