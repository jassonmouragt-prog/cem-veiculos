import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getCurrentUser, updateAdminPassword } from "@/lib/auth/auth-service";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminLayout } from "@/components/admin/AdminLayoutContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, KeyRound, UserCheck, Store, Save, Lock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/configuracoes")({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const { openMobileMenu } = useAdminLayout();
  const user = getCurrentUser();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPass, setIsChangingPass] = useState(false);

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
        description="Gerencie os dados da conta administrativa e credenciais de acesso"
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
                  Informações públicas exibidas no site
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5 space-y-3 text-xs text-gray-300 leading-relaxed">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-white">Razão Social:</p>
                <p className="text-gray-400">C&M Veículos Ltda.</p>
              </div>
              <div>
                <p className="font-semibold text-white">WhatsApp Principal:</p>
                <p className="text-gray-400">(86) 9 9914-8872</p>
              </div>
              <div>
                <p className="font-semibold text-white">Endereço:</p>
                <p className="text-gray-400">Av. das Fronteiras, 1417 — Teresina/PI</p>
              </div>
              <div>
                <p className="font-semibold text-white">Horário de Atendimento:</p>
                <p className="text-gray-400">Seg - Sex: 08h às 18h | Sáb: 08h às 13h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
