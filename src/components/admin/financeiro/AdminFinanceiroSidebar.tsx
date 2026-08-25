import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ArrowDownLeft,
  ArrowUpRight,
  Users,
  DollarSign,
  Truck,
  X,
} from "lucide-react";

interface AdminFinanceiroSidebarProps {
  onOpenMobileMenu?: () => void;
}

export function AdminFinanceiroSidebar({ onOpenMobileMenu }: AdminFinanceiroSidebarProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin/financeiro",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: "Entradas",
      href: "/admin/financeiro/entradas",
      icon: ArrowDownLeft,
      exact: false,
    },
    {
      title: "Saídas",
      href: "/admin/financeiro/saidas",
      icon: ArrowUpRight,
      exact: false,
    },
    {
      title: "Vendas",
      href: "/admin/financeiro/vendas",
      icon: DollarSign,
      exact: false,
    },
    {
      title: "Comissões",
      href: "/admin/financeiro/comissoes",
      icon: Users,
      exact: false,
    },
    {
      title: "Despesas",
      href: "/admin/financeiro/despesas",
      icon: Truck,
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
