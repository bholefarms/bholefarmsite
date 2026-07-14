"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ImageIcon, Edit3, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { SearchBar } from "@/components/admin/search-bar";
import { DataTableToolbar } from "@/components/admin/data-table-toolbar";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { useMobile } from "@/hooks/use-mobile";

interface GalleryImage {
  id: string;
  imagePath: string;
  altText?: string | null;
}

interface GalleryRow {
  id: string;
  title: string | null;
  category: string | null;
  order: number;
  images: GalleryImage[];
}

interface GalleryGridProps {
  items: GalleryRow[];
  onDelete: (id: string) => Promise<void>;
}

export function GalleryGrid({ items, onDelete }: GalleryGridProps) {
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState<{ images: GalleryImage[]; index: number } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const isMobile = useMobile();

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(
      (item) =>
        (item.title || "").toLowerCase().includes(q) ||
        (item.category || "").toLowerCase().includes(q)
    );
  }, [items, search]);

  const columns = isMobile ? 2 : items.length >= 6 ? 3 : items.length >= 3 ? 3 : 2;

  return (
    <>
      <DataTableToolbar>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by title or category..."
          className="w-full sm:max-w-xs"
        />
      </DataTableToolbar>

      {filtered.length === 0 && !search && items.length === 0 ? (
        <EmptyState
          title="No gallery items"
          description="Add your first gallery item to showcase farm images."
        />
      ) : filtered.length === 0 && search ? (
        <EmptyState title="No results" description={`No gallery items matching "${search}".`} />
      ) : (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }}
        >
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                {item.images[0] ? (
                  <img
                    src={item.images[0].imagePath}
                    alt={item.images[0]?.altText || item.title || ""}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                    onClick={() => setPreview({ images: item.images, index: 0 })}
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <ImageIcon className="size-8" />
                  </div>
                )}
              </div>
              <div className="p-3 space-y-1">
                <p className="text-sm font-medium truncate">{item.title || "Untitled"}</p>
                {item.category && (
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                )}
                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-muted-foreground">
                    {item.images.length} image{item.images.length !== 1 ? "s" : ""} &middot; Order {item.order}
                  </p>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/admin/gallery/${item.id}/edit`}
                      className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <Edit3 className="size-3.5" />
                    </Link>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setPreview(null)}
        >
          <button
            onClick={() => setPreview(null)}
            className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
          >
            <X className="size-5" />
          </button>
          {preview.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview({
                    ...preview,
                    index: (preview.index - 1 + preview.images.length) % preview.images.length,
                  });
                }}
                className="absolute left-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview({
                    ...preview,
                    index: (preview.index + 1) % preview.images.length,
                  });
                }}
                className="absolute right-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}
          <img
            src={preview.images[preview.index].imagePath}
            alt=""
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {preview.images.length > 1 && (
            <div className="absolute bottom-4 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
              {preview.index + 1} / {preview.images.length}
            </div>
          )}
        </div>
      )}

      <DeleteDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          await onDelete(deleteId);
          setDeleteId(null);
        }}
      />
    </>
  );
}
