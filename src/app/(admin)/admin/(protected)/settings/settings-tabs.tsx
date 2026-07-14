"use client";

import { useState } from "react";
import { Settings, Phone, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { SettingsForm } from "./settings-form";

interface SettingsTabsProps {
  generalSettings: Record<string, string>;
  contactSettings: Record<string, string>;
  seoSettings: Record<string, string>;
}

const tabs = [
  { id: "general", label: "General", icon: Settings, keys: ["site_name", "site_description", "hero_headline", "hero_subtext"] },
  { id: "contact", label: "Contact", icon: Phone, keys: ["contact_phone", "contact_email", "whatsapp_number", "address"] },
  { id: "seo", label: "SEO", icon: Search, keys: ["seo_title", "seo_description", "seo_keywords"] },
];

const tabLabels: Record<string, Record<string, string>> = {
  general: {
    site_name: "Site Name",
    site_description: "Site Description",
    hero_headline: "Hero Headline",
    hero_subtext: "Hero Subtext",
  },
  contact: {
    contact_phone: "Contact Phone",
    contact_email: "Contact Email",
    whatsapp_number: "WhatsApp Number",
    address: "Address",
  },
  seo: {
    seo_title: "SEO Title",
    seo_description: "SEO Description",
    seo_keywords: "SEO Keywords",
  },
};

export function SettingsTabs({ generalSettings, contactSettings, seoSettings }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState("general");

  const allSettings: Record<string, Record<string, string>> = {
    general: generalSettings,
    contact: contactSettings,
    seo: seoSettings,
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-1 rounded-lg border bg-card p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <div key={tab.id} className={cn(activeTab !== tab.id && "hidden")}>
          <SettingsForm
            settings={allSettings[tab.id]}
            settingKeys={tab.keys}
            customLabels={tabLabels[tab.id]}
          />
        </div>
      ))}
    </div>
  );
}
