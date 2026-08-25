import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { login, isAuthenticated } from "@/lib/auth/auth-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Lock, Mail, ArrowRight, ShieldCheck, Home } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    title: "Acesso Administrativo | C&M Veículos",
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authPromise = isAuthenticated();
      const timeoutPromise = new Promise<boolean>((resolve) =>
        setTimeout(() => resolve(false), 5000)
      );
      if (await Promise.race([authPromise, timeoutPromise])) {
        navigate({ to: "/admin" });
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        toast.success("Login realizado com sucesso! Redirecionando...");
        setTimeout(() => {
          navigate({ to: "/admin" });
        }, 300);
      } else {
        toast.error(res.error || "E-mail ou senha incorretos.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Ocorreu um erro ao tentar entrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center px-4 relative overflow-hidden selection:bg-[#E8231F] selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-[#E8231F]/10 blur-[140px] rounded-full -z-10" />

      {/* Top shortcut to public website */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors"
        >
          <Home className="w-4 h-4 text-[#E8231F]" />
          <span>Voltar ao site público</span>
        </Link>
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient font-black text-white text-xl shadow-lg shadow-[#E8231F]/25 mb-1">
            CM
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">C&M Veículos</h1>
          <p className="text-xs text-gray-400">Acesso restrito ao Painel Administrativo</p>
        </div>

        <Card className="bg-[#121212] border-white/10 shadow-2xl rounded-2xl">
          <CardHeader className="pb-3 pt-6 px-6 sm:px-8 text-center border-b border-white/5">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#E8231F] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Área Protegida</span>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6 px-6 sm:px-8">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs text-gray-300">
                  E-mail do Administrador
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@cmveiculos.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-black/50 border-white/10 pl-10 text-white placeholder:text-gray-600 h-11 text-xs sm:text-sm rounded-lg focus-visible:ring-[#E8231F]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs text-gray-300">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-black/50 border-white/10 pl-10 text-white placeholder:text-gray-600 h-11 text-xs sm:text-sm rounded-lg focus-visible:ring-[#E8231F]"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pb-6 px-6 sm:px-8">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-gradient hover:opacity-95 text-white font-semibold text-sm h-11 gap-2 rounded-lg shadow-md shadow-[#E8231F]/20"
              >
                {isLoading ? (
                  <span>Autenticando...</span>
                ) : (
                  <>
                    <span>Entrar no Painel</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
              <p className="text-[11px] text-gray-400 text-center pt-2">
                O acesso administrativo é restrito aos gestores da loja.
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
