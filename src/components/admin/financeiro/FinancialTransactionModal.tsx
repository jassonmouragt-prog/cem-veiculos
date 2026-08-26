import { useState, useEffect } from "react";
import { Vehicle } from "@/lib/db/types";
import {
  createFinancialTransaction,
  getVehiclesFromStorage,
  getActiveSellers,
  getSalesFromStorage,
} from "@/lib/db/store";
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, Car, User, CreditCard, X, CheckCircle2, Calendar } from "lucide-react";
import { toast } from "sonner";

interface FinancialTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "entrada" | "saida";
  onSuccess?: () => void;
  initialVehicle?: { id: string; name: string; price?: number } | null;
}

const ENTRADA_CATEGORIES = [
  { value: "venda_veiculo", label: "Venda de Veículo" },
  { value: "sinal_veiculo", label: "Sinal de Veículo" },
  { value: "recebimento_financiamento", label: "Recebimento Financiamento" },
  { value: "recebimento_parcelado", label: "Recebimento Parcelado" },
  { value: "servicos", label: "Serviços" },
  { value: "outros_recebimentos", label: "Outros Recebimentos" },
];

const SAIDA_CATEGORIES = [
  { value: "compra_veiculo", label: "Compra de Veículo" },
  { value: "comissao", label: "Comissão" },
  { value: "manutencao", label: "Manutenção" },
  { value: "documentacao", label: "Documentação" },
  { value: "despachante", label: "Despachante" },
  { value: "lavagem", label: "Lavagem" },
  { value: "combustivel", label: "Combustível" },
  { value: "marketing", label: "Marketing" },
  { value: "trafego_pago", label: "Tráfego Pago" },
  { value: "aluguel", label: "Aluguel" },
  { value: "energia", label: "Energia" },
  { value: "agua", label: "Água" },
  { value: "internet", label: "Internet" },
  { value: "contabilidade", label: "Contabilidade" },
  { value: "salarios", label: "Salários" },
  { value: "pro_labore", label: "Pró-Labore" },
  { value: "impostos", label: "Impostos" },
  { value: "seguros", label: "Seguros" },
  { value: "fornecedores", label: "Fornecedores" },
  { value: "equipamentos", label: "Equipamentos" },
  { value: "escritorio", label: "Escritório" },
  { value: "outros", label: "Outros" },
];

export function FinancialTransactionModal({
  isOpen,
  onClose,
  type,
  onSuccess,
  initialVehicle,
}: FinancialTransactionModalProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState(type === "entrada" ? "venda_veiculo" : "outros");
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    | "a_vista"
    | "financiamento"
    | "entrada_financiamento"
    | "pix"
    | "transferencia"
    | "cartao"
    | "outro"
  >("a_vista");
  const [status, setStatus] = useState<"pendente" | "pago" | "atrasado" | "cancelado">("pendente");
  const [paidDate, setPaidDate] = useState("");
  const [vehicleId, setVehicleId] = useState(initialVehicle?.id || "");
  const [saleId, setSaleId] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [supplier, setSupplier] = useState("");
  const [client, setClient] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const vehicles = getVehiclesFromStorage();
  const sellers = getActiveSellers();
  const sales = getSalesFromStorage();

  const categories = type === "entrada" ? ENTRADA_CATEGORIES : SAIDA_CATEGORIES;

  useEffect(() => {
    if (isOpen) {
      setDescription("");
      setAmount(0);
      setCategory(type === "entrada" ? "venda_veiculo" : "outros");
      setTransactionDate(new Date().toISOString().split("T")[0]);
      setDueDate("");
      setPaymentMethod("a_vista");
      setStatus("pendente");
      setPaidDate("");
      setVehicleId(initialVehicle?.id || "");
      setSaleId("");
      setSellerId("");
      setSupplier("");
      setClient("");
      setNotes("");
    }
  }, [isOpen, initialVehicle, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      await createFinancialTransaction({
        type,
        category,
        description: description.trim(),
        amount,
        transactionDate: new Date(transactionDate).toISOString(),
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        paidDate: paidDate ? new Date(paidDate).toISOString() : undefined,
        paymentMethod,
        status,
        vehicleId: vehicleId || undefined,
        saleId: saleId || undefined,
        sellerId: sellerId || undefined,
        supplier: supplier.trim() || undefined,
        client: client.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      toast.success(`${type === "entrada" ? "Entrada" : "Saída"} registrada com sucesso!`);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao registrar transação");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#121212] border border-white/10 text-white max-w-2xl p-6 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E8231F] uppercase tracking-wider">
            <DollarSign className="w-4 h-4" />
            <span>Nova {type === "entrada" ? "Entrada" : "Saída"}</span>
          </div>
          <DialogTitle className="text-lg font-bold text-white tracking-tight">
            Registrar {type === "entrada" ? "Entrada Financeira" : "Saída Financeira"}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-400">
            Preencha os dados da transação
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300">Descrição *</Label>
            <Input
              placeholder="Ex: Venda do veículo Honda Civic 2022"
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
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white text-xs">
                  {categories.map((c) => (
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
              <Label className="text-xs text-gray-300">Data da Transação *</Label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="date"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  required
                  className="bg-black/50 border-white/10 pl-10 text-white h-10 text-xs sm:text-sm rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Data de Vencimento</Label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-black/50 border-white/10 pl-10 text-white h-10 text-xs sm:text-sm rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300">Forma de Pagamento</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="flex flex-wrap gap-3"
            >
              {[
                "a_vista",
                "financiamento",
                "entrada_financiamento",
                "pix",
                "transferencia",
                "cartao",
                "outro",
              ].map((method) => (
                <div
                  key={method}
                  className="flex items-center gap-2 p-2 bg-black/30 border border-white/5 rounded-lg cursor-pointer"
                >
                  <RadioGroupItem value={method} id={method} />
                  <Label
                    htmlFor={method}
                    className="text-xs text-gray-300 cursor-pointer capitalize"
                  >
                    {method.replace("_", " ")}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/5">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-black/50 border-white/10 text-white h-10 text-xs sm:text-sm rounded-lg">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white text-xs">
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="atrasado">Atrasado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Data Pagamento</Label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="date"
                  value={paidDate}
                  onChange={(e) => setPaidDate(e.target.value)}
                  className="bg-black/50 border-white/10 pl-10 text-white h-10 text-xs sm:text-sm rounded-lg"
                  disabled={status !== "pago"}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 space-y-3">
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Vinculações (Opcionais)
            </h4>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Veículo</Label>
              <Select value={vehicleId} onValueChange={setVehicleId}>
                <SelectTrigger className="bg-black/50 border-white/10 text-white h-10 text-xs sm:text-sm rounded-lg">
                  <SelectValue placeholder="Selecione um veículo (opcional)" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white text-xs">
                  <SelectItem value="">Nenhum</SelectItem>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name} ({formatCurrency(v.price)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Venda</Label>
              <Select value={saleId} onValueChange={setSaleId}>
                <SelectTrigger className="bg-black/50 border-white/10 text-white h-10 text-xs sm:text-sm rounded-lg">
                  <SelectValue placeholder="Selecione uma venda (opcional)" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white text-xs">
                  <SelectItem value="">Nenhuma</SelectItem>
                  {sales
                    .filter((s) => s.status === "concluida")
                    .map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.vehicle?.name || s.vehicleId.slice(0, 8)} -{" "}
                        {formatCurrency(s.finalPrice)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Vendedor</Label>
              <Select value={sellerId} onValueChange={setSellerId}>
                <SelectTrigger className="bg-black/50 border-white/10 text-white h-10 text-xs sm:text-sm rounded-lg">
                  <SelectValue placeholder="Selecione um vendedor (opcional)" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white text-xs">
                  <SelectItem value="">Nenhum</SelectItem>
                  {sellers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.commissionRate}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Fornecedor / Cliente</Label>
              <Input
                placeholder="Nome do fornecedor ou cliente"
                value={type === "saida" ? supplier : client}
                onChange={(e) =>
                  type === "saida" ? setSupplier(e.target.value) : setClient(e.target.value)
                }
                className="bg-black/50 border-white/10 text-white h-10 text-xs sm:text-sm rounded-lg"
              />
            </div>
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
              <span>
                {isSubmitting
                  ? "Salvando..."
                  : `Registrar ${type === "entrada" ? "Entrada" : "Saída"}`}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
