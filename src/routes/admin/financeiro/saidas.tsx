import { createFileRoute } from "@tanstack/react-router";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminFinanceiroSidebar } from "@/components/admin/financeiro/AdminFinanceiroSidebar";
import { FinancialTable } from "@/components/admin/financeiro/FinancialTable";
import { useAdminLayout } from "@/components/admin/AdminLayoutContext";
import { getTransactionsByType } from "@/lib/db/store";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/admin/financeiro/saidas")({
  component: SaidasPage,
});

function SaidasPage() {
  const { openMobileMenu } = useAdminLayout();
  const transactions = getTransactionsByType("saida");

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Saídas Financeiras"
        description="Todas as saídas de dinheiro registradas"
        onOpenMobileMenu={openMobileMenu}
        actions={
          <Button className="bg-brand-gradient hover:opacity-95 text-white font-semibold text-xs sm:text-sm h-9 sm:h-10 gap-1.5 rounded-lg shadow-sm shadow-[#E8231F]/20">
            <Plus className="w-4 h-4" />
            <span>Nova Saída</span>
          </Button>
        }
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <FinancialTable
          transactions={transactions}
          title="Saídas"
          type="saida"
        />
      </main>
    </div>
  );
}