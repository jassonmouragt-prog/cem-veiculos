import { createFileRoute } from "@tanstack/react-router";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminLayout } from "@/components/admin/AdminLayoutContext";
import { getCurrentMonthRevenue, getCurrentMonthExpenses, subscribeToStore, isStoreLoaded } from "@/lib/db/store";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FaturamentoMensalChart } from "@/components/admin/financeiro/FaturamentoMensalChart";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/admin/financeiro/")({
  component: FinanceiroDashboardPage,
});

function FinanceiroDashboardPage() {
  const { openMobileMenu } = useAdminLayout();
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(0);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState(0);
  const [storeLoaded, setStoreLoaded] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      setCurrentMonthRevenue(getCurrentMonthRevenue());
      setCurrentMonthExpenses(getCurrentMonthExpenses());
    };

    const checkLoaded = () => {
      if (isStoreLoaded()) {
        setStoreLoaded(true);
        updateStats();
      }
    };

    checkLoaded();
    const unsubscribe = subscribeToStore(() => {
      updateStats();
      setStoreLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Dashboard Financeiro"
        description="Visão simplificada do faturamento e despesas"
        onOpenMobileMenu={openMobileMenu}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* BLOCO 1 — FATURAMENTO DO MÊS ATUAL */}
        <Card className="bg-[#121212] border-white/5 rounded-2xl w-full">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="inline-flex items-center gap-2 text-gray-400 text-sm font-medium mb-2">
              <DollarSign className="w-4 h-4 text-[#E8231F]" />
              <span>Faturamento do mês</span>
            </div>
            <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
              {formatCurrency(currentMonthRevenue)}
            </div>
            {!storeLoaded && (
              <p className="text-xs text-gray-500 mt-2">Carregando dados...</p>
            )}
          </CardContent>
        </Card>

        {/* BLOCO 2 — FATURAMENTO X DESPESAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-[#121212] border-white/5 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-2">
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
                <span>Faturamento</span>
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-white">
                {formatCurrency(currentMonthRevenue)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#121212] border-white/5 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-2">
                <TrendingDown className="w-4 h-4 text-[#EF4444]" />
                <span>Despesas</span>
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-white">
                {formatCurrency(currentMonthExpenses)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* BLOCO 3 — GRÁFICO DE FATURAMENTO MENSAL */}
        <FaturamentoMensalChart />
      </main>
    </div>
  );
}