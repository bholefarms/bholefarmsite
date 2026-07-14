import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteGalleryItem } from "@/actions/gallery";
import { GalleryForm } from "./gallery-form";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const items = await prisma.galleryItem.findMany({
    orderBy: { order: "asc" },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold mb-6">Gallery</h1>
        <div className="rounded-lg border border-border p-6">
          <h2 className="text-lg font-heading font-semibold mb-4">New Gallery Item</h2>
          <GalleryForm />
        </div>
      </div>
      <div>
        <h2 className="text-lg font-heading font-semibold mb-4">Gallery Items ({items.length})</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-lg border border-border bg-card overflow-hidden">
              {item.images[0] ? (
                <img src={item.images[0].imagePath} alt={item.title || ""} className="aspect-video w-full object-cover" />
              ) : (
                <div className="aspect-video w-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                  No image
                </div>
              )}
              <div className="p-3 space-y-1">
                <p className="text-sm font-medium truncate">{item.title || "Untitled"}</p>
                {item.category && <p className="text-xs text-muted-foreground">{item.category}</p>}
                <p className="text-xs text-muted-foreground">{item.images.length} image(s) &middot; Order {item.order}</p>
                <div className="flex items-center gap-3 pt-1">
                  <Link href={`/admin/gallery/${item.id}/edit`} className="text-xs text-primary hover:underline">
                    Edit
                  </Link>
                  <form action={deleteGalleryItem.bind(null, item.id)}>
                    <button type="submit" className="text-xs text-destructive hover:underline">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No gallery items yet.</p>
        )}
      </div>
    </div>
  );
}
