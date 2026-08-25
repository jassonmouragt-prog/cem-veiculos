import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  getLeadsFromStorage,
  updateLeadStatus,
  deleteLead,
  subscribeToStore,
  formatDate,
} from "@/lib/db/store";
import { Lead, LeadStatus } from "@/lib/db/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminLayout } from "@/components/admin/AdminLayoutContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Users,
  Search,
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  Car,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/leads")({
  component: AdminLeadsPage,
});

function AdminLeadsPage() {
  const { openMobileMenu } = useAdminLayout();
  const [leads, setLeads] = useState<Lead[]>(getLeadsFromStorage());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  useEffect(() => {
    const update = () => {
      setLeads(getLeadsFromStorage());
    };
    update();
    const unsubscribe = subscribeToStore(update);
    return () => unsubscribe();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    if (statusFilter !== "todos" && lead.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        lead.name.toLowerCase().includes(q) ||
        lead.phone.includes(q) ||
        (lead.email && lead.email.toLowerCase().includes(q)) ||
        (lead.vehicleName && lead.vehicleName.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    await updateLeadStatus(id, status);
    toast.success("Status do lead atualizado.");
  };

  const handleConfirmDelete = async () => {
    if (!leadToDelete) return;
    await deleteLead(leadToDelete.id);
    toast.success("Lead removido com sucesso.");
    setLeadToDelete(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Gerenciamento de Leads"
        description="Acompanhe os clientes interessados e inicie atendimento rapidamente"
        onOpenMobileMenu={openMobileMenu}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Buscar por nome, telefone, veículo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#121212] border-white/10 pl-10 text-white placeholder:text-gray-500 h-10 text-xs sm:text-sm rounded-lg"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { label: "Todos", value: "todos" },
              { label: "Novos", value: "novo" },
              { label: "Em Atendimento", value: "em_atendimento" },
              { label: "Concluídos", value: "concluido" },
              { label: "Descartados", value: "descartado" },
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

        {/* Leads List */}
        {filteredLeads.length === 0 ? (
          <Card className="bg-[#121212] border-white/5 rounded-2xl p-12 text-center">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Nenhum lead encontrado</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Novos contatos feitos pelo site público aparecerão automaticamente aqui em tempo real.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredLeads.map((lead) => {
              const cleanPhone = lead.phone.replace(/\D/g, "");
              const statusMap = {
                novo: {
                  label: "Novo Lead",
                  color: "bg-blue-500/15 text-blue-400 border-blue-500/30",
                },
                em_atendimento: {
                  label: "Em Atendimento",
                  color: "bg-amber-500/15 text-amber-400 border-amber-500/30",
                },
                concluido: {
                  label: "Venda Concluída",
                  color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                },
                descartado: {
                  label: "Descartado",
                  color: "bg-zinc-800 text-zinc-400 border-zinc-700",
                },
              }[lead.status];

              return (
                <Card
                  key={lead.id}
                  className="bg-[#121212] border-white/5 hover:border-white/15 transition-all rounded-xl p-4 sm:p-5 shadow-md"
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    {/* Left: Customer Info */}
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-white text-base">{lead.name}</h3>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${statusMap.color}`}
                        >
                          {statusMap.label}
                        </Badge>
                        <span className="text-[11px] text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(lead.createdAt)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-300">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Phone className="w-3.5 h-3.5 text-[#E8231F]" />
                          {lead.phone}
                        </span>
                        {lead.email && (
                          <span className="flex items-center gap-1.5 text-gray-400">
                            <Mail className="w-3.5 h-3.5 text-gray-500" />
                            {lead.email}
                          </span>
                        )}
                        {lead.vehicleName && (
                          <span className="flex items-center gap-1.5 text-[#E8231F] font-semibold">
                            <Car className="w-3.5 h-3.5" />
                            {lead.vehicleName}
                          </span>
                        )}
                      </div>

                      {lead.message && (
                        <p className="text-xs text-gray-400 bg-black/40 p-2.5 rounded-lg border border-white/5 mt-2 leading-relaxed">
                          "{lead.message}"
                        </p>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto shrink-0 justify-end pt-2 lg:pt-0 border-t border-white/5 lg:border-t-0">
                      <Select
                        value={lead.status}
                        onValueChange={(val) => handleStatusChange(lead.id, val as LeadStatus)}
                      >
                        <SelectTrigger className="w-36 h-9 text-xs bg-black/50 border-white/10 text-white rounded-lg">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a1a] border-white/10 text-white text-xs">
                          <SelectItem value="novo">🔵 Novo Lead</SelectItem>
                          <SelectItem value="em_atendimento">🟡 Em Atendimento</SelectItem>
                          <SelectItem value="concluido">🟢 Concluído</SelectItem>
                          <SelectItem value="descartado">⚪ Descartado</SelectItem>
                        </SelectContent>
                      </Select>

                      <a
                        href={`https://wa.me/55${cleanPhone}?text=Olá%20${encodeURIComponent(lead.name)},%20sou%20da%20C&M%20Veículos!%20Recebi%20seu%20interesse%20no%20${encodeURIComponent(lead.vehicleName || "nosso estoque")}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="sm"
                          className="h-9 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-1.5 rounded-lg shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </Button>
                      </a>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setLeadToDelete(lead)}
                        className="h-9 w-9 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg shrink-0"
                        title="Remover lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Alert Dialog */}
        <AlertDialog
          open={leadToDelete !== null}
          onOpenChange={(open) => !open && setLeadToDelete(null)}
        >
          <AlertDialogContent className="bg-[#121212] border border-white/10 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Remover registro de lead?</AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-gray-400 leading-relaxed">
                Tem certeza que deseja remover o contato de <strong>{leadToDelete?.name}</strong>?
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
                Remover Lead
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
