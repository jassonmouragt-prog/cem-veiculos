import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getDashboardStats, getVehiclesFromStorage, getLeadsFromStorage, subscribeToStore, formatCurrency, formatDate } from "@/lib/db/store";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { MetricCard } from "@/components/admin/MetricCard";
import { useAdminLayout } from "@/components/admin/AdminLayoutContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  CheckCircle2, 
  Clock, 
  Tag, 
  Users, 
  Plus, 
  ArrowUpRight, 
  MessageSquare,
  Sparkles,
  ExternalLink
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { openMobileMenu } = useAdminLayout();
  const [stats, setStats] = useState(getDashboardStats());
  const [recentVehicles, setRecentVehicles] = useState(getVehiclesFromStorage().slice(0, 5));
  const [recentLeads, setRecentLeads] = useState(getLeadsFromStorage().slice(0, 5));

  useEffect(() => {
    const update = () => {
      setStats(getDashboardStats());
      setRecentVehicles(getVehiclesFromStorage().slice(0, 5));
      setRecentLeads(getLeadsFromStorage().slice(0, 5));
    };

    update();
    const unsubscribe = subscribeToStore(update);
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Dashboard Geral"
        description="Visão consolidada em tempo real do estoque e oportunidades de venda"
        onOpenMobileMenu={openMobileMenu}
        actions={
          <div className="flex items-center gap-2">
            <Link to="/admin/veiculos">
              <Button className="bg-brand-gradient hover:opacity-95 text-white font-semibold text-xs sm:text-sm h-9 sm:h-10 gap-1.5 rounded-lg shadow-sm shadow-[#E8231F]/20">
                <Plus className="w-4 h-4" />
                <span>Novo Veículo</span>
              </Button>
            </Link>
          </div>
        }
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* KPI Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard
            title="Total no Estoque"
            value={stats.totalVehicles}
            description="Veículos cadastrados"
            icon={Car}
            badgeColor="blue"
          />
          <MetricCard
            title="Disponíveis"
            value={stats.availableVehicles}
            description="Prontos para venda"
            icon={CheckCircle2}
            badgeColor="green"
          />
          <MetricCard
            title="Reservados"
            value={stats.reservedVehicles}
            description="Negociações em andamento"
            icon={Clock}
            badgeColor="amber"
          />
          <MetricCard
            title="Vendidos"
            value={stats.soldVehicles}
            description="Total histórico"
            icon={Tag}
            badgeColor="gray"
          />
          <MetricCard
            title="Leads no Mês"
            value={stats.monthlyLeads}
            description={`${stats.totalLeads} no histórico`}
            icon={Users}
            badgeColor="red"
          />
        </div>

        {/* Two-Column Grid: Recent Vehicles & Recent Leads */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Vehicles (2 cols) */}
          <Card className="lg:col-span-2 bg-[#121212] border-white/5 shadow-md rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/5">
              <div>
                <CardTitle className="text-base font-bold text-white">Veículos Recentes</CardTitle>
                <p className="text-xs text-gray-400">Últimos veículos cadastrados no showroom</p>
              </div>
              <Link to="/admin/veiculos">
                <Button variant="ghost" size="sm" className="text-xs text-[#E8231F] hover:text-white gap-1">
                  Gerenciar todos <ArrowUpRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-4 divide-y divide-white/5">
              {recentVehicles.length === 0 ? (
                <p className="text-xs text-gray-500 py-6 text-center">Nenhum veículo cadastrado.</p>
              ) : (
                recentVehicles.map((v) => {
                  const statusBadge = {
                    disponivel: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                    reservado: "bg-amber-500/15 text-amber-400 border-amber-500/30",
                    vendido: "bg-zinc-800 text-zinc-400 border-zinc-700",
                  }[v.status];

                  const coverImage = v.images[v.mainImageIndex || 0] || v.images[0];

                  return (
                    <div key={v.id} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-12 w-16 rounded-lg bg-black overflow-hidden shrink-0 border border-white/10">
                          {coverImage ? (
                            <img src={coverImage} alt={v.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600"><Car className="w-5 h-5" /></div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-semibold text-white truncate">{v.name}</span>
                            {v.isFeatured && (
                            <span className="relative group inline-flex" title="Destaque na home">
                              <Sparkles className="w-3 h-3 text-[#E8231F] shrink-0" />
                            </span>
                            )}
                          </div>
                          <span className="text-[11px] text-gray-400 truncate">{v.modelYear} • {v.mileage.toLocaleString()} km</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-xs sm:text-sm font-bold text-white block">{formatCurrency(v.price)}</span>
                          <span className={`inline-block text-[10px] font-medium px-2 py-0.2 rounded-full border capitalize ${statusBadge}`}>
                            {v.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Recent Leads (1 col) */}
          <Card className="bg-[#121212] border-white/5 shadow-md rounded-2xl flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/5">
              <div>
                <CardTitle className="text-base font-bold text-white">Últimos Leads</CardTitle>
                <p className="text-xs text-gray-400">Contatos de clientes interessados</p>
              </div>
              <Link to="/admin/leads">
                <Button variant="ghost" size="sm" className="text-xs text-[#E8231F] hover:text-white gap-1">
                  Ver todos <ArrowUpRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-4 flex-1 divide-y divide-white/5">
              {recentLeads.length === 0 ? (
                <p className="text-xs text-gray-500 py-6 text-center">Nenhum lead recebido ainda.</p>
              ) : (
                recentLeads.map((lead) => (
                  <div key={lead.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-white truncate">{lead.name}</span>
                      <span className="text-[10px] text-gray-400">{formatDate(lead.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-[#E8231F] font-medium truncate">
                        {lead.vehicleName || "Interesse geral"}
                      </span>
                      <a
                        href={`https://wa.me/55${lead.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1 shrink-0"
                      >
                        <MessageSquare className="w-3 h-3 text-emerald-500" />
                        {lead.phone}
                      </a>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
