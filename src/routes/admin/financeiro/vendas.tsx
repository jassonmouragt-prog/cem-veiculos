import { createFileRoute } from "@tanstack/react-router";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminFinanceiroSidebar } from "@/components/admin/financeiro/AdminFinanceiroSidebar";
import { useAdminLayout } from "@/components/admin/AdminLayoutContext";
import { getSalesFromStorage, getActiveSellers } from "@/lib/db/store";
import { Button } from "@/components/ui/button";
import { Plus, Car, DollarSign, Eye, Edit3, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency, formatDate } from "@/lib/db/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sale } from "@/lib/db/types";
import { useState } from "react";
import { toast } from "sonner";
import { SaleFinalizationModal } from "@/components/admin/financeiro/SaleFinalizationModal";

export const Route = createFileRoute("/admin/financeiro/vendas")({
  component: VendasPage,
});

function VendasPage() {
  const { openMobileMenu } = useAdminLayout();
  const sales = getSalesFromStorage();
  const sellers = getActiveSellers();
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [isFinalizeOpen, setIsFinalizeOpen] = useState(false);
  const [vehicleToFinalize, setVehicleToFinalize] = useState<{
    id: string;
    name: string;
    price: number;
    acquisitionCost?: number;
  } | null>(null);

  const statusColors = {
    concluida: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    cancelada: "bg-red-500/15 text-red-400 border-red-500/30",
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Vendas Finalizadas"
        description="Gestão e finalização de vendas de veículos"
        onOpenMobileMenu={openMobileMenu}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setVehicleToFinalize(null);
                setIsFinalizeOpen(true);
              }}
              className="border-white/10 hover:bg-white/5 text-gray-300 gap-1"
            >
              <Car className="w-4 h-4" />
              <span>Finalizar Venda</span>
            </Button>
          </div>
        }
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <div className="space-y-4">
          {sales.length === 0 ? (
            <Card className="bg-[#121212] border-white/5 rounded-2xl p-12 text-center">
              <DollarSign className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">Nenhuma venda registrada</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Finalize a primeira venda clicando em "Finalizar Venda" ou marcando um veículo como
                vendido.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {sales.map((sale) => {
                const statusBadge = statusColors[sale.status];
                return (
                  <Card
                    key={sale.id}
                    className="bg-[#121212] border-white/5 overflow-hidden flex flex-col rounded-2xl shadow-md hover:border-white/15 transition-all"
                  >
                    <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/5 px-4 pt-4">
                      <CardTitle className="text-sm font-bold text-white truncate">
                        {sale.vehicle?.name || `Veículo ${sale.vehicleId.slice(0, 8)}`}
                      </CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 bg-black/60 backdrop-blur-md text-white hover:bg-black rounded-lg"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#1a1a1a] border-white/10 text-white text-xs"
                        >
                          <DropdownMenuItem
                            onClick={() => setEditingSale(sale)}
                            className="gap-2 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-400" /> Editar
                          </DropdownMenuItem>
                          {sale.status === "concluida" && (
                            <DropdownMenuItem
                              onClick={() => {}}
                              className="gap-2 cursor-pointer text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Cancelar Venda
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent className="p-4 flex-1 flex flex-col space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-gray-400">Vendedor</span>
                          <p className="font-medium text-white">{sale.seller?.name || "—"}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Comissão</span>
                          <p className="font-medium text-white">
                            {formatCurrency(sale.commissionValue)}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">Forma Pagamento</span>
                          <p className="font-medium text-white capitalize">
                            {sale.paymentMethod.replace("_", " ")}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">Data</span>
                          <p className="font-medium text-white">{formatDate(sale.saleDate)}</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-white/5 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Anunciado</span>
                          <span className="font-medium text-white">
                            {formatCurrency(sale.announcedPrice)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Final</span>
                          <span className="font-bold text-white">
                            {formatCurrency(sale.finalPrice)}
                          </span>
                        </div>
                        {sale.discountAmount > 0 && (
                          <div className="flex justify-between text-sm text-red-400">
                            <span>Desconto</span>
                            <span>
                              {formatCurrency(sale.discountAmount)} (
                              {sale.discountPercent.toFixed(1)}%)
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm text-emerald-400">
                          <span>Margem Líquida</span>
                          <span className="font-bold">{formatCurrency(sale.netMargin)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadge}`}
                        >
                          {sale.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingSale(sale)}
                          className="flex-1 h-8 text-xs gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Ver Detalhes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <SaleFinalizationModal
            isOpen={isFinalizeOpen}
            onClose={() => setIsFinalizeOpen(false)}
            vehicle={vehicleToFinalize}
            sellers={sellers}
            onFinalize={() => {
              setIsFinalizeOpen(false);
              setVehicleToFinalize(null);
            }}
          />
        </div>
      </main>
    </div>
  );
}
