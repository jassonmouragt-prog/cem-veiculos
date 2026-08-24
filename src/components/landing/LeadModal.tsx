import { useState } from "react";
import { Vehicle } from "@/lib/db/types";
import { createLead, formatCurrency } from "@/lib/db/store";
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
import { MessageSquare, Send, Phone, Mail, User, Car } from "lucide-react";
import { toast } from "sonner";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: Vehicle | null;
}

export function LeadModal({ isOpen, onClose, vehicle }: LeadModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [openWhatsApp, setOpenWhatsApp] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Por favor, preencha o seu nome.");
      return;
    }
    if (!phone.trim()) {
      toast.error("Por favor, informe seu número de telefone ou WhatsApp.");
      return;
    }

    setIsSubmitting(true);
    try {
      createLead({
        name: name.trim(),
        phone: phone.trim(),
        ...(email.trim() ? { email: email.trim() } : {}),
        ...(vehicle?.id ? { vehicleId: vehicle.id } : {}),
        ...(vehicle?.name ? { vehicleName: vehicle.name } : {}),
        ...(message.trim() ? { message: message.trim() } : {}),
      });


      toast.success("Mensagem enviada com sucesso! Nossos consultores entrarão em contato.");

      if (openWhatsApp) {
        const text = encodeURIComponent(
          `Olá! Meu nome é ${name.trim()}. Tenho interesse no veículo ${vehicle?.name || "do estoque da C&M Veículos"}.${
            message.trim() ? " Observação: " + message.trim() : ""
          }`
        );
        window.open(`https://wa.me/558699148872?text=${text}`, "_blank");
      }

      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Ocorreu um erro ao enviar sua mensagem. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#121212] border border-white/10 text-white max-w-md p-6 rounded-2xl shadow-2xl">
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E8231F] uppercase tracking-wider">
            <Car className="w-4 h-4" />
            <span>Atendimento Personalizado</span>
          </div>
          <DialogTitle className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {vehicle ? vehicle.name : "Fale com nossos Consultores"}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-400">
            {vehicle ? (
              <span>
                Valor: <strong className="text-white">{formatCurrency(vehicle.price)}</strong> • Ano: {vehicle.modelYear}
              </span>
            ) : (
              "Preencha seus dados para receber uma proposta exclusiva e personalizada."
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300">Seu Nome Completo *</Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Ex: João da Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-black/50 border-white/10 pl-10 text-white placeholder:text-gray-600 h-10 text-xs sm:text-sm rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Telefone / WhatsApp *</Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  placeholder="(86) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="bg-black/50 border-white/10 pl-10 text-white placeholder:text-gray-600 h-10 text-xs sm:text-sm rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">E-mail (Opcional)</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="email"
                  placeholder="joao@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/50 border-white/10 pl-10 text-white placeholder:text-gray-600 h-10 text-xs sm:text-sm rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300">Mensagem ou Proposta (Opcional)</Label>
            <Textarea
              placeholder="Ex: Gostaria de simular financiamento com R$ 20.000 de entrada ou saber mais detalhes..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 text-xs sm:text-sm min-h-[70px] rounded-lg"
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <Checkbox
              id="open-whatsapp"
              checked={openWhatsApp}
              onCheckedChange={(c) => setOpenWhatsApp(Boolean(c))}
            />
            <Label htmlFor="open-whatsapp" className="text-xs text-gray-300 cursor-pointer">
              Abrir WhatsApp imediatamente após enviar
            </Label>
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-white/10 hover:bg-white/5 text-gray-300 text-xs h-10 px-4 rounded-lg"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-gradient hover:opacity-95 text-white font-semibold text-xs sm:text-sm h-10 gap-2 px-5 rounded-lg shadow-md shadow-[#E8231F]/20"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "Enviando..." : "Enviar Mensagem"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
