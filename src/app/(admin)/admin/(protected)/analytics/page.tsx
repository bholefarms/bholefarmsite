import { PageContainer } from "@/components/admin/page-container";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <PageContainer>
      <PageHeader title="Analytics" description="Track your farm's performance" />
      <EmptyState
        icon={<BarChart3 className="size-8" />}
        title="No analytics data available yet"
        description="Analytics will be available in a future update."
      />
    </PageContainer>
  );
}
