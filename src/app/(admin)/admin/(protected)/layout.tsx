import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <>
      <AdminShell userName={session.user.name || "Admin"} userEmail={session.user.email || undefined}>
        {children}
      </AdminShell>
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
