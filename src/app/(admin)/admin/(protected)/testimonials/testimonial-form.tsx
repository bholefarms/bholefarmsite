"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardSection } from "@/components/admin/card-section";
import { FormSection } from "@/components/admin/form-section";

interface TestimonialFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    name?: string;
    role?: string | null;
    content?: string;
    rating?: number;
    avatar?: string | null;
    order?: number;
  };
  title: string;
}

export function TestimonialForm({ action, defaultValues, title }: TestimonialFormProps) {
  const [, formAction, pending] = useActionState(
    async (_: unknown, formData: FormData) => {
      await action(formData);
    },
    undefined
  );

  return (
    <form action={formAction} className="space-y-4">
      <CardSection title={title}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormSection title="Name" className="space-y-2">
            <Input id="name" name="name" defaultValue={defaultValues?.name || ""} required />
          </FormSection>
          <FormSection title="Role" className="space-y-2">
            <Input id="role" name="role" defaultValue={defaultValues?.role || ""} placeholder="e.g., Happy Customer" />
          </FormSection>
        </div>
        <FormSection title="Content" className="space-y-2">
          <Textarea id="content" name="content" defaultValue={defaultValues?.content || ""} rows={3} required />
        </FormSection>
        <div className="grid gap-4 md:grid-cols-3">
          <FormSection title="Rating (1-5)" className="space-y-2">
            <Input
              id="rating"
              name="rating"
              type="number"
              min={1}
              max={5}
              defaultValue={defaultValues?.rating || 5}
            />
          </FormSection>
          <FormSection title="Avatar URL" className="space-y-2">
            <Input id="avatar" name="avatar" defaultValue={defaultValues?.avatar || ""} />
          </FormSection>
          <FormSection title="Order" className="space-y-2">
            <Input
              id="order"
              name="order"
              type="number"
              defaultValue={defaultValues?.order || 0}
            />
          </FormSection>
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Button>
      </CardSection>
    </form>
  );
}
