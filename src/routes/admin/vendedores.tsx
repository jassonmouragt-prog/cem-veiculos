import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getSellersFromStorage,
  createSeller,
  updateSeller,
  deleteSeller,
  subscribeToStore,
} from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/auth-service";
import { Seller } from "@/lib/db/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminLayout } from "@/components/admin/AdminLayoutContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Edit3,
  Trash2,
  UserCheck,
  UserX,
  Users,
  DollarSign,
  X,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/admin/vendedores")({
  component: VendedoresPage,
});

function VendedoresPage() {
  const { openMobileMenu } = useAdminLayout();
  const [sellers, setSellers] = useState<Seller[]>(getSellersFromStorage());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const [sellerToDelete, setSellerToDelete] = useState<Seller | null>(null);

  useEffect(() => {
    const update = () => {
      setSellers(getSellersFromStorage());
    };
    update();
    const unsubscribe = subscribeToStore(update);
    return () => unsubscribe();
  }, []);

  const handleCreateOrUpdate = async (data: {
    name: string;
    email?: string;
    phone?: string;
    commissionRate: number;
    isActive: boolean;
    canReceiveCommission: boolean;
  }) => {
    if (editingSeller) {
      await updateSeller(editingSeller.id, data);
      toast.success("Vendedor atualizado com sucesso!");
      setIsFormOpen(false);
      setEditingSeller(null);
    } else {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      await createSeller({ ...data, userId: currentUser.id });
      toast.success("Vendedor cadastrado com sucesso!");
      // NÃO fecha o form aqui - deixa o form mostrar tela de sucesso
    }
  };

  const handleConfirmDelete = async () => {
    if (!sellerToDelete) return;
    await deleteSeller(sellerToDelete.id);
    toast.success("Vendedor removido.");
    setSellerToDelete(null);
  };

  const handleToggleActive = async (seller: Seller) => {
    await updateSeller(seller.id, { isActive: !seller.isActive });
    toast.success(seller.isActive ? "Vendedor desativado" : "Vendedor ativado");
  };

  const handleToggleCommission = async (seller: Seller) => {
    await updateSeller(seller.id, { canReceiveCommission: !seller.canReceiveCommission });
    toast.success(seller.canReceiveCommission ? "Comissão desativada" : "Comissão ativada");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Gerenciamento de Vendedores"
        description="Cadastre vendedores para atribuição de comissões nas vendas"
        onOpenMobileMenu={openMobileMenu}
        actions={
          !isFormOpen && (
            <Button
              onClick={() => {
                setEditingSeller(null);
                setIsFormOpen(true);
              }}
              className="bg-brand-gradient hover:opacity-95 text-white font-semibold text-xs sm:text-sm h-9 sm:h-10 gap-1.5 rounded-lg shadow-md shadow-[#E8231F]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Vendedor</span>
            </Button>
          )
        }
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {isFormOpen ? (
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl max-w-2xl mx-auto">
            <SellerForm
              initialSeller={editingSeller}
              onSave={handleCreateOrUpdate}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingSeller(null);
              }}
            />
          </div>
        ) : (
          <>
            {sellers.length === 0 ? (
              <Card className="bg-[#121212] border-white/5 rounded-2xl p-12 text-center">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">Nenhum vendedor cadastrado</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
                  Adicione vendedores para que possam ser selecionados na finalização de vendas
                  e receber comissões automaticamente.
                </p>
                <Button
                  onClick={() => setIsFormOpen(true)}
                  className="bg-brand-gradient hover:opacity-95 text-white font-semibold text-xs sm:text-sm h-9 sm:h-10 gap-1.5 rounded-lg shadow-md shadow-[#E8231F]/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Primeiro Vendedor</span>
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {sellers.map((seller) => (
                  <Card
                    key={seller.id}
                    className="bg-[#121212] border-white/5 overflow-hidden flex flex-col rounded-2xl shadow-md hover:border-white/15 transition-all"
                  >
                    <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/5 px-4 pt-4">
                      <CardTitle className="text-sm font-bold text-white truncate">{seller.name}</CardTitle>
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
                            onClick={() => {
                              setEditingSeller(seller);
                              setIsFormOpen(true);
                            }}
                            className="gap-2 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-400" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem
                            onClick={() => handleToggleActive(seller)}
                            className="gap-2 cursor-pointer"
                          >
                            {seller.isActive ? (
                              <>
                                <UserX className="w-3.5 h-3.5 text-amber-400" />
                                Desativar
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                                Ativar
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleCommission(seller)}
                            className="gap-2 cursor-pointer"
                          >
                            {seller.canReceiveCommission ? (
                              <>
                                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                                Desativar comissão
                              </>
                            ) : (
                              <>
                                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                                Ativar comissão
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem
                            onClick={() => setSellerToDelete(seller)}
                            className="gap-2 cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-500/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2 text-xs">
                        {seller.email && (
                          <div className="flex items-center gap-2 text-gray-400">
                            <span className="w-20 shrink-0">E-mail</span>
                            <span className="text-white truncate">{seller.email}</span>
                          </div>
                        )}
                        {seller.phone && (
                          <div className="flex items-center gap-2 text-gray-400">
                            <span className="w-20 shrink-0">Telefone</span>
                            <span className="text-white">{seller.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-400">
                          <span className="w-20 shrink-0">Comissão</span>
                          <span className="font-bold text-white">{seller.commissionRate}%</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            seller.isActive
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                              : "bg-zinc-800 text-zinc-400 border-zinc-700"
                          }`}
                        >
                          {seller.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            seller.canReceiveCommission
                              ? "bg-[#E8231F]/15 text-[#E8231F] border-[#E8231F]/30"
                              : "bg-zinc-800 text-zinc-400 border-zinc-700"
                          }`}
                        >
                          {seller.canReceiveCommission ? "Recebe comissão" : "Sem comissão"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <AlertDialog
              open={sellerToDelete !== null}
              onOpenChange={(open) => !open && setSellerToDelete(null)}
            >
              <AlertDialogContent className="bg-[#121212] border border-white/10 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir vendedor?</AlertDialogTitle>
                  <AlertDialogDescription className="text-xs text-gray-400 leading-relaxed">
                    Tem certeza que deseja excluir <strong>{sellerToDelete?.name}</strong>?
                    Vendas já finalizadas manterão o registro do vendedor, mas ele não aparecerá
                    mais para novas vendas.
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
                    Sim, Excluir Vendedor
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </main>
    </div>
  );
}

interface SellerFormProps {
  initialSeller: Seller | null;
  onSave: (data: {
    name: string;
    email?: string;
    phone?: string;
    commissionRate: number;
    isActive: boolean;
    canReceiveCommission: boolean;
  }) => Promise<void>;
  onCancel: () => void;
}

function SellerForm({ initialSeller, onSave, onCancel }: SellerFormProps) {
  const [name, setName] = useState(initialSeller?.name || "");
  const [email, setEmail] = useState(initialSeller?.email || "");
  const [phone, setPhone] = useState(initialSeller?.phone || "");
  const [commissionRate, setCommissionRate] = useState(initialSeller?.commissionRate || 2);
  const [isActive, setIsActive] = useState(initialSeller?.isActive ?? true);
  const [canReceiveCommission, setCanReceiveCommission] = useState(initialSeller?.canReceiveCommission ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }
    if (commissionRate < 0 || commissionRate > 20) {
      toast.error("Comissão deve ser entre 0% e 20%");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSave({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        commissionRate,
        isActive,
        canReceiveCommission,
      });
      setSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4 text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/20 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white">
          {initialSeller ? "Vendedor atualizado!" : "Vendedor cadastrado com sucesso!"}
        </h3>
        <p className="text-xs text-gray-400">
          {name} agora está disponível para receber comissões nas vendas.
        </p>
        <div className="flex gap-2 pt-4 justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-white/10 hover:bg-white/5 text-gray-300 text-xs h-10 px-4 rounded-lg"
          >
            Fechar
          </Button>
          {!initialSeller && (
            <Button
              type="button"
              onClick={() => {
                setSuccess(false);
                setName("");
                setEmail("");
                setPhone("");
                setCommissionRate(2);
                setIsActive(true);
                setCanReceiveCommission(true);
              }}
              className="bg-brand-gradient hover:opacity-95 text-white font-semibold text-xs h-10 px-4 rounded-lg shadow-sm shadow-[#E8231F]/20"
            >
              Cadastrar Outro
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white">{initialSeller ? "Editar Vendedor" : "Novo Vendedor"}</h3>
        <Button type="button" variant="ghost" size="icon" onClick={onCancel} disabled={isSubmitting}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-gray-300">Nome *</Label>
        <Input
          placeholder="Nome completo do vendedor"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
          className="bg-black/50 border-white/10 text-white h-10 text-xs sm:text-sm rounded-lg"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-gray-300">E-mail</Label>
        <Input
          type="email"
          placeholder="email@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          className="bg-black/50 border-white/10 text-white h-10 text-xs sm:text-sm rounded-lg"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-gray-300">Telefone</Label>
        <Input
          placeholder="(11) 99999-9999"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isSubmitting}
          className="bg-black/50 border-white/10 text-white h-10 text-xs sm:text-sm rounded-lg"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-gray-300">Taxa de Comissão (%) *</Label>
        <Input
          type="number"
          step="0.1"
          min="0"
          max="20"
          value={commissionRate}
          onChange={(e) => setCommissionRate(Number(e.target.value) || 0)}
          disabled={isSubmitting}
          className="bg-black/50 border-white/10 text-white h-10 text-xs sm:text-sm rounded-lg w-24"
        />
      </div>

      <div className="pt-2 border-t border-white/5 space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isActive}
            onCheckedChange={setIsActive}
            disabled={isSubmitting}
            className="data-[state=checked]:bg-[#E8231F] data-[state=checked]:border-[#E8231F]"
          />
          <Label className="text-xs text-gray-300 cursor-pointer">Vendedor ativo (aparece na lista de vendas)</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={canReceiveCommission}
            onCheckedChange={setCanReceiveCommission}
            disabled={isSubmitting}
            className="data-[state=checked]:bg-[#E8231F] data-[state=checked]:border-[#E8231F]"
          />
          <Label className="text-xs text-gray-300 cursor-pointer">Pode receber comissão</Label>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-white/5">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 border-white/10 hover:bg-white/5 text-gray-300 text-xs h-10 rounded-lg"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-brand-gradient hover:opacity-95 text-white font-semibold text-xs h-10 rounded-lg shadow-sm shadow-[#E8231F]/20"
        >
          {isSubmitting ? "Salvando..." : (initialSeller ? "Salvar Alterações" : "Cadastrar Vendedor")}
        </Button>
      </div>
    </form>
  );
}