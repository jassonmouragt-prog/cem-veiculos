import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

export function Testimonials() {
  const reviews = [
    { name: "Rafael Santos", text: "Excelente atendimento do início ao fim. Transparência, veículo impecável e total respeito com o cliente. Recomendo demais!", photo: "https://i.pravatar.cc/150?u=rafael" },
    { name: "Juliana Oliveira", text: "Comprei meu Corolla aqui e foi a melhor experiência. Carro de procedência comprovada e equipe atenciosa e nota 10!", photo: "https://i.pravatar.cc/150?u=juliana" },
    { name: "Marcos Lima", text: "Loja extremamente séria e confiável. Todo o processo de avaliação e financiamento foi rápido e sem burocracia.", photo: "https://i.pravatar.cc/150?u=marcos" },
  ];

  return (
    <section className="bg-black py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <Badge variant="secondary" className="bg-[#E8231F]/10 border border-[#E8231F]/20 text-[#E8231F] font-semibold text-xs mb-2 rounded-full py-0.5 px-3">
            QUEM COMPRA, CONFIA E RECOMENDA
          </Badge>
          <h2 className="text-xl font-bold text-white tracking-tight sm:text-2xl lg:text-3xl">
            O que dizem os nossos clientes
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            Avaliações reais de clientes que já conquistaram o carro novo com a C&M.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-4 lg:gap-6">
          <Card className="flex flex-col items-center justify-center border-white/5 bg-[#121212] p-6 text-center rounded-2xl">
            <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" className="h-6 mb-4 brightness-0 invert opacity-90" />
            <div className="mb-1 text-4xl font-extrabold text-white sm:text-5xl">4,9</div>
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />)}
            </div>
            <p className="text-xs text-gray-400">Baseado em +730 avaliações no Google</p>
          </Card>

          <div className="grid gap-4 md:grid-cols-3 lg:col-span-3">
            {reviews.map((r, i) => (
              <Card key={i} className="relative border-white/5 bg-[#121212] p-5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-all">
                <Quote className="absolute top-5 right-5 w-6 h-6 text-[#E8231F] opacity-20" />
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic mb-5 relative z-10">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={r.photo} alt={r.name} className="w-10 h-10 rounded-full border-2 border-[#E8231F]/40" />
                  <div>
                    <h4 className="font-semibold text-white text-xs sm:text-sm">{r.name}</h4>
                    <p className="text-[11px] text-gray-400">Cliente C&M Veículos</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
