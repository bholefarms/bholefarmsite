import { PageContainer } from "@/components/admin/page-container";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { Users } from "lucide-react";

export default function CustomersPage() {
  return (
    <PageContainer>
      <PageHeader title="Customers" description="Manage your customer relationships" />
      <EmptyState
        icon={<Users className="size-8" />}
        title="No customers yet"
        description="Customer management will be available soon."
      />
    </PageContainer>
  );
}
