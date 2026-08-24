import { Card } from "@/components/ui/card";
import { Award, ShieldAlert, Car, Banknote, Users } from "lucide-react";

export function WhyChooseUs() {
  const benefits = [
    { icon: Award, title: "+30 ANOS DE MERCADO", desc: "Tradição e experiência que geram confiança" },
    { icon: ShieldAlert, title: "PROCEDÊNCIA GARANTIDA", desc: "Laudos cautelares e histórico completo do veículo" },
    { icon: Car, title: "VEÍCULOS REVISADOS", desc: "Todos os carros passam por inspeção rigorosa" },
    { icon: Banknote, title: "FINANCIAMENTO FACILITADO", desc: "Parcerias com os principais bancos do mercado" },
    { icon: Users, title: "ATENDIMENTO CONSULTIVO", desc: "Suporte especializado para a melhor decisão de compra" },
  ];

  return (
    <section className="bg-black py-14 lg:py-20">
      <div className="container mx-auto px-4">
        <Card className="border-white/5 bg-[#121212] p-6 sm:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-6 lg:gap-10">
            <h2 className="text-2xl font-black text-white uppercase leading-tight sm:text-3xl lg:col-span-1">
              POR QUE ESCOLHER A <span className="text-brand-gradient">C&M VEÍCULOS?</span>
            </h2>
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-3 lg:col-span-5 lg:grid-cols-5">
              {benefits.map((b, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8231F]/10 mb-2">
                    <b.icon className="w-7 h-7 text-[#E8231F]" />
                  </div>
                  <h3 className="font-bold text-white text-sm uppercase">{b.title}</h3>
                  <p className="text-xs text-gray-500 leading-snug">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
