import { prisma } from "@/lib/prisma";
import { ProductForm } from "../product-form";
import { PageContainer } from "@/components/admin/page-container";
import { PageHeader } from "@/components/admin/page-header";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <PageContainer>
      <PageHeader title="New Product" description="Add a new product to your farm store" />
      <ProductForm categories={categories} />
    </PageContainer>
  );
}
