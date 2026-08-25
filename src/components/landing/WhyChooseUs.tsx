import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, ShieldCheck, Car, Banknote, Users } from "lucide-react";

export function WhyChooseUs() {
  const benefits = [
    {
      icon: Award,
      title: "+30 Anos de Mercado",
      desc: "Tradição, solidez e experiência que geram máxima confiança.",
    },
    {
      icon: ShieldCheck,
      title: "Procedência Garantida",
      desc: "Laudos cautelares e histórico veicular 100% transparente.",
    },
    {
      icon: Car,
      title: "Veículos Revisados",
      desc: "Todos os automóveis passam por rigorosa inspeção técnica.",
    },
    {
      icon: Banknote,
      title: "Financiamento Ágil",
      desc: "Parcerias estratégicas com os principais bancos e taxas exclusivas.",
    },
    {
      icon: Users,
      title: "Atendimento Consultivo",
      desc: "Suporte especializado para você fazer a melhor escolha.",
    },
  ];

  return (
    <section id="sobre" className="bg-black py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <Badge
            variant="secondary"
            className="bg-[#E8231F]/10 border border-[#E8231F]/20 text-[#E8231F] font-semibold text-xs mb-2 rounded-full py-0.5 px-3"
          >
            DIFERENCIAIS EXCLUSIVOS
          </Badge>
          <h2 className="text-xl font-bold text-white tracking-tight sm:text-2xl lg:text-3xl">
            Por que escolher a <span className="text-brand-gradient">C&M Veículos</span>?
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            Mais de 30 anos de história conectando você aos melhores veículos com total segurança.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {benefits.map((b, i) => (
            <Card
              key={i}
              className="border-white/5 bg-[#121212] p-5 flex flex-col items-center text-center gap-3 rounded-xl hover:border-[#E8231F]/30 transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8231F]/10 text-[#E8231F]">
                <b.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-sm tracking-tight">{b.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{b.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
