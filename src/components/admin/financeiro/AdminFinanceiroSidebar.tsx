import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ArrowDownLeft,
  ArrowUpRight,
  Users,
  CreditCard,
  FileText,
  BarChart3,
  Settings,
  DollarSign,
  Receipt,
  Truck,
  X,
} from "lucide-react";
import { getFinancialDashboardStats, subscribeToStore, isStoreLoaded } from "@/lib/db/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface AdminFinanceiroSidebarProps {
  onOpenMobileMenu?: () => void;
}

export function AdminFinanceiroSidebar({ onOpenMobileMenu }: AdminFinanceiroSidebarProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [stats, setStats] = useState(() => {
    if (isStoreLoaded()) {
      return getFinancialDashboardStats();
    }
    return {
      totalPayable: 0,
      totalToReceive: 0,
      totalSalesCount: 0,
      totalCommissionsPending: 0,
    } as ReturnType<typeof getFinancialDashboardStats>;
  });

  useEffect(() => {
    if (!isStoreLoaded()) return;
    const unsubscribe = subscribeToStore(() => {
      setStats(getFinancialDashboardStats());
    });
    setStats(getFinancialDashboardStats());
    return () => unsubscribe();
  }, []);

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin/financeiro",
      icon: LayoutDashboard,
      badge: null,
      exact: true,
    },
    {
      title: "Entradas",
      href: "/admin/financeiro/entradas",
      icon: ArrowDownLeft,
      badge: null,
      exact: false,
    },
    {
      title: "Saídas",
      href: "/admin/financeiro/saidas",
      icon: ArrowUpRight,
      badge: null,
      exact: false,
    },
    {
      title: "Contas a Pagar",
      href: "/admin/financeiro/contas-a-pagar",
      icon: CreditCard,
      badge: stats.totalPayable > 0 ? formatCurrency(stats.totalPayable) : null,
      exact: false,
    },
    {
      title: "Contas a Receber",
      href: "/admin/financeiro/contas-a-receber",
      icon: Receipt,
      badge: stats.totalToReceive > 0 ? formatCurrency(stats.totalToReceive) : null,
      exact: false,
    },
    {
      title: "Vendas",
      href: "/admin/financeiro/vendas",
      icon: DollarSign,
      badge: stats.totalSalesCount > 0 ? String(stats.totalSalesCount) : null,
      exact: false,
    },
    {
      title: "Comissões",
      href: "/admin/financeiro/comissoes",
      icon: Users,
      badge:
        stats.totalCommissionsPending > 0 ? formatCurrency(stats.totalCommissionsPending) : null,
      exact: false,
    },
    {
      title: "Despesas",
      href: "/admin/financeiro/despesas",
      icon: Truck,
      badge: null,
      exact: false,
    },
    {
      title: "Relatórios",
      href: "/admin/financeiro/relatorios",
      icon: FileText,
      badge: null,
      exact: false,
    },
    {
      title: "Gráficos",
      href: "/admin/financeiro/graficos",
      icon: BarChart3,
      badge: null,
      exact: false,
    },
    {
      title: "Configurações",
      href: "/admin/financeiro/configuracoes",
      icon: Settings,
      badge: null,
      exact: false,
    },
  ];

  return (
    <aside className="flex flex-col h-full bg-[#0e0e0e] border-r border-white/5 w-64 text-white select-none shrink-0">
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
              Financeiro
            </span>
          </div>
        </Link>
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-1.5 text-gray-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
          Financeiro
        </p>
        {navItems.map((item) => {
          const isActive = item.exact
            ? currentPath === item.href
            : currentPath.startsWith(item.href);

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onOpenMobileMenu}
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
            Voltar
          </p>
          <Link
            to="/admin"
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4 text-[#E8231F]" />
              <span>Dashboard Geral</span>
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}
