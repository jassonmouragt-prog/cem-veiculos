import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getCurrentUser, updateAdminPassword } from "@/lib/auth/auth-service";
import {
  resetAllSales,
  updateSiteSettings,
  formatPhoneDisplay,
  buildWhatsAppUrl,
} from "@/lib/db/store";
import type { SiteSettings } from "@/lib/db/types";
import { useSiteSettings } from "@/lib/site/use-site-settings";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminLayout } from "@/components/admin/AdminLayoutContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShieldCheck,
  KeyRound,
  UserCheck,
  Store,
  Save,
  Lock,
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
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

export const Route = createFileRoute("/admin/configuracoes")({
  component: AdminSettingsPage,
});

function StoreInformationCard() {
  const settings = useSiteSettings();
  const [form, setForm] = useState<Omit<SiteSettings, "updatedAt">>({
    dealerName: settings.dealerName,
    email: settings.email,
    whatsappPrimary: settings.whatsappPrimary,
    whatsappSecondary: settings.whatsappSecondary,
    address: settings.address,
    city: settings.city,
    hoursWeekdays: settings.hoursWeekdays,
    hoursSaturday: settings.hoursSaturday,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm({
      dealerName: settings.dealerName,
      email: settings.email,
      whatsappPrimary: settings.whatsappPrimary,
      whatsappSecondary: settings.whatsappSecondary,
      address: settings.address,
      city: settings.city,
      hoursWeekdays: settings.hoursWeekdays,
      hoursSaturday: settings.hoursSaturday,
    });
  }, [settings]);

  const handleChange = (key: keyof Omit<SiteSettings, "updatedAt">, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSiteSettings(form);
      toast.success("Dados da concessionária atualizados com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível salvar. Verifique sua permissão e tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="bg-[#121212] border-white/5 rounded-2xl shadow-md">
      <CardHeader className="pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8231F]/15 text-[#E8231F]">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-white">
              Dados da Concessionária
            </CardTitle>
            <CardDescription className="text-xs text-gray-400">
              Informações públicas exibidas no site (WhatsApp, endereço, horário e e-mail)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <form onSubmit={handleSave}>
        <CardContent className="pt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-full">
              <Label className="text-xs text-gray-300">Razão Social / Nome Exibido</Label>
              <Input
                value={form.dealerName}
                onChange={(e) => handleChange("dealerName", e.target.value)}
                placeholder="C&M Veículos Ltda."
                className="bg-black/50 border-white/10 text-white h-11 text-xs sm:text-sm rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">WhatsApp Principal</Label>
              <Input
                value={form.whatsappPrimary}
                onChange={(e) => handleChange("whatsappPrimary", e.target.value)}
                inputMode="tel"
                placeholder="84991548912"
                className="bg-black/50 border-white/10 text-white h-11 text-xs sm:text-sm rounded-lg"
              />
              <p className="text-[11px] text-gray-500 truncate">
                Link: {buildWhatsAppUrl(form.whatsappPrimary)} — exibido como{" "}
                <span className="text-gray-400">{formatPhoneDisplay(form.whatsappPrimary)}</span>
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">WhatsApp Secundário</Label>
              <Input
                value={form.whatsappSecondary}
                onChange={(e) => handleChange("whatsappSecondary", e.target.value)}
                inputMode="tel"
                placeholder="84999290088"
                className="bg-black/50 border-white/10 text-white h-11 text-xs sm:text-sm rounded-lg"
              />
              <p className="text-[11px] text-gray-500 truncate">
                Exibido como{" "}
                <span className="text-gray-400">{formatPhoneDisplay(form.whatsappSecondary)}</span>{" "}
                (todos os links usam o WhatsApp Principal)
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">E-mail de Contato</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="contato@cmveiculos.com.br"
                className="bg-black/50 border-white/10 text-white h-11 text-xs sm:text-sm rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Cidade / Estado</Label>
              <Input
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="Natal/RN"
                className="bg-black/50 border-white/10 text-white h-11 text-xs sm:text-sm rounded-lg"
              />
            </div>
            <div className="space-y-1.5 col-span-full">
              <Label className="text-xs text-gray-300">Endereço</Label>
              <Input
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Av. das Fronteiras, 1417"
                className="bg-black/50 border-white/10 text-white h-11 text-xs sm:text-sm rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Horário — Dias Úteis</Label>
              <Input
                value={form.hoursWeekdays}
                onChange={(e) => handleChange("hoursWeekdays", e.target.value)}
                placeholder="Seg - Sex: 08h às 18h"
                className="bg-black/50 border-white/10 text-white h-11 text-xs sm:text-sm rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Horário — Sábado</Label>
              <Input
                value={form.hoursSaturday}
                onChange={(e) => handleChange("hoursSaturday", e.target.value)}
                placeholder="Sáb: 08h às 13h"
                className="bg-black/50 border-white/10 text-white h-11 text-xs sm:text-sm rounded-lg"
              />
            </div>
          </div>

          <div className="pt-1 flex justify-end">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-brand-gradient hover:opacity-95 text-white font-semibold text-xs sm:text-sm h-10 gap-2 px-5 rounded-lg shadow-sm shadow-[#E8231F]/20"
            >
              <Store className="w-4 h-4" />
              <span>{isSaving ? "Salvando..." : "Salvar Dados"}</span>
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}

function AdminSettingsPage() {
  const { openMobileMenu } = useAdminLayout();
  const user = getCurrentUser();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("A confirmação de senha não confere com a nova senha.");
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await updateAdminPassword(currentPassword, newPassword);
      if (res.success) {
        toast.success("Senha administrativa alterada com sucesso!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res.error || "Não foi possível alterar a senha.");
      }
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Configurações e Segurança"
        description="Gerencie os dados públicos do site e as credenciais de acesso"
        onOpenMobileMenu={openMobileMenu}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl w-full mx-auto">
        {/* Account Info */}
        <Card className="bg-[#121212] border-white/5 rounded-2xl shadow-md">
          <CardHeader className="pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8231F]/15 text-[#E8231F]">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-white">
                  Perfil do Administrador
                </CardTitle>
                <CardDescription className="text-xs text-gray-400">
                  Dados do usuário logado no painel
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-400">Nome Completo</Label>
                <Input
                  value={user?.name || "Administrador C&M"}
                  disabled
                  className="bg-black/50 border-white/10 text-white h-11 text-xs sm:text-sm cursor-not-allowed opacity-80"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-400">E-mail de Acesso</Label>
                <Input
                  value={user?.email || "admin@cmveiculos.com.br"}
                  disabled
                  className="bg-black/50 border-white/10 text-white h-11 text-xs sm:text-sm cursor-not-allowed opacity-80"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password Form */}
        <Card className="bg-[#121212] border-white/5 rounded-2xl shadow-md">
          <CardHeader className="pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8231F]/15 text-[#E8231F]">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-white">
                  Alterar Senha de Acesso
                </CardTitle>
                <CardDescription className="text-xs text-gray-400">
                  Atualize a senha de acesso ao painel administrativo
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <form onSubmit={handlePasswordChange}>
            <CardContent className="pt-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">Senha Atual *</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="bg-black/50 border-white/10 pl-10 text-white h-11 text-xs sm:text-sm rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-300">Nova Senha (mínimo 6 dígitos) *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      className="bg-black/50 border-white/10 pl-10 text-white h-11 text-xs sm:text-sm rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-300">Confirmar Nova Senha *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="bg-black/50 border-white/10 pl-10 text-white h-11 text-xs sm:text-sm rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={isChangingPass}
                  className="bg-brand-gradient hover:opacity-95 text-white font-semibold text-xs sm:text-sm h-10 gap-2 px-5 rounded-lg shadow-sm shadow-[#E8231F]/20"
                >
                  <Save className="w-4 h-4" />
                  <span>{isChangingPass ? "Salvando..." : "Salvar Nova Senha"}</span>
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>

        {/* Store Information */}
        <StoreInformationCard />

        {/* Danger Zone - Reset Data */}
        <Card className="bg-[#121212] border-red-500/20 rounded-2xl shadow-md">
          <CardHeader className="pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15 text-red-500">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-white">Zona de Perigo</CardTitle>
                <CardDescription className="text-xs text-gray-400">
                  Ações irreversíveis para testes e desenvolvimento
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-xs text-red-400 font-semibold mb-2">⚠️ Ação Irreversível</p>
              <p className="text-xs text-gray-300">
                Isso vai apagar <strong>TODAS as vendas finalizadas</strong>, transações financeiras
                associadas (entradas, saídas, comissões) e voltar os veículos para status
                "disponível".
                <strong>Não é possível desfazer.</strong>
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setResetDialogOpen(true)}
              disabled={isResetting}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs h-10 gap-2 px-5 rounded-lg w-full sm:w-auto"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isResetting ? "Apagando..." : "Zerar Todas as Vendas"}</span>
            </Button>
          </CardContent>
        </Card>

        <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
          <AlertDialogContent className="bg-[#121212] border border-white/10 text-white max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                Confirmar Exclusão Total
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-gray-400 leading-relaxed">
                Tem certeza que deseja apagar <strong>TODAS as vendas</strong>?
                <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                  <li>Todas as vendas finalizadas serão removidas</li>
                  <li>
                    Transações financeiras (entradas, comissões, financiamentos) serão apagadas
                  </li>
                  <li>Veículos vendidos voltarão ao status "Disponível"</li>
                  <li>
                    Vendedores e suas comissões <strong>NÃO</strong> serão afetados
                  </li>
                </ul>
                Esta ação <strong className="text-red-400">não pode ser desfeita</strong>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel
                onClick={() => setResetDialogOpen(false)}
                className="border-white/10 hover:bg-white/5 text-gray-300 text-xs flex-1"
              >
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  setIsResetting(true);
                  try {
                    const count = await resetAllSales(user?.id);
                    toast.success(`${count} venda(s) removida(s) com sucesso!`);
                    setResetDialogOpen(false);
                  } catch (err) {
                    console.error(err);
                    toast.error("Erro ao zerar vendas");
                  } finally {
                    setIsResetting(false);
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex-1"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Sim, Apagar Tudo
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
