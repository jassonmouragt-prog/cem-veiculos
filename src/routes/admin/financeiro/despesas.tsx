import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminFinanceiroSidebar } from "@/components/admin/financeiro/AdminFinanceiroSidebar";
import { useAdminLayout } from "@/components/admin/AdminLayoutContext";
import { getExpensesFromStorage, getVehiclesFromStorage } from "@/lib/db/store";
import { Button } from "@/components/ui/button";
import { Plus, Truck, Wrench, FileText, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/db/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehicleExpenseModal } from "@/components/admin/financeiro/VehicleExpenseModal";

export const Route = createFileRoute("/admin/financeiro/despesas")({
  component: DespesasPage,
});

function DespesasPage() {
  const { openMobileMenu } = useAdminLayout();
  const expenses = getExpensesFromStorage();
  const vehicles = getVehiclesFromStorage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicleForExpense, setSelectedVehicleForExpense] = useState<{
    id: string;
    name: string;
    price?: number;
  } | null>(null);

  const handleNewExpense = (vehicle?: { id: string; name: string; price?: number } | null) => {
    setSelectedVehicleForExpense(vehicle || null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Despesas de Veículos"
        description="Despesas vinculadas a veículos específicos (manutenção, documentação, etc.)"
        onOpenMobileMenu={openMobileMenu}
        actions={
          <Button
            className="bg-brand-gradient hover:opacity-95 text-white font-semibold text-xs sm:text-sm h-9 sm:h-10 gap-1.5 rounded-lg shadow-sm shadow-[#E8231F]/20"
            onClick={() => handleNewExpense(null)}
          >
            <Plus className="w-4 h-4" />
            <span>Nova Despesa</span>
          </Button>
        }
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Tabs: Por Veículo | Todas */}
        <Tabs defaultValue="veiculos" className="space-y-4">
          <TabsList className="bg-[#121212] border border-white/10 rounded-lg p-1">
            <TabsTrigger value="veiculos" className="text-xs">
              Por Veículo
            </TabsTrigger>
            <TabsTrigger value="todas" className="text-xs">
              Todas as Despesas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="veiculos">
            <div className="space-y-4">
              {vehicles.map((vehicle) => {
                const vehicleExpenses = expenses.filter((e) => e.vehicleId === vehicle.id);
                const totalExpenses = vehicleExpenses.reduce((s, e) => s + e.amount, 0);
                return (
                  <Card key={vehicle.id} className="bg-[#121212] border-white/5 rounded-xl">
                    <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-sm font-bold text-white">
                          {vehicle.name}
                        </CardTitle>
                        <p className="text-xs text-gray-400">
                          {vehicleExpenses.length} despesas • Total: {formatCurrency(totalExpenses)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-black/60 text-white hover:bg-black rounded-lg"
                        onClick={() =>
                          handleNewExpense({
                            id: vehicle.id,
                            name: vehicle.name,
                            price: vehicle.price,
                          })
                        }
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="p-3">
                      {vehicleExpenses.length === 0 ? (
                        <p className="text-xs text-gray-500 text-center py-4">
                          Nenhuma despesa registrada para este veículo
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {vehicleExpenses.slice(0, 5).map((e) => (
                            <div
                              key={e.id}
                              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2 bg-black/30 rounded-lg border border-white/5"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-white text-sm">{e.description}</p>
                                <p className="text-xs text-gray-400">
                                  {e.category} • {formatDate(e.expenseDate)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-bold text-white">
                                  {formatCurrency(e.amount)}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] ${
                                    e.paymentStatus === "pago"
                                      ? "bg-emerald-500/15 text-emerald-400"
                                      : e.paymentStatus === "atrasado"
                                        ? "bg-red-500/15 text-red-400"
                                        : "bg-amber-500/15 text-amber-400"
                                  }`}
                                >
                                  {e.paymentStatus}
                                </Badge>
                              </div>
                            </div>
                          ))}
                          {vehicleExpenses.length > 5 && (
                            <p className="text-xs text-gray-400 text-center py-2">
                              +{vehicleExpenses.length - 5} despesas
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="todas">
            <Card className="bg-[#121212] border-white/5 rounded-xl">
              <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-bold text-white">Todas as Despesas</CardTitle>
                <Select className="w-48">
                  <SelectTrigger className="h-8 text-xs bg-black/50 border-white/10">
                    <SelectValue placeholder="Filtrar categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-white text-xs">
                    <SelectItem value="manutencao">Manutenção</SelectItem>
                    <SelectItem value="documentacao">Documentação</SelectItem>
                    <SelectItem value="despachante">Despachante</SelectItem>
                    <SelectItem value="lavagem">Lavagem</SelectItem>
                    <SelectItem value="compra_veiculo">Compra de Veículo</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expenses.slice(0, 100).map((e) => {
                    const vehicle = vehicles.find((v) => v.id === e.vehicleId);
                    return (
                      <div
                        key={e.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-black/30 rounded-lg border border-white/5"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-sm flex-wrap">
                            <span className="font-medium text-white">{e.description}</span>
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-[#E8231F]/15 text-[#E8231F]"
                            >
                              {e.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${
                                e.paymentStatus === "pago"
                                  ? "bg-emerald-500/15 text-emerald-400"
                                  : e.paymentStatus === "atrasado"
                                    ? "bg-red-500/15 text-red-400"
                                    : "bg-amber-500/15 text-amber-400"
                              }`}
                            >
                              {e.paymentStatus}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {vehicle ? vehicle.name : "—"} • {formatDate(e.expenseDate)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-bold text-white">{formatCurrency(e.amount)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <VehicleExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialVehicle={selectedVehicleForExpense}
      />
    </div>
  );
}
