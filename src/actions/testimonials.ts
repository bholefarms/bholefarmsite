"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createTestimonial(formData: FormData) {
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const content = formData.get("content") as string;
  const rating = parseInt(formData.get("rating") as string) || 5;
  const avatar = formData.get("avatar") as string;
  const order = parseInt(formData.get("order") as string) || 0;

  await prisma.testimonial.create({
    data: { name, role, content, rating, avatar, order },
  });

  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function updateTestimonial(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const content = formData.get("content") as string;
  const rating = parseInt(formData.get("rating") as string) || 5;
  const avatar = formData.get("avatar") as string;
  const order = parseInt(formData.get("order") as string) || 0;

  await prisma.testimonial.update({
    where: { id },
    data: { name, role, content, rating, avatar, order },
  });

  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}
