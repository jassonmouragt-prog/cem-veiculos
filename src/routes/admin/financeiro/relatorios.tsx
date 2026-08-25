import { createFileRoute } from "@tanstack/react-router";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminFinanceiroSidebar } from "@/components/admin/financeiro/AdminFinanceiroSidebar";
import { useAdminLayout } from "@/components/admin/AdminLayoutContext";
import { getAllSellersReport, getAllVehiclesProfitability, getFinancialDashboardStats } from "@/lib/db/store";
import { Button } from "@/components/ui/button";
import { FileText, Download, Users, Car, BarChart3, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/db/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin/financeiro/relatorios")({
  component: RelatoriosPage,
});

function RelatoriosPage() {
  const { openMobileMenu } = useAdminLayout();
  const [period, setPeriod] = useState<"month" | "quarter" | "year" | "custom">("month");

  const stats = getFinancialDashboardStats();
  const sellerReport = getAllSellersReport();
  const vehicleProfitability = getAllVehiclesProfitability();

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Relatórios Financeiros"
        description="Análises detalhadas e exportação de dados"
        onOpenMobileMenu={openMobileMenu}
        actions={
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40 h-8 text-xs bg-black/50 border-white/10">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/10 text-white text-xs">
                <SelectItem value="month">Este Mês</SelectItem>
                <SelectItem value="quarter">Este Trimestre</SelectItem>
                <SelectItem value="year">Este Ano</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="gap-1 border-white/10 hover:bg-white/5">
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </Button>
          </div>
        }
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Resumo Executivo */}
        <Card className="bg-[#121212] border-white/5 rounded-2xl">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-base font-bold text-white">Resumo Executivo</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              <p className="text-xs text-gray-400">Faturamento Total</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(stats.totalSales)}</p>
              <p className="text-xs text-emerald-400 mt-1">{stats.totalSalesCount} vendas</p>
            </div>
            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              <p className="text-xs text-gray-400">Recebido (Caixa)</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(stats.totalReceived)}</p>
            </div>
            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              <p className="text-xs text-gray-400">Lucro Estimado</p>
              <p className="text-2xl font-bold text-[#E8231F] mt-1">{formatCurrency(stats.estimatedProfit)}</p>
              <p className="text-xs text-gray-400 mt-1">Margem: {stats.averageMarginPercent.toFixed(1)}%</p>
            </div>
            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              <p className="text-xs text-gray-400">A Pagar / A Receber</p>
              <p className="text-xl font-bold text-amber-400 mt-1">
                {formatCurrency(stats.totalPayable)} / {formatCurrency(stats.totalToReceive)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tabs de Relatórios */}
        <Tabs defaultValue="vendedores" className="space-y-4">
          <TabsList className="bg-[#121212] border border-white/10 rounded-lg p-1 grid grid-cols-3">
            <TabsTrigger value="vendedores" className="text-xs">Por Vendedor</TabsTrigger>
            <TabsTrigger value="veiculos" className="text-xs">Por Veículo</TabsTrigger>
            <TabsTrigger value="financeiro" className="text-xs">Financeiro</TabsTrigger>
          </TabsList>

          <TabsContent value="vendedores">
            <Card className="bg-[#121212] border-white/5 rounded-xl">
              <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-base font-bold text-white">Performance por Vendedor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sellerReport.map((r) => (
                    <div key={r.sellerId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-black/30 rounded-lg border border-white/5">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white">{r.sellerName}</h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {r.salesCount} vendas • Ticket: {formatCurrency(r.averageTicket)} • Desconto médio: {r.averageDiscountPercent.toFixed(1)}%
                        </p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0 text-right">
                        <div>
                          <p className="text-xs text-gray-400">Vendido</p>
                          <p className="font-bold text-white">{formatCurrency(r.totalSold)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Comissão</p>
                          <p className="font-bold text-[#E8231F]">{formatCurrency(r.totalCommissionGenerated)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Status</p>
                          <Badge variant="outline" className={`text-[10px] ${
                            r.totalCommissionPending > 0 ? "bg-amber-500/15 text-amber-400" : "bg-emerald-500/15 text-emerald-400"
                          }`}>
                            {r.totalCommissionPending > 0 ? `Pendente: ${formatCurrency(r.totalCommissionPending)}` : "Quitado"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="veiculos">
            <Card className="bg-[#121212] border-white/5 rounded-xl">
              <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-base font-bold text-white">Rentabilidade por Veículo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {vehicleProfitability.slice(0, 20).map((v) => (
                    <div key={v.vehicleId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-black/30 rounded-lg border border-white/5">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white">{v.vehicleName}</h4>
                        <p className="text-xs text-gray-400 mt-1">
                          Vendedor: {v.sellerName || "—"} • {v.daysInStock} dias em estoque • Desconto: {v.discountPercent.toFixed(1)}%
                        </p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0 text-right">
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Venda</p>
                          <p className="font-bold text-white">{formatCurrency(v.finalPrice)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Custo Total</p>
                          <p className="font-bold text-gray-300">{formatCurrency(v.totalCost)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Margem Líquida</p>
                          <p className="font-bold text-emerald-400">{formatCurrency(v.netMargin)} ({v.marginPercent.toFixed(1)}%)</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financeiro">
            <Card className="bg-[#121212] border-white/5 rounded-xl">
              <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-base font-bold text-white">Movimentação Financeira</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-bold text-emerald-400 mb-3">Principais Entradas</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-400">Vendas de Veículos</span><span className="font-bold text-white">{formatCurrency(stats.totalSales)}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Sinais Recebidos</span><span className="font-bold text-white">{formatCurrency(stats.totalReceived)}</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-red-400 mb-3">Principais Saídas</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-400">Comissões</span><span className="font-bold text-white">{formatCurrency(stats.totalCommissionsGenerated)}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Despesas Operacionais</span><span className="font-bold text-white">{formatCurrency(stats.totalPaid - stats.totalCommissionsGenerated)}</span></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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

function formatDate(value: string): string {
  try {
    const d = new Date(value);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  } catch {
    return value;
  }
}