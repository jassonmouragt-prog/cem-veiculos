import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Car,
  Users,
  Settings,
  ExternalLink,
  LogOut,
  ShieldCheck,
  X,
  DollarSign,
  UserCheck,
} from "lucide-react";
import { logout, getCurrentUser } from "@/lib/auth/auth-service";
import { getDashboardStats } from "@/lib/db/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const user = getCurrentUser();
  const stats = getDashboardStats();

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      badge: null,
      exact: true,
    },
    {
      title: "Veículos",
      href: "/admin/veiculos",
      icon: Car,
      badge: stats.totalVehicles > 0 ? String(stats.totalVehicles) : null,
      exact: false,
    },
    {
      title: "Leads de Clientes",
      href: "/admin/leads",
      icon: Users,
      badge: stats.monthlyLeads > 0 ? String(stats.monthlyLeads) : null,
      badgeColor: "bg-[#E8231F] text-white",
      exact: false,
    },
    {
      title: "Financeiro",
      href: "/admin/financeiro",
      icon: DollarSign,
      badge: null,
      exact: false,
    },
    {
      title: "Vendedores",
      href: "/admin/vendedores",
      icon: UserCheck,
      badge: null,
      exact: false,
    },
    {
      title: "Configurações",
      href: "/admin/configuracoes",
      icon: Settings,
      badge: null,
      exact: false,
    },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <aside className="flex flex-col h-full bg-[#0e0e0e] border-r border-white/5 w-64 text-white select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 h-16">
        <Link to="/admin" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-gradient font-black text-white text-base shadow-md shadow-[#E8231F]/20">
            CM
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-white tracking-tight leading-tight">
              C&M Veículos
            </span>
            <span className="text-[10px] text-[#E8231F] uppercase font-semibold tracking-wider">
              Painel Admin
            </span>
          </div>
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-gray-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
          Menu Principal
        </p>
        {navItems.map((item) => {
          const isActive = item.exact
            ? currentPath === item.href
            : currentPath.startsWith(item.href);

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#E8231F] text-white font-semibold shadow-md shadow-[#E8231F]/25"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-gray-400"}`}
                />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <Badge
                  variant="secondary"
                  className={`text-[10px] h-5 px-1.5 font-bold rounded-full ${
                    item.badgeColor ||
                    (isActive ? "bg-white/20 text-white" : "bg-white/10 text-gray-300")
                  }`}
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-white/5">
          <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
            Atalhos
          </p>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4 text-[#E8231F]" />
              <span>Ver Site Público</span>
            </div>
          </a>
        </div>
      </div>

      {/* User Info & Logout Footer */}
      <div className="p-3 border-t border-white/5 bg-[#0a0a0a]">
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-white font-semibold text-xs border border-white/10">
              <ShieldCheck className="w-4 h-4 text-[#E8231F]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-white truncate">
                {user?.name || "Administrador"}
              </span>
              <span className="text-[10px] text-gray-500 truncate">
                {user?.email || "admin@cmveiculos.com.br"}
              </span>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleLogout}
            className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg shrink-0"
            title="Sair do painel"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
