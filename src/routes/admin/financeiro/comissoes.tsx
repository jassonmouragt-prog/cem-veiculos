import { createFileRoute } from "@tanstack/react-router";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminFinanceiroSidebar } from "@/components/admin/financeiro/AdminFinanceiroSidebar";
import { useAdminLayout } from "@/components/admin/AdminLayoutContext";
import { getAllSellersReport, getActiveSellers, getTransactionsByCategory } from "@/lib/db/store";
import { Button } from "@/components/ui/button";
import { Plus, Users, CreditCard, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/db/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin/financeiro/comissoes")({
  component: ComissoesPage,
});

function ComissoesPage() {
  const { openMobileMenu } = useAdminLayout();
  const sellers = getActiveSellers();
  const commissionTransactions = getTransactionsByCategory("comissao");

  const report = getAllSellersReport();

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Comissões"
        description="Gestão de comissões dos vendedores"
        onOpenMobileMenu={openMobileMenu}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#121212] border-white/5 rounded-2xl">
            <CardContent className="p-5 space-y-2">
              <p className="text-xs text-gray-400">Total Gerado</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(commissionTransactions.reduce((s, t) => s + t.amount, 0))}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-[#121212] border-white/5 rounded-2xl">
            <CardContent className="p-5 space-y-2">
              <p className="text-xs text-gray-400">Pago</p>
              <p className="text-2xl font-bold text-emerald-400">
                {formatCurrency(
                  commissionTransactions
                    .filter((t) => t.status === "pago")
                    .reduce((s, t) => s + t.amount, 0),
                )}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-[#121212] border-white/5 rounded-2xl">
            <CardContent className="p-5 space-y-2">
              <p className="text-xs text-gray-400">Pendente</p>
              <p className="text-2xl font-bold text-amber-400">
                {formatCurrency(
                  commissionTransactions
                    .filter((t) => t.status === "pendente")
                    .reduce((s, t) => s + t.amount, 0),
                )}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-[#121212] border-white/5 rounded-2xl">
            <CardContent className="p-5 space-y-2">
              <p className="text-xs text-gray-400">Vendedores Ativos</p>
              <p className="text-2xl font-bold text-white">{sellers.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs: Resumo por Vendedor | Lançamentos */}
        <Tabs defaultValue="resumo" className="space-y-4">
          <TabsList className="bg-[#121212] border border-white/10 rounded-lg p-1">
            <TabsTrigger value="resumo" className="text-xs">
              Resumo por Vendedor
            </TabsTrigger>
            <TabsTrigger value="lancamentos" className="text-xs">
              Lançamentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resumo">
            <div className="space-y-4">
              {report.map((r) => (
                <Card key={r.sellerId} className="bg-[#121212] border-white/5 rounded-xl">
                  <CardContent className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="md:col-span-2">
                        <h4 className="font-bold text-white">{r.sellerName}</h4>
                        <p className="text-xs text-gray-400">
                          {r.salesCount} vendas • Ticket médio: {formatCurrency(r.averageTicket)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Vendido</p>
                        <p className="font-bold text-white">{formatCurrency(r.totalSold)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Comissão</p>
                        <p className="font-bold text-[#E8231F]">
                          {formatCurrency(r.totalCommissionGenerated)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              r.totalCommissionPending > 0
                                ? "bg-amber-500/15 text-amber-400"
                                : "bg-emerald-500/15 text-emerald-400"
                            }`}
                          >
                            {r.totalCommissionPending > 0
                              ? `Pendente: ${formatCurrency(r.totalCommissionPending)}`
                              : "Quitado"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lancamentos">
            <Card className="bg-[#121212] border-white/5 rounded-xl">
              <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-base font-bold text-white">
                  Lançamentos de Comissão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {commissionTransactions.slice(0, 50).map((t) => (
                    <div
                      key={t.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-black/30 rounded-lg border border-white/5"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-white">{t.description}</span>
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              t.status === "pago"
                                ? "bg-emerald-500/15 text-emerald-400"
                                : t.status === "atrasado"
                                  ? "bg-red-500/15 text-red-400"
                                  : "bg-amber-500/15 text-amber-400"
                            }`}
                          >
                            {t.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(t.transactionDate)} • {t.seller?.name || "Vendedor"}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="font-bold text-white whitespace-nowrap">
                          {formatCurrency(t.amount)}
                        </span>
                        {t.status === "pendente" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs border-emerald-500/50 text-emerald-400"
                          >
                            Marcar Pago
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
