import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductsTable } from "./products-table";
import { PageContainer } from "@/components/admin/page-container";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    where: { isDeleted: false },
    include: {
      category: true,
      images: { where: { isThumbnail: true }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  const mapped = products.map((p) => ({
    ...p,
    price: p.price ? Number(p.price) : null,
  }));

  return (
    <PageContainer>
      <PageHeader title="Products" description="Manage your farm products">
        <Link href="/admin/products/new">
          <Button>
            <Plus className="size-4" />
            Add Product
          </Button>
        </Link>
      </PageHeader>
      <ProductsTable products={mapped} />
    </PageContainer>
  );
}
