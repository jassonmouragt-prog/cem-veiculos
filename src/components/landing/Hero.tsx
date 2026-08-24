import { CheckCircle2, ShieldCheck, Tag } from "lucide-react";
import bannerHero from "@/assets/banner-hero.png.asset.json";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-black pt-24 lg:pt-28">
      {/* Banner background — full image visible on desktop (no cropping) */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat lg:bg-contain lg:bg-right-top"
        style={{ backgroundImage: `url(${bannerHero.url})` }}
        aria-hidden="true"
      >
        {/* Left-side darkening overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
        {/* Bottom fade — applied to the image only */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-16 lg:py-24">
        <div className="flex max-w-2xl flex-col gap-4 lg:gap-5">
          <h1 className="text-2xl font-extrabold text-white leading-[1.2] tracking-tight sm:text-3xl lg:text-4xl xl:text-[42px]">
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
      </div>

    </section>
  );
}
