import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PageContainer } from "@/components/admin/page-container";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { CardSection } from "@/components/admin/card-section";
import { EmptyState } from "@/components/admin/empty-state";
import {
  ShoppingBag,
  ShoppingCart,
  Newspaper,
  Plus,
  ImageIcon,
  ArrowRight,
  Users,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  const [
    productCount,
    orderCount,
    blogCount,
    ordersByStatus,
    recentOrders,
    recentProducts,
    recentGallery,
  ] = await Promise.all([
    prisma.product.count({ where: { isDeleted: false } }),
    prisma.order.count(),
    prisma.blogPost.count(),
    prisma.order.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { product: true },
    }),
    prisma.product.findMany({
      take: 5,
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      include: { images: { where: { isThumbnail: true }, take: 1 } },
    }),
    prisma.galleryItem.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    }),
  ]);

  const statusMap: Record<string, number> = Object.fromEntries(
    ordersByStatus.map((s) => [s.status, s._count.id])
  );

  const statusColor: Record<string, "pending" | "contacted" | "completed" | "cancelled"> = {
    PENDING: "pending",
    CONTACTED: "contacted",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
  };

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${session?.user?.name || "Admin"}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={productCount}
          icon={<ShoppingBag className="size-5" />}
        />
        <StatCard
          title="Total Orders"
          value={orderCount}
          icon={<ShoppingCart className="size-5" />}
        />
        <StatCard
          title="Blog Posts"
          value={blogCount}
          icon={<Newspaper className="size-5" />}
        />
        <StatCard
          title="Order Status"
          value={
            <div className="flex flex-wrap gap-1.5 pt-1">
              {["PENDING", "CONTACTED", "COMPLETED", "CANCELLED"].map((s) => (
                <span key={s} className="flex items-center gap-1 text-xs font-medium">
                  <StatusBadge variant={statusColor[s] || "default"} label={`${s} ${statusMap[s] || 0}`} />
                </span>
              ))}
            </div>
          }
          icon={<Users className="size-5" />}
          className="lg:col-span-1"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <CardSection title="Recent Orders" action={
            <Link href="/admin/orders" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              View all <ArrowRight className="size-3" />
            </Link>
          }>
            {recentOrders.length === 0 ? (
              <EmptyState title="No orders yet" description="Orders will appear here once customers place them." />
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between rounded-lg border bg-card p-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {order.product?.name || "N/A"} &middot; Qty: {order.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-3">
                      <StatusBadge variant={statusColor[order.status]} />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardSection>

          <CardSection title="Recent Products" action={
            <Link href="/admin/products" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              View all <ArrowRight className="size-3" />
            </Link>
          }>
            {recentProducts.length === 0 ? (
              <EmptyState title="No products yet" />
            ) : (
              <div className="space-y-3">
                {recentProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                    {p.images[0] ? (
                      <img src={p.images[0].imagePath} alt={p.name} className="size-10 rounded-md object-cover" />
                    ) : (
                      <div className="flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        <ShoppingBag className="size-4" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.price ? `₹${Number(p.price)}` : "-"} &middot; {p.unit || "N/A"}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(p.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardSection>
        </div>

        <div className="space-y-6">
          <CardSection title="Quick Actions">
            <div className="space-y-2">
              <Link
                href="/admin/products/new"
                className="flex items-center gap-3 rounded-lg border bg-card p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  <Plus className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">New Product</p>
                  <p className="text-xs text-muted-foreground">Add a farm product</p>
                </div>
              </Link>
              <Link
                href="/admin/blog/new"
                className="flex items-center gap-3 rounded-lg border bg-card p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  <Plus className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">New Blog Post</p>
                  <p className="text-xs text-muted-foreground">Write an article</p>
                </div>
              </Link>
              <Link
                href="/admin/gallery"
                className="flex items-center gap-3 rounded-lg border bg-card p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  <ImageIcon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Add to Gallery</p>
                  <p className="text-xs text-muted-foreground">Upload new images</p>
                </div>
              </Link>
            </div>
          </CardSection>

          <CardSection title="Latest Gallery" action={
            <Link href="/admin/gallery" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              View all <ArrowRight className="size-3" />
            </Link>
          }>
            {recentGallery.length === 0 ? (
              <EmptyState title="No gallery items" />
            ) : (
              <div className="space-y-3">
                {recentGallery.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                    {item.images[0] ? (
                      <img src={item.images[0].imagePath} alt={item.title || ""} className="size-10 rounded-md object-cover" />
                    ) : (
                      <div className="flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        <ImageIcon className="size-4" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title || "Untitled"}</p>
                      {item.category && (
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardSection>
        </div>
      </div>
    </PageContainer>
  );
}
