import { createFileRoute } from "@tanstack/react-router";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminFinanceiroSidebar } from "@/components/admin/financeiro/AdminFinanceiroSidebar";
import { FinancialTable } from "@/components/admin/financeiro/FinancialTable";
import { useAdminLayout } from "@/components/admin/AdminLayoutContext";
import { getAccountsPayable, getOverduePayable } from "@/lib/db/store";
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/admin/financeiro/contas-a-pagar")({
  component: ContasAPagarPage,
});

function ContasAPagarPage() {
  const { openMobileMenu } = useAdminLayout();
  const payable = getAccountsPayable();
  const overdue = getOverduePayable();

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Contas a Pagar"
        description={`Pendentes: ${payable.length} | Vencidas: ${overdue.length}`}
        onOpenMobileMenu={openMobileMenu}
        actions={
          <div className="flex items-center gap-2">
            {overdue.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 gap-1"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{overdue.length} vencidas</span>
              </Button>
            )}
            <Button className="bg-brand-gradient hover:opacity-95 text-white font-semibold text-xs sm:text-sm h-9 sm:h-10 gap-1.5 rounded-lg shadow-sm shadow-[#E8231F]/20">
              <Plus className="w-4 h-4" />
              <span>Nova Conta</span>
            </Button>
          </div>
        }
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <FinancialTable
          transactions={payable}
          title="Contas a Pagar"
          type="saida"
          showDueDate
          showStatus
        />
      </main>
    </div>
  );
}
