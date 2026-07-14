import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateOrderStatus, deleteOrder } from "@/actions/orders";
import { PageContainer } from "@/components/admin/page-container";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { DataTable, type Column } from "@/components/admin/data-table";
import { ShoppingCart, Eye, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type OrderRow = {
  id: string;
  customerName: string;
  phone: string;
  email: string | null;
  product: { name: string } | null;
  quantity: number;
  status: string;
  createdAt: Date;
};

export default async function AdminOrdersPage() {
  const orders: OrderRow[] = await prisma.order.findMany({
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  const columns: Column<OrderRow>[] = [
    {
      key: "customer",
      header: "Customer",
      cell: (order) => (
        <div>
          <p className="font-medium">{order.customerName}</p>
          <p className="text-xs text-muted-foreground">{order.phone}</p>
        </div>
      ),
    },
    {
      key: "product",
      header: "Product",
      cell: (order) => (
        <span className="text-sm">{order.product?.name || "-"}</span>
      ),
    },
    {
      key: "qty",
      header: "Qty",
      cell: (order) => <span className="font-medium tabular-nums">{order.quantity}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (order) => (
        <form action={updateOrderStatus.bind(null, order.id)}>
          <select
            name="status"
            defaultValue={order.status}
            onChange={(e) => e.target.form?.requestSubmit()}
            className="rounded-lg border border-input bg-background px-2 py-1 text-xs font-medium"
          >
            <option value="PENDING">Pending</option>
            <option value="CONTACTED">Contacted</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </form>
      ),
    },
    {
      key: "date",
      header: "Date",
      cell: (order) => (
        <span className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right w-20",
      cell: (order) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/orders/${order.id}`}
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Eye className="size-4" />
          </Link>
          <form action={deleteOrder.bind(null, order.id)}>
            <button
              type="submit"
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <Trash2 className="size-4" />
            </button>
          </form>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader title="Orders" description="Manage customer orders" />

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Orders will appear here once customers place them."
          icon={<ShoppingCart className="size-8" />}
        />
      ) : (
        <DataTable
          columns={columns}
          data={orders}
          keyExtractor={(o) => o.id}
        />
      )}
    </PageContainer>
  );
}
