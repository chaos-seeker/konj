"use client";

import { useState } from "react";
import { Button } from "@/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

interface IDescriptionProps {
  description: string;
}

export function Description(props: IDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section>
      <div>
        <div className="p-4 text-smp rounded-xl bg-white relative">
        <h2 className="text-mdp font-bold mb-4">توضیحات</h2>
          <p className={`${isExpanded ? "" : "line-clamp-4"} text-justify`}>
            {props.description}
          </p>
          {!isExpanded && (
            <div className="absolute bottom-12 left-0 right-0 h-16 bg-linear-to-t from-white to-transparent pointer-events-none" />
          )}
          <div className="mt-4 flex justify-center">
            <Button
              variant="ghost"
              className="text-primary hover:text-primary/80"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "بستن" : "مشاهده بیشتر"}
              <ChevronDown
                className={cn("size-4 transition-transform", {
                  "rotate-180": isExpanded,
                })}
              />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
