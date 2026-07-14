import { prisma } from "@/lib/prisma";
import { PageContainer } from "@/components/admin/page-container";
import { PageHeader } from "@/components/admin/page-header";
import { SettingsTabs } from "./settings-tabs";

export const dynamic = "force-dynamic";

const allKeys = [
  "site_name", "site_description", "hero_headline", "hero_subtext",
  "contact_phone", "contact_email", "whatsapp_number", "address",
  "seo_title", "seo_description", "seo_keywords",
];

const generalKeys = ["site_name", "site_description", "hero_headline", "hero_subtext"];
const contactKeys = ["contact_phone", "contact_email", "whatsapp_number", "address"];
const seoKeys = ["seo_title", "seo_description", "seo_keywords"];

export default async function AdminSettingsPage() {
  const settings = await prisma.setting.findMany({
    where: { key: { in: allKeys } },
  });

  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  const pickKeys = (keys: string[]) =>
    Object.fromEntries(keys.map((k) => [k, settingsMap[k] || ""]));

  return (
    <PageContainer>
      <PageHeader title="Settings" description="Manage your site configuration" />
      <SettingsTabs
        generalSettings={pickKeys(generalKeys)}
        contactSettings={pickKeys(contactKeys)}
        seoSettings={pickKeys(seoKeys)}
      />
    </PageContainer>
  );
}
