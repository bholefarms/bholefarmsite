import { prisma } from "@/lib/prisma";
import { createTestimonial } from "@/actions/testimonials";
import { PageContainer } from "@/components/admin/page-container";
import { PageHeader } from "@/components/admin/page-header";
import { TestimonialForm } from "./testimonial-form";
import { TestimonialsList } from "./testimonials-list";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <PageContainer>
      <PageHeader title="Testimonials" description="Manage customer testimonials" />
      <TestimonialForm action={createTestimonial} title="Add Testimonial" />
      <TestimonialsList testimonials={testimonials} />
    </PageContainer>
  );
}
