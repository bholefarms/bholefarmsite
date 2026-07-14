import { prisma } from "@/lib/prisma";
import { deleteMediaImage } from "@/actions/media";
import { MediaGrid } from "./media-grid";
import { PageContainer } from "@/components/admin/page-container";
import { PageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const [productImages, galleryImages] = await Promise.all([
    prisma.productImage.findMany({
      include: { product: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.galleryImage.findMany({
      include: { gallery: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const items = [
    ...productImages.map((img) => ({
      id: img.id,
      path: img.imagePath,
      fileName: img.fileName || img.imagePath.split("/").pop() || "image",
      type: "product" as const,
      parentName: img.product.name,
      parentId: img.productId,
    })),
    ...galleryImages.map((img) => ({
      id: img.id,
      path: img.imagePath,
      fileName: img.fileName || img.imagePath.split("/").pop() || "image",
      type: "gallery" as const,
      parentName: img.gallery.title || "Untitled",
      parentId: img.galleryId,
    })),
  ];

  return (
    <PageContainer>
      <PageHeader title="Media Library" description={`All images across your site (${items.length} total)`} />
      <MediaGrid items={items} onDelete={deleteMediaImage} />
    </PageContainer>
  );
}
