import { FinancialTransaction, formatCurrency } from "@/lib/db/store";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit3, Trash2, CreditCard, Calendar, AlertTriangle } from "lucide-react";

function formatDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  } catch {
    return isoDate;
  }
}

interface FinancialTableProps {
  transactions: FinancialTransaction[];
  title: string;
  type: "entrada" | "saida";
  showDueDate?: boolean;
  showStatus?: boolean;
}

export function FinancialTable({
  transactions,
  title,
  type,
  showDueDate,
  showStatus,
}: FinancialTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [categoryFilter, setCategoryFilter] = useState<string>("todas");

  const filtered = transactions.filter((t) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.vehicle?.name && t.vehicle.name.toLowerCase().includes(q)) ||
        (t.seller?.name && t.seller.name.toLowerCase().includes(q)) ||
        (t.supplier && t.supplier.toLowerCase().includes(q)) ||
        (t.client && t.client.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (statusFilter !== "todos" && t.status !== statusFilter) return false;
    if (categoryFilter !== "todas" && t.category !== categoryFilter) return false;
    return true;
  });

  const categories = [...new Set(transactions.map((t) => t.category))].sort();

  const statusColors = {
    pago: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    pendente: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    atrasado: "bg-red-500/15 text-red-400 border-red-500/30",
    cancelado: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Buscar por descrição, veículo, vendedor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#121212] border-white/10 pl-10 text-white placeholder:text-gray-500 h-10 text-xs sm:text-sm rounded-lg"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 h-9 text-xs bg-black/50 border-white/10 text-white rounded-lg">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/10 text-white text-xs">
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="atrasado">Atrasado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40 h-9 text-xs bg-black/50 border-white/10 text-white rounded-lg">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/10 text-white text-xs">
              <SelectItem value="todas">Todas</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs text-gray-400 uppercase tracking-wider">
              <th className="pb-3 pr-4">Descrição</th>
              <th className="pb-3 pr-4">Categoria</th>
              <th className="pb-3 pr-4 text-right">Valor</th>
              <th className="pb-3 pr-4">Data</th>
              {showDueDate && <th className="pb-3 pr-4">Vencimento</th>}
              {showStatus && <th className="pb-3 pr-4">Status</th>}
              <th className="pb-3 pr-4">Veículo / Venda</th>
              <th className="pb-3 pr-4">Vendedor / Forn.</th>
              <th className="pb-3 pr-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-gray-500">
                  Nenhuma transação encontrada
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr key={t.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-4">
                    <div>
                      <p className="font-medium text-white truncate max-w-[200px]">
                        {t.description}
                      </p>
                      {t.notes && (
                        <p className="text-[10px] text-gray-500 truncate max-w-[200px]">
                          {t.notes}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant="outline" className="text-[10px] bg-[#E8231F]/15 text-[#E8231F]">
                      {t.category.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4 text-right font-bold text-white">
                    {type === "entrada" ? "+" : "−"}
                    {formatCurrency(t.amount)}
                  </td>
                  <td className="py-3 pr-4 text-gray-300">{formatDate(t.transactionDate)}</td>
                  {showDueDate && (
                    <td className="py-3 pr-4">
                      {t.dueDate ? (
                        <>
                          <p className="text-gray-300">{formatDate(t.dueDate)}</p>
                          {t.status === "pendente" &&
                            t.dueDate &&
                            new Date(t.dueDate) < new Date() && (
                              <p className="text-[10px] text-red-400 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Atrasado
                              </p>
                            )}
                        </>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                  )}
                  {showStatus && (
                    <td className="py-3 pr-4">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${statusColors[t.status as keyof typeof statusColors] || "bg-gray-500/15 text-gray-400"}`}
                      >
                        {t.status}
                      </Badge>
                    </td>
                  )}
                  <td className="py-3 pr-4 text-gray-400">
                    {t.vehicle?.name || t.saleId ? t.saleId?.slice(0, 8) : "—"}
                  </td>
                  <td className="py-3 pr-4 text-gray-400">
                    {t.seller?.name || t.supplier || t.client || "—"}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 bg-black/60 text-white hover:bg-black rounded-lg"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-[#1a1a1a] border-white/10 text-white text-xs"
                      >
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Edit3 className="w-3.5 h-3.5 text-blue-400" /> Editar
                        </DropdownMenuItem>
                        {t.status === "pendente" && (
                          <>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem className="gap-2 cursor-pointer text-emerald-400">
                              <CreditCard className="w-3.5 h-3.5" /> Marcar Pago
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem className="gap-2 cursor-pointer text-red-400">
                          <Trash2 className="w-3.5 h-3.5" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
          <span>Total: {filtered.length} transações</span>
          <span className="font-bold text-white">
            {type === "entrada" ? "+" : "−"}
            {formatCurrency(filtered.reduce((s, t) => s + t.amount, 0))}
          </span>
        </div>
      )}
    </div>
  );
}
