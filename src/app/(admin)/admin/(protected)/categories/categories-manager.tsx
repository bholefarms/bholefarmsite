"use client";

import { useState } from "react";
import { FolderTree, Plus, Trash2, Edit3, Save, X } from "lucide-react";
import { CardSection } from "@/components/admin/card-section";
import { EmptyState } from "@/components/admin/empty-state";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategory, updateCategory, deleteCategory } from "@/actions/categories";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

interface CategoriesManagerProps {
  categories: CategoryRow[];
}

export function CategoriesManager({ categories }: CategoriesManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <>
      <CardSection title="Add Category">
        <form action={createCategory} className="flex flex-wrap gap-3">
          <Input name="name" placeholder="Category name" required className="flex-1 min-w-[200px]" />
          <Input name="slug" placeholder="category-slug" required className="flex-1 min-w-[150px]" />
          <Button type="submit">
            <Plus className="size-4" />
            Add Category
          </Button>
        </form>
      </CardSection>

      {categories.length === 0 ? (
        <EmptyState
          title="No categories"
          description="Create your first category to organize products."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.id} className="group relative rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
              {editingId === cat.id ? (
                <form
                  action={async (formData) => {
                    await updateCategory(cat.id, formData);
                    setEditingId(null);
                  }}
                  className="space-y-3"
                >
                  <Input
                    name="name"
                    defaultValue={cat.name}
                    required
                    placeholder="Name"
                  />
                  <Input
                    name="slug"
                    defaultValue={cat.slug}
                    required
                    placeholder="slug"
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm">
                      <Save className="size-3.5" />
                      Save
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setEditingId(null)}>
                      <X className="size-3.5" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FolderTree className="size-5" />
                  </div>
                  <h3 className="text-sm font-semibold">{cat.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">/{cat.slug}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {cat._count.products} product{cat._count.products !== 1 ? "s" : ""}
                  </p>
                  <div className="mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingId(cat.id)}
                      className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <Edit3 className="size-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(cat.id)}
                      className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <DeleteDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          await deleteCategory(deleteId);
          setDeleteId(null);
        }}
      />
    </>
  );
}
