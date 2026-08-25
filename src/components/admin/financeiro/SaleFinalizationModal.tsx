import { useState } from "react";
import { Vehicle } from "@/lib/db/types";
import { Seller } from "@/lib/db/types";
import {
  finalizeSale,
  getVehiclesFromStorage,
  getExpensesByVehicle,
  formatCurrency,
} from "@/lib/db/store";
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
import { DollarSign, User, CreditCard, AlertCircle, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";

interface SaleFinalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: { id: string; name: string; price: number; acquisitionCost?: number } | null;
  sellers: Seller[];
  onFinalize: () => void;
}

export function SaleFinalizationModal({
  isOpen,
  onClose,
  vehicle,
  sellers,
  onFinalize,
}: SaleFinalizationModalProps) {
  const [finalPrice, setFinalPrice] = useState(vehicle?.price || 0);
  const [hadNegotiation, setHadNegotiation] = useState(false);
  const [sellerId, setSellerId] = useState("");
  const [commissionRate, setCommissionRate] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState<
    "a_vista" | "financiamento" | "entrada_financiamento"
  >("a_vista");
  const [downPayment, setDownPayment] = useState(0);
  const [financedAmount, setFinancedAmount] = useState(0);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const discountAmount = (vehicle?.price || 0) - finalPrice;
  const discountPercent = vehicle?.price ? (discountAmount / vehicle.price) * 100 : 0;
  const commissionValue = (finalPrice * commissionRate) / 100;
  const acquisitionCost = vehicle?.acquisitionCost || 0;
  const expenses = vehicle ? getExpensesByVehicle(vehicle.id) : [];
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const grossMargin = finalPrice - acquisitionCost - totalExpenses;
  const netMargin = grossMargin - commissionValue;

  const handlePaymentMethodChange = (
    method: "a_vista" | "financiamento" | "entrada_financiamento",
  ) => {
    setPaymentMethod(method);
    if (method === "a_vista") {
      setDownPayment(finalPrice);
      setFinancedAmount(0);
    } else if (method === "financiamento") {
      setDownPayment(0);
      setFinancedAmount(finalPrice);
    } else if (method === "entrada_financiamento") {
      setDownPayment(Math.round(finalPrice * 0.3));
      setFinancedAmount(finalPrice - Math.round(finalPrice * 0.3));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vehicle) {
      toast.error("Veículo não selecionado");
      return;
    }
    if (!sellerId) {
      toast.error("Selecione o vendedor responsável");
      return;
    }
    if (finalPrice <= 0) {
      toast.error("Informe o valor da venda");
      return;
    }
    if (paymentMethod === "entrada_financiamento" && (downPayment <= 0 || financedAmount <= 0)) {
      toast.error("Informe entrada e valor financiado");
      return;
    }

    setIsSubmitting(true);
    try {
      await finalizeSale({
        vehicleId: vehicle.id,
        finalPrice,
        hadNegotiation,
        sellerId,
        commissionRate,
        paymentMethod,
        downPayment,
        financedAmount,
        notes: notes.trim() || undefined,
      });

      toast.success("Venda finalizada com sucesso!");
      onFinalize();
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Erro ao finalizar venda");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!vehicle) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#121212] border border-white/10 text-white max-w-3xl p-6 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E8231F] uppercase tracking-wider">
            <DollarSign className="w-4 h-4" />
            <span>Finalizar Venda</span>
          </div>
          <DialogTitle className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {vehicle.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-400">
            Preço anunciado: <strong className="text-white">{formatCurrency(vehicle.price)}</strong>
            {vehicle.acquisitionCost && (
              <>
                {" "}
                • Custo aquisição:{" "}
                <strong className="text-white">{formatCurrency(vehicle.acquisitionCost)}</strong>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Valor da Venda */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">Preço Anunciado</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    type="number"
                    value={vehicle.price}
                    readOnly
                    className="bg-black/50 border-white/10 pl-10 text-white h-10 text-xs sm:text-sm rounded-lg cursor-not-allowed opacity-60"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">Valor Efetivamente Vendido *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    type="number"
                    placeholder="Ex: 115000"
                    value={finalPrice}
                    onChange={(e) => setFinalPrice(Number(e.target.value) || 0)}
                    required
                    className="bg-black/50 border-white/10 pl-10 text-white h-10 text-xs sm:text-sm rounded-lg focus-visible:ring-[#E8231F] text-lg font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Desconto */}
            {hadNegotiation && discountAmount !== 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <div className="space-y-1.5">
                  <Label className="text-xs text-amber-400">Desconto Concedido</Label>
                  <p className="text-lg font-bold text-amber-400">
                    {formatCurrency(discountAmount)}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-amber-400">Percentual de Desconto</Label>
                  <p className="text-lg font-bold text-amber-400">{discountPercent.toFixed(2)}%</p>
                </div>
              </div>
            )}

            {/* Negociação */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <Label className="text-xs text-gray-300">Houve negociação no valor da venda?</Label>
              <RadioGroup
                value={hadNegotiation ? "sim" : "nao"}
                onValueChange={(v) => setHadNegotiation(v === "sim")}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="nao" id="nao" />
                  <Label htmlFor="nao" className="text-xs text-gray-300 cursor-pointer">
                    Não
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="sim" id="sim" />
                  <Label htmlFor="sim" className="text-xs text-gray-300 cursor-pointer">
                    Sim
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Vendedor e Comissão */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Vendedor Responsável *</Label>
              <Select value={sellerId} onValueChange={setSellerId}>
                <SelectTrigger className="bg-black/50 border-white/10 text-white h-10 text-xs sm:text-sm rounded-lg">
                  <SelectValue placeholder="Selecione o vendedor" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white text-xs">
                  {sellers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.commissionRate}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Comissão do Vendedor (%) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value) || 0)}
                  className="bg-black/50 border-white/10 pl-10 text-white h-10 text-xs sm:text-sm rounded-lg"
                />
              </div>
              <p className="text-[11px] text-gray-400">
                Valor da comissão: <strong>{formatCurrency(commissionValue)}</strong>
              </p>
            </div>
          </div>

          {/* Forma de Pagamento */}
          <div className="pt-4 border-t border-white/5 space-y-4">
            <Label className="text-xs text-gray-300 font-semibold block">
              Forma de Pagamento *
            </Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={handlePaymentMethodChange}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center gap-2 p-3 bg-black/30 border border-white/5 rounded-lg cursor-pointer">
                <RadioGroupItem value="a_vista" id="a_vista" />
                <Label htmlFor="a_vista" className="text-xs text-gray-300 cursor-pointer">
                  À Vista
                </Label>
              </div>
              <div className="flex items-center gap-2 p-3 bg-black/30 border border-white/5 rounded-lg cursor-pointer">
                <RadioGroupItem value="financiamento" id="financiamento" />
                <Label htmlFor="financiamento" className="text-xs text-gray-300 cursor-pointer">
                  Financiamento Total
                </Label>
              </div>
              <div className="flex items-center gap-2 p-3 bg-black/30 border border-white/5 rounded-lg cursor-pointer">
                <RadioGroupItem value="entrada_financiamento" id="entrada_financiamento" />
                <Label
                  htmlFor="entrada_financiamento"
                  className="text-xs text-gray-300 cursor-pointer"
                >
                  Entrada + Financiamento
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === "entrada_financiamento" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-300">Entrada (R$) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      type="number"
                      min="0"
                      max={finalPrice}
                      value={downPayment}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        setDownPayment(val);
                        setFinancedAmount(Math.max(0, finalPrice - val));
                      }}
                      className="bg-black/50 border-white/10 pl-10 text-white h-10 text-xs sm:text-sm rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-300">Valor Financiado (R$) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      type="number"
                      min="0"
                      max={finalPrice}
                      value={financedAmount}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        setFinancedAmount(val);
                        setDownPayment(Math.max(0, finalPrice - val));
                      }}
                      className="bg-black/50 border-white/10 pl-10 text-white h-10 text-xs sm:text-sm rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "financiamento" && (
              <p className="text-xs text-gray-400">
                Valor total será registrado como conta a receber
              </p>
            )}
          </div>

          {/* Resumo Financeiro */}
          <div className="pt-4 border-t border-white/5 bg-black/30 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Resumo da Rentabilidade
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-2 bg-black/50 rounded-lg">
                <p className="text-gray-400">Custo Aquisição</p>
                <p className="font-bold text-white">{formatCurrency(acquisitionCost)}</p>
              </div>
              <div className="p-2 bg-black/50 rounded-lg">
                <p className="text-gray-400">Despesas Veículo</p>
                <p className="font-bold text-white">{formatCurrency(totalExpenses)}</p>
              </div>
              <div className="p-2 bg-black/50 rounded-lg">
                <p className="text-gray-400">Custo Total</p>
                <p className="font-bold text-white">
                  {formatCurrency(acquisitionCost + totalExpenses)}
                </p>
              </div>
              <div className="p-2 bg-black/50 rounded-lg">
                <p className="text-gray-400">Margem Bruta</p>
                <p className="font-bold text-emerald-400">{formatCurrency(grossMargin)}</p>
              </div>
              <div className="p-2 bg-black/50 rounded-lg">
                <p className="text-gray-400">Comissão</p>
                <p className="font-bold text-[#E8231F]">{formatCurrency(commissionValue)}</p>
              </div>
              <div className="p-2 bg-black/50 rounded-lg">
                <p className="text-gray-400">Margem Líquida</p>
                <p className="font-bold text-emerald-400">{formatCurrency(netMargin)}</p>
              </div>
              <div className="p-2 bg-black/50 rounded-lg">
                <p className="text-gray-400">Margem %</p>
                <p className="font-bold text-blue-400">
                  {finalPrice > 0 ? ((netMargin / finalPrice) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <div className="p-2 bg-black/50 rounded-lg">
                <p className="text-gray-400">Entrada / Financiado</p>
                <p className="font-bold text-white">
                  {formatCurrency(downPayment)} / {formatCurrency(financedAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300">Observações</Label>
            <Textarea
              placeholder="Observações sobre a venda, condições especiais, etc."
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
              className="bg-brand-gradient hover:opacity-95 text-white font-semibold text-xs sm:text-sm h-10 gap-2 px-5 rounded-lg shadow-md shadow-[#E8231F]/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? "Finalizando..." : "Confirmar Venda"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
