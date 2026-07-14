import { createBlogPost } from "@/actions/blog";
import { BlogForm } from "../blog-form";
import { PageContainer } from "@/components/admin/page-container";
import { PageHeader } from "@/components/admin/page-header";

export default function NewBlogPage() {
  return (
    <PageContainer>
      <PageHeader title="New Blog Post" description="Create a new blog post" />
      <BlogForm action={createBlogPost} />
    </PageContainer>
  );
}
