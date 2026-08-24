import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Clock } from "lucide-react";

export function Location() {
  return (
    <section className="bg-[#0a0a0a] py-14 lg:py-20">
      <div className="container mx-auto grid items-center gap-10 px-4 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-6">
          <span className="text-[#E8231F] font-bold uppercase tracking-widest text-sm">VISITE NOSSA LOJA</span>
          <h2 className="max-w-xl text-3xl font-black text-white uppercase leading-tight sm:text-4xl lg:text-5xl">AV. DAS FRONTEIRAS, 1417</h2>
          <p className="text-base text-gray-400 sm:text-lg">Condições especiais, atendimento consultivo e os melhores veículos da região.</p>
          
          <div className="flex items-center gap-3 text-gray-400">
            <Clock className="w-5 h-5 text-[#E8231F]" />
            <div>
              <p>Segunda a Sexta: 08h às 18h</p>
              <p>Sábado: 08h às 13h</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:gap-4 sm:pt-4">
            <Button className="gap-2 bg-[#E8231F] hover:bg-[#E8231F]/90">
              <Phone className="w-4 h-4" /> Fale no WhatsApp
            </Button>
            <Button variant="outline" className="border-white/10 hover:bg-white/5 gap-2">
              <MapPin className="w-4 h-4" /> Como chegar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl overflow-hidden aspect-square">
            <img src="https://images.unsplash.com/photo-1555664424-778a195e1a48?auto=format&fit=crop&q=80&w=600" alt="Fachada" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden aspect-square relative bg-[#121212] flex items-center justify-center p-6 text-center">
            <div className="space-y-4">
              <div className="h-12 w-12 bg-[#E8231F] rounded-full mx-auto flex items-center justify-center text-white font-bold">M</div>
              <h3 className="font-bold text-white">C&M Veículos</h3>
              <p className="text-xs text-gray-500">Av. das Fronteiras, 1417 — Fronteiras - Teresina/PI</p>
              <Button variant="link" className="text-[#E8231F] text-xs font-bold p-0">Ver no Google Maps</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
