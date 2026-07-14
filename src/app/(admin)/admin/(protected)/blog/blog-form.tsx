"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichEditor } from "@/components/admin/rich-editor";
import { CardSection } from "@/components/admin/card-section";
import { FormSection } from "@/components/admin/form-section";

interface BlogFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string | null;
    coverImage?: string | null;
    published?: boolean;
  };
}

export function BlogForm({ action, defaultValues }: BlogFormProps) {
  const [content, setContent] = useState(defaultValues?.content || "");

  return (
    <form action={action} className="max-w-4xl space-y-6">
      <CardSection title="Blog Post Details">
        <div className="grid gap-4 md:grid-cols-2">
          <FormSection title="Title" className="space-y-2">
            <Input id="title" name="title" defaultValue={defaultValues?.title || ""} required />
          </FormSection>
          <FormSection title="Slug" className="space-y-2">
            <Input id="slug" name="slug" defaultValue={defaultValues?.slug || ""} required />
          </FormSection>
        </div>
        <FormSection title="Excerpt" className="space-y-2">
          <Input id="excerpt" name="excerpt" defaultValue={defaultValues?.excerpt || ""} placeholder="Brief summary for search results" />
        </FormSection>
      </CardSection>

      <CardSection title="Cover Image" description="Paste an image URL for the blog post cover">
        <Input id="coverImage" name="coverImage" defaultValue={defaultValues?.coverImage || ""} placeholder="https://example.com/image.jpg" />
      </CardSection>

      <CardSection title="Content">
        <input type="hidden" name="content" value={content} />
        <RichEditor
          content={content}
          onChange={setContent}
          placeholder="Write your blog post content here..."
        />
      </CardSection>

      <CardSection title="Publication">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" name="published" defaultChecked={defaultValues?.published} className="rounded border-input" />
          Published
        </label>
      </CardSection>

      <div className="flex justify-end gap-3">
        <Button type="submit" size="lg">Save Post</Button>
      </div>
    </form>
  );
}
