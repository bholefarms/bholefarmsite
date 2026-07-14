"use client";

import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageItem {
  src: string;
  alt: string;
  id?: string;
}

interface ImageGridProps {
  images: ImageItem[];
  onImageClick?: (image: ImageItem) => void;
  className?: string;
  columns?: 2 | 3 | 4;
}

export function ImageGrid({ images, onImageClick, className, columns = 3 }: ImageGridProps) {
  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed bg-muted/20 p-12">
        <div className="text-center text-sm text-muted-foreground">
          <ImageIcon className="mx-auto mb-2 size-8" />
          <p>No images</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "grid gap-4",
      columns === 2 && "grid-cols-1 sm:grid-cols-2",
      columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      className
    )}>
      {images.map((img, i) => (
        <div
          key={img.id || i}
          onClick={() => onImageClick?.(img)}
          className={cn(
            "group relative aspect-square overflow-hidden rounded-lg border bg-muted",
            onImageClick && "cursor-pointer"
          )}
        >
          <img
            src={img.src}
            alt={img.alt}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
        </div>
      ))}
    </div>
  );
}
