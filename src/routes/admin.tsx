import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { isAuthenticated, subscribeToAuth } from "@/lib/auth/auth-service";
import { migrateLegacyLocalData, enableRealtime } from "@/lib/db/store";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export const Route = createFileRoute("/admin")({
  head: () => ({
    title: "Painel Administrativo | C&M Veículos",
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminLayout,
});

import { AdminLayoutContext } from "@/components/admin/AdminLayoutContext";

function AdminLayout() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [migrationDone, setMigrationDone] = useState(false);
  const authCheckRef = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (authCheckRef.current) return;
      authCheckRef.current = true;

      // Timeout de 5s para evitar travamento na verificação de auth
      const authPromise = isAuthenticated();
      const timeoutPromise = new Promise<boolean>((resolve) =>
        setTimeout(() => resolve(false), 5000),
      );
      const auth = await Promise.race([authPromise, timeoutPromise]);
      setIsAuth(auth);
      if (!auth) {
        navigate({ to: "/login" });
      } else {
        // Conecta o painel ao tempo real (novos leads, edições em outras abas etc.)
        enableRealtime();

        if (!migrationDone) {
          // Run legacy data migration once after successful auth
          try {
            await migrateLegacyLocalData();
          } catch (err) {
            console.error("Erro na migração de dados legados:", err);
          }
          setMigrationDone(true);
        }
      }
      authCheckRef.current = false;
    };

    checkAuth();
    const unsubscribe = subscribeToAuth(checkAuth);
    return () => unsubscribe();
  }, [navigate]);

  if (isAuth === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-[#E8231F] border-t-transparent animate-spin" />
          <span className="text-xs text-gray-400">Verificando credenciais...</span>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return null;
  }

  return (
    <AdminLayoutContext.Provider value={{ openMobileMenu: () => setMobileMenuOpen(true) }}>
      <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row antialiased selection:bg-[#E8231F] selection:text-white">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:sticky lg:top-0 lg:h-screen shrink-0">
          <AdminSidebar />
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-10 w-72 h-full shadow-2xl">
              <AdminSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 flex flex-col min-h-screen bg-[#0a0a0a]">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </div>
    </AdminLayoutContext.Provider>
  );
}
