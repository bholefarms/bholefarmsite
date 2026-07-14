"use client";

import { useState } from "react";
import { Star, Trash2, Edit3, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { CardSection } from "@/components/admin/card-section";
import { EmptyState } from "@/components/admin/empty-state";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { TestimonialForm } from "./testimonial-form";
import { deleteTestimonial } from "@/actions/testimonials";

interface TestimonialItem {
  id: string;
  name: string;
  role: string | null;
  content: string;
  rating: number;
  avatar: string | null;
  order: number;
}

interface TestimonialsListProps {
  testimonials: TestimonialItem[];
}

export function TestimonialsList({ testimonials }: TestimonialsListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <>
      <CardSection title={`All Testimonials (${testimonials.length})`}>
        {testimonials.length === 0 ? (
          <EmptyState title="No testimonials" description="Add your first testimonial above." />
        ) : (
          <div className="space-y-4">
            {testimonials.map((t) => (
              <div key={t.id} className="rounded-lg border bg-card p-4">
                {editingId === t.id ? (
                  <TestimonialForm
                    action={async (formData) => {
                      const { updateTestimonial } = await import("@/actions/testimonials");
                      await updateTestimonial(t.id, formData);
                      setEditingId(null);
                    }}
                    defaultValues={{
                      name: t.name,
                      role: t.role,
                      content: t.content,
                      rating: t.rating,
                      avatar: t.avatar,
                      order: t.order,
                    }}
                    title="Edit Testimonial"
                  />
                ) : (
                  <div className="flex items-start gap-4">
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.name} className="size-12 rounded-full object-cover border" />
                    ) : (
                      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="size-5" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">{t.name}</p>
                          {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => setEditingId(t.id)}
                            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          >
                            <Edit3 className="size-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteId(t.id)}
                            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-1 flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "size-3.5",
                              i < t.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                            )}
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{t.content}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Order: {t.order}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardSection>

      <DeleteDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          await deleteTestimonial(deleteId);
          setDeleteId(null);
        }}
      />
    </>
  );
}

// cn imported from @/lib/utils
