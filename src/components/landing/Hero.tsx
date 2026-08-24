import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ShieldCheck, Tag } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-black pb-16 pt-24 lg:pb-20 lg:pt-32">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#E8231F]/10 blur-[120px] rounded-full -z-10" />

      <div className="container mx-auto grid items-center gap-10 px-4 lg:grid-cols-2 lg:gap-12">
        <div className="flex min-w-0 flex-col gap-5 lg:gap-6">
          <Badge variant="outline" className="w-fit border-[#E8231F] text-[#E8231F] font-bold py-1 px-4">
            +30 ANOS DE HISTÓRIA
          </Badge>
          
          <h1 className="max-w-3xl text-3xl font-black text-white leading-tight uppercase tracking-normal italic sm:text-4xl lg:text-5xl xl:text-6xl">
            ENCONTRE SEU PRÓXIMO CARRO COM <span className="text-brand-gradient">PROCEDÊNCIA</span> E <span className="text-brand-gradient">SOFISTICAÇÃO</span>.
          </h1>
          
          <p className="max-w-lg text-base text-gray-400 sm:text-lg">
            Veículos selecionados, revisados e com garantia para você dirigir com segurança e tranquilidade.
          </p>

          <div className="grid grid-cols-1 gap-4 pt-3 sm:grid-cols-3 sm:gap-5 lg:pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8231F]/20">
                <ShieldCheck className="w-5 h-5 text-[#E8231F]" />
              </div>
              <span className="text-xs font-bold text-white uppercase leading-tight">PROCEDÊNCIA GARANTIDA</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8231F]/20">
                <CheckCircle2 className="w-5 h-5 text-[#E8231F]" />
              </div>
              <span className="text-xs font-bold text-white uppercase leading-tight">REVISADOS E CERTIFICADOS</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8231F]/20">
                <Tag className="w-5 h-5 text-[#E8231F]" />
              </div>
              <span className="text-xs font-bold text-white uppercase leading-tight">PREÇO JUSTO E TRANSPARENTE</span>
            </div>
          </div>
        </div>

        <div className="relative min-w-0">
          <div className="relative z-10 aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl shadow-[#E8231F]/20 lg:rounded-3xl">
            <img 
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200" 
              alt="C&M Veículos Showroom" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
             <div className="pointer-events-none absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-4 opacity-20 sm:px-8">
                <h2 className="text-center text-3xl font-black text-white/50 uppercase tracking-normal italic leading-none sm:text-4xl xl:text-5xl">
                 C&M VEÍCULOS
               </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
