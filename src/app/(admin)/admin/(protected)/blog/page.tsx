import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteBlogPost } from "@/actions/blog";
import { PageContainer } from "@/components/admin/page-container";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Plus, Edit3, Trash2, Newspaper } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  const columns: Column<typeof posts[0]>[] = [
    {
      key: "title",
      header: "Title",
      cell: (p) => (
        <div className="flex items-center gap-3">
          {p.coverImage ? (
            <img src={p.coverImage} alt={p.title} className="size-10 rounded-lg object-cover border" />
          ) : (
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground border">
              <Newspaper className="size-4" />
            </div>
          )}
          <div>
            <p className="font-medium">{p.title}</p>
            {p.excerpt && <p className="text-xs text-muted-foreground line-clamp-1 max-w-md">{p.excerpt}</p>}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (p) => (
        <StatusBadge variant={p.published ? "published" : "draft"} />
      ),
    },
    {
      key: "date",
      header: "Date",
      cell: (p) => <span className="text-sm text-muted-foreground">{formatDate(p.createdAt)}</span>,
    },
    {
      key: "actions",
      header: "",
      className: "text-right w-24",
      cell: (p) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/blog/${p.id}/edit`}
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Edit3 className="size-4" />
          </Link>
          <form action={deleteBlogPost.bind(null, p.id)}>
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
      <PageHeader title="Blog Posts" description="Manage your blog content">
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="size-4" />
            New Post
          </Button>
        </Link>
      </PageHeader>

      {posts.length === 0 ? (
        <EmptyState
          title="No blog posts"
          description="Write your first blog post."
          action={
            <Link href="/admin/blog/new">
              <Button>
                <Plus className="size-4" />
                New Post
              </Button>
            </Link>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={posts}
          keyExtractor={(p) => p.id}
        />
      )}
    </PageContainer>
  );
}
