import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminFinanceiroSidebar } from "@/components/admin/financeiro/AdminFinanceiroSidebar";
import { useAdminLayout } from "@/components/admin/AdminLayoutContext";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export const Route = createFileRoute("/admin/financeiro")({
  component: FinanceiroLayout,
});

function FinanceiroLayout() {
  const { openMobileMenu } = useAdminLayout();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row antialiased selection:bg-[#E8231F] selection:text-white">
      <AdminFinanceiroSidebar onOpenMobileMenu={openMobileMenu} />
      <div className="flex-1 min-w-0 flex flex-col min-h-screen bg-[#0a0a0a]">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>
    </div>
  );
}
