import { prisma } from "@/lib/prisma";
import { CategoriesManager } from "./categories-manager";
import { PageContainer } from "@/components/admin/page-container";
import { PageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <PageContainer>
      <PageHeader title="Categories" description="Organize your products into categories" />
      <CategoriesManager categories={categories} />
    </PageContainer>
  );
}
