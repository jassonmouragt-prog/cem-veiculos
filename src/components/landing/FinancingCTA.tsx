import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calculator } from "lucide-react";

export function FinancingCTA() {
  return (
    <section id="financiamento" className="bg-black py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <Card className="bg-[#121212] border-white/5 overflow-hidden flex flex-col md:flex-row rounded-2xl shadow-xl">
          <div className="relative min-h-[240px] md:min-h-[300px] md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1550345332-09a3af9c702f?auto=format&fit=crop&q=80&w=800" 
              alt="Financiamento C&M Veículos" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-center bg-gradient-to-t from-black/90 via-black/60 to-black/30 p-6 sm:p-8 lg:p-10">
              <span className="text-[#E8231F] font-semibold tracking-wider text-xs uppercase mb-1.5">REALIZE SEU SONHO</span>
              <h2 className="mb-2 text-xl font-bold text-white tracking-tight sm:text-2xl lg:text-3xl">
                Simule seu Financiamento
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 max-w-sm">
                Condições personalizadas e taxas competitivas para você sair de carro novo ainda hoje.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col justify-center bg-[#0d0d0d] p-6 sm:p-8 md:w-1/2 lg:p-10">
            <div className="mb-5 sm:mb-6">
              <h3 className="mb-2 text-lg font-bold text-white sm:text-xl">
                Atendimento Rápido e Consultivo
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Nossos consultores calculam na hora as melhores condições para o seu perfil junto aos maiores bancos parceiros. O processo é 100% online, ágil e seguro.
              </p>
            </div>
            
            <a 
              href="https://wa.me/558699148872?text=Olá!%20Gostaria%20de%20simular%20um%20financiamento%20com%20a%20C&M%20Veículos."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button className="h-11 sm:h-12 w-full gap-2 bg-brand-gradient hover:opacity-95 text-white font-semibold text-sm sm:text-base rounded-xl shadow-md shadow-[#E8231F]/15 transition-all">
                <Calculator className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                <span>Falar com um Consultor</span>
              </Button>
            </a>
            <p className="text-[11px] text-gray-400 mt-4 text-center">
              *Aprovação sujeita à análise de crédito. Trabalhamos com as principais instituições financeiras.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
