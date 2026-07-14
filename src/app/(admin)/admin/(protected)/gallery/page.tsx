import { prisma } from "@/lib/prisma";
import { deleteGalleryItem } from "@/actions/gallery";
import { GalleryGrid } from "./gallery-grid";
import { GalleryScrollButton } from "./gallery-scroll-button";
import { GalleryForm } from "./gallery-form";
import { PageContainer } from "@/components/admin/page-container";
import { PageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const items = await prisma.galleryItem.findMany({
    orderBy: { order: "asc" },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <PageContainer>
      <PageHeader title="Gallery" description="Manage your image gallery">
        <GalleryScrollButton />
      </PageHeader>
      <GalleryGrid items={items} onDelete={deleteGalleryItem} />
      <div id="gallery-create-form">
        <div className="mt-6 rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold">New Gallery Item</h3>
          <GalleryForm />
        </div>
      </div>
    </PageContainer>
  );
}
