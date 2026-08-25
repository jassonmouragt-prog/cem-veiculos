import { createFileRoute } from "@tanstack/react-router";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { FinancialMetricCard } from "@/components/admin/financeiro/FinancialMetricCard";
import { FinanceiroCharts } from "@/components/admin/financeiro/FinanceiroCharts";
import { useAdminLayout } from "@/components/admin/AdminLayoutContext";
import { getFinancialDashboardStats } from "@/lib/db/store";
import {
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Receipt,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export const Route = createFileRoute("/admin/financeiro/")({
  component: FinanceiroDashboardPage,
});

function FinanceiroDashboardPage() {
  const { openMobileMenu } = useAdminLayout();
  const stats = getFinancialDashboardStats();

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Dashboard Financeiro"
        description="Visão consolidada da saúde financeira da loja"
        onOpenMobileMenu={openMobileMenu}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* KPI Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          <FinancialMetricCard
            title="Faturamento"
            value={stats.totalSales}
            description={`${stats.totalSalesCount} vendas`}
            icon={DollarSign}
            badgeColor="blue"
            trend={{ value: 12.5, positive: true }}
          />
          <FinancialMetricCard
            title="Entradas (Recebido)"
            value={stats.totalReceived}
            description="Dinheiro em caixa"
            icon={ArrowDownLeft}
            badgeColor="green"
            trend={{ value: 8.2, positive: true }}
          />
          <FinancialMetricCard
            title="A Receber"
            value={stats.totalToReceive}
            description="Futuro"
            icon={Receipt}
            badgeColor="amber"
            trend={{ value: -3.1, positive: false }}
          />
          <FinancialMetricCard
            title="Saídas (Pago)"
            value={stats.totalPaid}
            description="Despesas liquidadas"
            icon={ArrowUpRight}
            badgeColor="red"
            trend={{ value: 5.7, positive: false }}
          />
          <FinancialMetricCard
            title="Contas a Pagar"
            value={stats.totalPayable}
            description="Pendentes"
            icon={CreditCard}
            badgeColor="red"
            trend={{ value: -2.3, positive: true }}
          />
          <FinancialMetricCard
            title="Comissões Geradas"
            value={stats.totalCommissionsGenerated}
            description={`Pagas: ${formatCurrency(stats.totalCommissionsPaid)}`}
            icon={Users}
            badgeColor="purple"
          />
          <FinancialMetricCard
            title="Lucro Estimado"
            value={stats.estimatedProfit}
            description="Após custo + comissão"
            icon={TrendingUp}
            badgeColor="emerald"
            trend={{ value: 15.8, positive: true }}
          />
          <FinancialMetricCard
            title="Margem Média"
            value={`${stats.averageMarginPercent.toFixed(1)}%`}
            description="Sobre faturamento"
            icon={TrendingDown}
            badgeColor="blue"
          />
        </div>

        {/* Charts */}
        <FinanceiroCharts />
      </main>
    </div>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}