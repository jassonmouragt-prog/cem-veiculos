import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calculator } from "lucide-react";

export function FinancingCTA() {
  return (
    <section className="bg-black py-14 lg:py-20">
      <div className="container mx-auto px-4">
        <Card className="bg-[#121212] border-white/5 overflow-hidden flex flex-col md:flex-row">
          <div className="relative min-h-[280px] md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1550345332-09a3af9c702f?auto=format&fit=crop&q=80&w=800" 
              alt="Financing" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-center bg-black/60 p-6 sm:p-8 lg:p-10">
              <span className="text-[#E8231F] font-bold uppercase tracking-widest text-sm mb-2">REALIZE SEU SONHO</span>
              <h2 className="mb-4 text-2xl font-black text-white uppercase italic sm:text-3xl lg:text-4xl">SIMULE SEU FINANCIAMENTO</h2>
              <p className="text-gray-400">Condições personalizadas para você sair de carro novo ainda hoje.</p>
            </div>
          </div>
          
          <div className="flex flex-col justify-center bg-[#0a0a0a] p-6 sm:p-8 md:w-1/2 lg:p-10">
            <div className="mb-6 sm:mb-8">
              <h3 className="mb-4 text-xl font-bold text-white sm:text-2xl">Atendimento Personalizado</h3>
              <p className="text-gray-400 leading-relaxed">
                Nossos consultores estão prontos para oferecer as melhores taxas do mercado e um plano que cabe no seu bolso. A simulação é rápida, segura e totalmente online.
              </p>
            </div>
            
            <a 
              href="https://wa.me/558699148872?text=Olá!%20Gostaria%20de%20simular%20um%20financiamento%20com%20a%20C&M%20Veículos."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button className="h-auto min-h-14 w-full gap-2 overflow-hidden bg-brand-gradient px-3 py-3 text-sm font-black uppercase italic transition-opacity hover:opacity-90 sm:gap-3 sm:px-4 sm:text-lg lg:text-xl">
                <Calculator className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
                <span className="min-w-0 whitespace-normal text-center leading-tight">FALAR COM UM CONSULTOR</span>
              </Button>
            </a>
            <p className="text-[10px] text-gray-600 mt-6 text-center">
              *Aprovação imediata sujeita à análise de crédito. Trabalhamos com os principais bancos.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
