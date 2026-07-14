"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { storageService } from "@/lib/storage";

export async function deleteProductImage(id: string) {
  const image = await prisma.productImage.findUnique({ where: { id } });
  if (image) {
    await storageService.delete(image.imagePath);
    await prisma.productImage.delete({ where: { id } });
  }
  revalidatePath("/admin/media");
}

export async function deleteGalleryImage(id: string) {
  const image = await prisma.galleryImage.findUnique({ where: { id } });
  if (image) {
    await storageService.delete(image.imagePath);
    await prisma.galleryImage.delete({ where: { id } });
  }
  revalidatePath("/admin/media");
}

export async function deleteMediaImage(id: string, type: "product" | "gallery") {
  if (type === "product") await deleteProductImage(id);
  else await deleteGalleryImage(id);
}
