"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GalleryScrollButton() {
  return (
    <Button onClick={() => document.getElementById("gallery-create-form")?.scrollIntoView({ behavior: "smooth" })}>
      <Plus className="size-4" />
      Add Item
    </Button>
  );
}
