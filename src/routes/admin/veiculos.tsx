import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  getVehiclesFromStorage,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  toggleVehicleFeatured,
  updateVehicleStatus,
  subscribeToStore,
  formatCurrency,
  formatMileage,
} from "@/lib/db/store";
import { Vehicle, VehicleStatus } from "@/lib/db/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { VehicleForm } from "@/components/admin/VehicleForm";
import { useAdminLayout } from "@/components/admin/AdminLayoutContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  Car,
  MoreVertical,
  Edit3,
  Trash2,
  Sparkles,
  ExternalLink,
  Eye,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  Tag,
} from "lucide-react";
import { SaleFinalizationModal } from "@/components/admin/financeiro/SaleFinalizationModal";
import { getActiveSellers } from "@/lib/db/store";

export const Route = createFileRoute("/admin/veiculos")({
  component: AdminVehiclesPage,
});

function AdminVehiclesPage() {
  const { openMobileMenu } = useAdminLayout();
  const [vehicles, setVehicles] = useState<Vehicle[]>(getVehiclesFromStorage());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [categoryFilter, setCategoryFilter] = useState<string>("todas");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [vehicleToFinalize, setVehicleToFinalize] = useState<Vehicle | null>(null);
  const [isFinalizeOpen, setIsFinalizeOpen] = useState(false);
  const sellers = getActiveSellers();

  useEffect(() => {
    const update = () => {
      setVehicles(getVehiclesFromStorage());
    };
    update();
    const unsubscribe = subscribeToStore(update);
    return () => unsubscribe();
  }, []);

  const filteredVehicles = vehicles.filter((v) => {
    if (statusFilter !== "todos") {
      if (statusFilter === "destaque" && !v.isFeatured) return false;
      if (statusFilter !== "destaque" && v.status !== statusFilter) return false;
    }
    if (categoryFilter !== "todas" && v.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        v.name.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.version.toLowerCase().includes(q) ||
        String(v.modelYear).includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleCreateOrUpdate = async (
    data: Omit<Vehicle, "id" | "slug" | "createdAt" | "updatedAt">,
  ) => {
    if (editingVehicle) {
      await updateVehicle(editingVehicle.id, data);
      toast.success("Veículo atualizado com sucesso!");
    } else {
      await createVehicle(data);
      toast.success("Veículo cadastrado e publicado com sucesso!");
    }
    setIsFormOpen(false);
    setEditingVehicle(null);
  };

  const handleConfirmDelete = async () => {
    if (!vehicleToDelete) return;
    await deleteVehicle(vehicleToDelete.id);
    toast.success("Veículo removido do sistema.");
    setVehicleToDelete(null);
  };

  const handleToggleFeatured = async (v: Vehicle) => {
    const result = await toggleVehicleFeatured(v.id);
    if (result) {
      toast.success(`"${v.name}" adicionado aos destaques da home!`);
    } else {
      toast.info(`"${v.name}" removido dos destaques.`);
    }
  };

  const handleStatusChange = async (id: string, newStatus: VehicleStatus) => {
    if (newStatus === "vendido") {
      const vehicle = vehicles.find((v) => v.id === id);
      if (vehicle) {
        setVehicleToFinalize(vehicle);
        setIsFinalizeOpen(true);
        return;
      }
    }
    await updateVehicleStatus(id, newStatus);
    toast.success(`Status atualizado para: ${newStatus.toUpperCase()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Gerenciamento de Veículos"
        description="Cadastre, edite, altere status e gerencie o estoque completo"
        onOpenMobileMenu={openMobileMenu}
        actions={
          !isFormOpen && (
            <Button
              onClick={() => {
                setEditingVehicle(null);
                setIsFormOpen(true);
              }}
              className="bg-brand-gradient hover:opacity-95 text-white font-semibold text-xs sm:text-sm h-9 sm:h-10 gap-1.5 rounded-lg shadow-md shadow-[#E8231F]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Novo Veículo</span>
            </Button>
          )
        }
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {isFormOpen ? (
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl">
            <VehicleForm
              initialVehicle={editingVehicle}
              onSave={handleCreateOrUpdate}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingVehicle(null);
              }}
            />
          </div>
        ) : (
          <>
            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Buscar por marca, modelo, versão..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-[#121212] border-white/10 pl-10 text-white placeholder:text-gray-500 h-10 text-xs sm:text-sm rounded-lg"
                />
              </div>

              {/* Status filter tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {[
                  { label: "Todos", value: "todos" },
                  { label: "Disponíveis", value: "disponivel" },
                  { label: "Reservados", value: "reservado" },
                  { label: "Vendidos", value: "vendido" },
                  { label: "⭐ Destaques", value: "destaque" },
                ].map((tab) => (
                  <Button
                    key={tab.value}
                    size="sm"
                    variant={statusFilter === tab.value ? "default" : "outline"}
                    onClick={() => setStatusFilter(tab.value)}
                    className={`h-9 text-xs font-semibold rounded-lg shrink-0 ${
                      statusFilter === tab.value
                        ? "bg-[#E8231F] text-white"
                        : "border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Vehicles Cards Grid */}
            {filteredVehicles.length === 0 ? (
              <Card className="bg-[#121212] border-white/5 rounded-2xl p-12 text-center">
                <Car className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">Nenhum veículo encontrado</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
                  Nenhum resultado corresponde aos filtros selecionados. Tente ajustar os termos de
                  busca.
                </p>
                <Button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("todos");
                  }}
                  variant="outline"
                  className="border-white/10 text-xs"
                >
                  Limpar filtros
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredVehicles.map((v) => {
                  const coverImage = v.images[v.mainImageIndex || 0] || v.images[0];
                  const statusBadge = {
                    disponivel: {
                      label: "Disponível",
                      color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                      icon: CheckCircle2,
                    },
                    reservado: {
                      label: "Reservado",
                      color: "bg-amber-500/15 text-amber-400 border-amber-500/30",
                      icon: Clock,
                    },
                    vendido: {
                      label: "Vendido",
                      color: "bg-zinc-800 text-zinc-400 border-zinc-700",
                      icon: Tag,
                    },
                  }[v.status];

                  return (
                    <Card
                      key={v.id}
                      className="bg-[#121212] border-white/5 overflow-hidden flex flex-col rounded-2xl shadow-md hover:border-white/15 transition-all"
                    >
                      {/* Image & Badges */}
                      <div className="relative aspect-[16/9] bg-black overflow-hidden">
                        {coverImage ? (
                          <img
                            src={coverImage}
                            alt={v.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <Car className="w-8 h-8" />
                          </div>
                        )}

                        <div className="absolute top-2 left-2 flex gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border backdrop-blur-md ${statusBadge.color}`}
                          >
                            <statusBadge.icon className="w-3 h-3" />
                            {statusBadge.label}
                          </span>
                          {v.isFeatured && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E8231F] text-white shadow">
                              <Sparkles className="w-3 h-3" /> Destaque
                            </span>
                          )}
                        </div>

                        <div className="absolute top-2 right-2">
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
                              <DropdownMenuLabel>Ações Rápidas</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingVehicle(v);
                                  setIsFormOpen(true);
                                }}
                                className="gap-2 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-blue-400" /> Editar Dados
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleToggleFeatured(v)}
                                className="gap-2 cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                                {v.isFeatured ? "Remover Destaque" : "Marcar como Destaque"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-white/10" />
                              <DropdownMenuLabel className="text-[10px] text-gray-400">
                                Alterar Status
                              </DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(v.id, "disponivel")}
                                className="gap-2 cursor-pointer"
                              >
                                🟢 Marcar Disponível
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(v.id, "reservado")}
                                className="gap-2 cursor-pointer"
                              >
                                🟡 Marcar Reservado
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(v.id, "vendido")}
                                className="gap-2 cursor-pointer"
                              >
                                🔴 Marcar Vendido
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-white/10" />
                              <DropdownMenuItem
                                onClick={() => setVehicleToDelete(v)}
                                className="gap-2 cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-500/10"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Excluir Veículo
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Card Content */}
                      <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-baseline justify-between gap-2">
                            <h3 className="font-bold text-white text-base truncate">{v.name}</h3>
                            <span className="text-sm font-extrabold text-brand-gradient shrink-0">
                              {formatCurrency(v.price)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 truncate">{v.version || v.model}</p>

                          <div className="flex flex-wrap gap-2 text-[11px] text-gray-400 pt-2 border-t border-white/5 mt-2">
                            <span>Ano {v.modelYear}</span>
                            <span>•</span>
                            <span>{formatMileage(v.mileage)}</span>
                            <span>•</span>
                            <span className="capitalize">{v.transmission}</span>
                          </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                          <Link
                            to="/veiculos/$slug"
                            params={{ slug: v.slug }}
                            target="_blank"
                            className="flex-1"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full h-8 text-xs border-white/10 hover:bg-white/5 gap-1 text-gray-300"
                            >
                              <Eye className="w-3.5 h-3.5" /> Ver no Site
                            </Button>
                          </Link>
                          <Button
                            onClick={() => {
                              setEditingVehicle(v);
                              setIsFormOpen(true);
                            }}
                            size="sm"
                            className="flex-1 h-8 text-xs bg-brand-gradient hover:opacity-95 text-white gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Editar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Alert Dialog */}
        <AlertDialog
          open={vehicleToDelete !== null}
          onOpenChange={(open) => !open && setVehicleToDelete(null)}
        >
          <AlertDialogContent className="bg-[#121212] border border-white/10 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir veículo do estoque?</AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-gray-400 leading-relaxed">
                Tem certeza que deseja excluir <strong>{vehicleToDelete?.name}</strong>? Esta ação
                removerá o veículo imediatamente do painel administrativo e do catálogo público do
                site.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-white/10 hover:bg-white/5 text-gray-300 text-xs">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs"
              >
                Sim, Excluir Veículo
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Sale Finalization Modal */}
        <SaleFinalizationModal
          isOpen={isFinalizeOpen}
          onClose={() => setIsFinalizeOpen(false)}
          vehicle={
            vehicleToFinalize
              ? {
                  id: vehicleToFinalize.id,
                  name: vehicleToFinalize.name,
                  price: vehicleToFinalize.price,
                  acquisitionCost: vehicleToFinalize.acquisitionCost,
                }
              : null
          }
          sellers={sellers}
          onFinalize={() => setIsFinalizeOpen(false)}
        />
      </main>
    </div>
  );
}
