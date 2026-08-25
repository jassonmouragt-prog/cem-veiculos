import { createFileRoute } from "@tanstack/react-router";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminFinanceiroSidebar } from "@/components/admin/financeiro/AdminFinanceiroSidebar";
import { useAdminLayout } from "@/components/admin/AdminLayoutContext";
import { FinanceiroCharts } from "@/components/admin/financeiro/FinanceiroCharts";

export const Route = createFileRoute("/admin/financeiro/graficos")({
  component: GraficosPage,
});

function GraficosPage() {
  const { openMobileMenu } = useAdminLayout();

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Gráficos Financeiros"
        description="Visualizações detalhadas da performance financeira"
        onOpenMobileMenu={openMobileMenu}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <FinanceiroCharts />
      </main>
    </div>
  );
}
