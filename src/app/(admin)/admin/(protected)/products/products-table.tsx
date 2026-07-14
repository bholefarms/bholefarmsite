"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ShoppingBag, Trash2, Edit3, Plus } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { DataTableToolbar } from "@/components/admin/data-table-toolbar";
import { SearchBar } from "@/components/admin/search-bar";
import { StatusBadge } from "@/components/admin/status-badge";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { deleteProduct, toggleActive } from "@/actions/products";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  unit: string | null;
  isActive: boolean;
  category: { name: string };
  images: { imagePath: string }[];
  createdAt: Date;
}

interface ProductsTableProps {
  products: ProductRow[];
}

export function ProductsTable({ products }: ProductsTableProps) {
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q)
    );
  }, [products, search]);

  const columns: Column<ProductRow>[] = [
    {
      key: "image",
      header: "Image",
      cell: (p) =>
        p.images[0] ? (
          <img
            src={p.images[0].imagePath}
            alt={p.name}
            className="size-10 rounded-lg object-cover border"
          />
        ) : (
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground border">
            <ShoppingBag className="size-4" />
          </div>
        ),
    },
    {
      key: "name",
      header: "Name",
      cell: (p) => (
        <div>
          <p className="font-medium">{p.name}</p>
          <p className="text-xs text-muted-foreground">{p.category.name}</p>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      cell: (p) => (
        <span className="font-medium tabular-nums">
          {p.price ? formatPrice(Number(p.price)) : "-"}
        </span>
      ),
    },
    {
      key: "unit",
      header: "Unit",
      cell: (p) => <span className="text-muted-foreground text-xs">{p.unit || "-"}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (p) => (
        <form action={toggleActive.bind(null, p.id)}>
          <button type="submit">
            <StatusBadge variant={p.isActive ? "active" : "inactive"} />
          </button>
        </form>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right w-24",
      cell: (p) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/products/${p.id}/edit`}
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Edit3 className="size-4" />
          </Link>
          <button
            onClick={() => setDeleteId(p.id)}
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  const deleteItem = async () => {
    if (!deleteId) return;
    await deleteProduct(deleteId);
    setDeleteId(null);
  };

  return (
    <>
      <DataTableToolbar>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name or category..."
          className="w-full sm:max-w-xs"
        />
      </DataTableToolbar>

      {filtered.length === 0 && !search && products.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="Create your first product to start selling."
          action={
            <Link href="/admin/products/new">
              <Button>
                <Plus className="size-4" />
                Add Product
              </Button>
            </Link>
          }
        />
      ) : filtered.length === 0 && search ? (
        <EmptyState
          title="No results"
          description={`No products matching "${search}".`}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(p) => p.id}
          emptyMessage="No products found."
        />
      )}

      <DeleteDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={deleteItem}
      />
    </>
  );
}
