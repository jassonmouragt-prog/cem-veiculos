import { useState, useEffect } from "react";
import { Vehicle } from "@/lib/db/types";
import { createVehicleExpense, getVehiclesFromStorage } from "@/lib/db/store";
import { formatCurrency } from "@/lib/db/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, Car, Calendar, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const EXPENSE_CATEGORIES = [
  { value: "manutencao", label: "Manutenção" },
  { value: "documentacao", label: "Documentação" },
  { value: "despachante", label: "Despachante" },
  { value: "lavagem", label: "Lavagem" },
  { value: "combustivel", label: "Combustível" },
  { value: "compra_veiculo", label: "Compra de Veículo" },
  { value: "outros", label: "Outros" },
];

const PAYMENT_STATUS = [
  { value: "pendente", label: "Pendente" },
  { value: "pago", label: "Pago" },
  { value: "atrasado", label: "Atrasado" },
  { value: "cancelado", label: "Cancelado" },
];

interface VehicleExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVehicle?: { id: string; name: string; price?: number } | null;
  onSuccess?: () => void;
}

export function VehicleExpenseModal({
  isOpen,
  onClose,
  initialVehicle,
  onSuccess,
}: VehicleExpenseModalProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("manutencao");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentStatus, setPaymentStatus] = useState<
    "pendente" | "pago" | "atrasado" | "cancelado"
  >("pendente");
  const [paidDate, setPaidDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    | "a_vista"
    | "financiamento"
    | "entrada_financiamento"
    | "pix"
    | "transferencia"
    | "cartao"
    | "outro"
  >("a_vista");
  const [vehicleId, setVehicleId] = useState(initialVehicle?.id || "");
  const [supplier, setSupplier] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const vehicles = getVehiclesFromStorage();

  useEffect(() => {
    if (isOpen) {
      setDescription("");
      setAmount(0);
      setCategory("manutencao");
      setExpenseDate(new Date().toISOString().split("T")[0]);
      setPaymentStatus("pendente");
      setPaidDate("");
      setPaymentMethod("a_vista");
      setVehicleId(initialVehicle?.id || "");
      setSupplier("");
      setNotes("");
    }
  }, [isOpen, initialVehicle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vehicleId) {
      toast.error("Selecione um veículo");
      return;
    }
    if (!description.trim()) {
      toast.error("Descrição é obrigatória");
      return;
    }
    if (amount <= 0) {
      toast.error("Valor deve ser maior que zero");
      return;
    }

    setIsSubmitting(true);
    try {
      await createVehicleExpense({
        vehicleId,
        description: description.trim(),
        category,
        amount,
        expenseDate: new Date(expenseDate).toISOString(),
        paymentStatus,
        paidDate: paidDate ? new Date(paidDate).toISOString() : undefined,
        paymentMethod,
        supplier: supplier.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      toast.success("Despesa registrada com sucesso!");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao registrar despesa");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#121212] border border-white/10 text-white max-w-lg p-6 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E8231F] uppercase tracking-wider">
            <Car className="w-4 h-4" />
            <span>Nova Despesa de Veículo</span>
          </div>
          <DialogTitle className="text-lg font-bold text-white tracking-tight">
            Registrar Despesa
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-400">
            Vincule uma despesa a um veículo específico
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300">Veículo *</Label>
            <Select value={vehicleId} onValueChange={setVehicleId}>
              <SelectTrigger className="bg-black/50 border-white/10 text-white h-10 text-xs sm:text-sm rounded-lg">
                <SelectValue placeholder="Selecione o veículo" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/10 text-white text-xs">
                {vehicles.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name} ({formatCurrency(v.price)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300">Descrição *</Label>
            <Input
              placeholder="Ex: Troca de óleo e filtro"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="bg-black/50 border-white/10 text-white h-10 text-xs sm:text-sm rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Valor (R$) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                  required
                  className="bg-black/50 border-white/10 pl-10 text-white h-10 text-xs sm:text-sm rounded-lg text-lg font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Categoria *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-black/50 border-white/10 text-white h-10 text-xs sm:text-sm rounded-lg">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white text-xs">
                  {EXPENSE_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Data da Despesa *</Label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  required
                  className="bg-black/50 border-white/10 pl-10 text-white h-10 text-xs sm:text-sm rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Status do Pagamento</Label>
              <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                <SelectTrigger className="bg-black/50 border-white/10 text-white h-10 text-xs sm:text-sm rounded-lg">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white text-xs">
                  {PAYMENT_STATUS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Data Pagamento</Label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="date"
                  value={paidDate}
                  onChange={(e) => setPaidDate(e.target.value)}
                  className="bg-black/50 border-white/10 pl-10 text-white h-10 text-xs sm:text-sm rounded-lg"
                  disabled={paymentStatus !== "pago"}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Forma de Pagamento</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="bg-black/50 border-white/10 text-white h-10 text-xs sm:text-sm rounded-lg">
                  <SelectValue placeholder="Forma" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white text-xs">
                  <SelectItem value="a_vista">À Vista</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                  <SelectItem value="cartao">Cartão</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300">Fornecedor</Label>
            <Input
              placeholder="Nome do fornecedor (opcional)"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="bg-black/50 border-white/10 text-white h-10 text-xs sm:text-sm rounded-lg"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300">Observações</Label>
            <Textarea
              placeholder="Observações adicionais..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 text-xs sm:text-sm min-h-[70px] rounded-lg"
            />
          </div>

          <DialogFooter className="pt-4 gap-2 border-t border-white/5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-white/10 hover:bg-white/5 text-gray-300 text-xs h-10 px-4 rounded-lg"
            >
              <X className="w-4 h-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-gradient hover:opacity-95 text-white font-semibold text-xs sm:text-sm h-10 gap-2 px-5 rounded-lg shadow-sm shadow-[#E8231F]/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? "Salvando..." : "Registrar Despesa"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
