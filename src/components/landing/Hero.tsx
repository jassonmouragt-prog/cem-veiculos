import { CheckCircle2, ShieldCheck, Tag } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-black pb-14 pt-24 lg:pb-16 lg:pt-28">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#E8231F]/10 blur-[130px] rounded-full -z-10" />

      <div className="container mx-auto grid items-center gap-8 px-4 lg:grid-cols-2 lg:gap-12">
        <div className="flex min-w-0 flex-col gap-4 lg:gap-5">
          <h1 className="max-w-2xl text-2xl font-extrabold text-white leading-[1.2] tracking-tight sm:text-3xl lg:text-4xl xl:text-[42px]">
            Encontre seu próximo carro com <span className="text-brand-gradient">procedência</span> e <span className="text-brand-gradient">sofisticação</span>.
          </h1>
          
          <p className="max-w-lg text-sm sm:text-base text-gray-300 leading-relaxed">
            Veículos selecionados, rigorosamente revisados e com garantia para você dirigir com máxima segurança e tranquilidade.
          </p>

          <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3 sm:gap-4 lg:pt-3">
            {[
              { Icon: ShieldCheck, label: "Procedência Garantida" },
              { Icon: CheckCircle2, label: "Revisados e Certificados" },
              { Icon: Tag, label: "Preço Justo e Claro" },
            ].map(({ Icon, label }) => (
              <button
                key={label}
                type="button"
                className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3.5 py-2.5 text-left backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.03] hover:border-[#E8231F]/30 hover:bg-[#E8231F]/5 hover:shadow-md hover:shadow-[#E8231F]/10 active:scale-[0.99] active:translate-y-0"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E8231F]/15 transition-all duration-200 group-hover:bg-[#E8231F]/25">
                  <Icon className="h-[18px] w-[18px] text-[#E8231F] transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-[-8deg]" />
                </div>
                <span className="text-xs font-semibold text-gray-200 leading-tight transition-colors duration-200 group-hover:text-white">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative min-w-0">
          <div className="relative z-10 aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-xl shadow-[#E8231F]/10 lg:rounded-3xl border border-white/5">
            <img 
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200" 
              alt="C&M Veículos Showroom" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="pointer-events-none absolute bottom-4 left-4 right-4 text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#E8231F]">Showroom Exclusivo</span>
              <h2 className="text-base font-bold text-white sm:text-lg">
                Qualidade e Procedência em Cada Detalhe
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
