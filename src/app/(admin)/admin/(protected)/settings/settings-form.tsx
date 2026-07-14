"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateSetting } from "@/actions/settings";

interface SettingsFormProps {
  settings: Record<string, string>;
  settingKeys: string[];
  customLabels?: Record<string, string>;
}

const defaultLabels: Record<string, string> = {
  site_name: "Site Name",
  site_description: "Site Description",
  contact_phone: "Contact Phone",
  contact_email: "Contact Email",
  whatsapp_number: "WhatsApp Number",
  address: "Address",
  hero_headline: "Hero Headline",
  hero_subtext: "Hero Subtext",
  seo_title: "SEO Title",
  seo_description: "SEO Description",
  seo_keywords: "SEO Keywords",
};

export function SettingsForm({ settings, settingKeys, customLabels }: SettingsFormProps) {
  const labels = { ...defaultLabels, ...customLabels };

  const [, formAction, pending] = useActionState(
    async (_: unknown, formData: FormData) => {
      for (const key of settingKeys) {
        const value = formData.get(key) as string;
        if (value !== undefined) {
          await updateSetting(key, value);
        }
      }
    },
    undefined
  );

  return (
    <form action={formAction} className="space-y-4">
      {settingKeys.map((key) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={key} className="text-sm font-medium">{labels[key] || key}</Label>
          {key === "site_description" || key === "address" || key === "seo_description" ? (
            <Textarea
              id={key}
              name={key}
              defaultValue={settings[key] || ""}
              rows={3}
              className="resize-none"
            />
          ) : (
            <Input
              id={key}
              name={key}
              defaultValue={settings[key] || ""}
            />
          )}
        </div>
      ))}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
