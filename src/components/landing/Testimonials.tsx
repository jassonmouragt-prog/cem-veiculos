import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

export function Testimonials() {
  const reviews = [
    { name: "Rafael Santos", text: "Excelente atendimento do início ao fim. Transparência e respeito com o cliente. Recomendo!", photo: "https://i.pravatar.cc/150?u=rafael" },
    { name: "Juliana Oliveira", text: "Comprei meu Corolla aqui e foi a melhor experiência. Carro de procedência e equipe nota 10!", photo: "https://i.pravatar.cc/150?u=juliana" },
    { name: "Marcos Lima", text: "Loja séria e confiável. Todo o processo de financiamento foi rápido e sem burocracia.", photo: "https://i.pravatar.cc/150?u=marcos" },
  ];

  return (
    <section className="bg-black py-14 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8 sm:mb-12">
          <span className="text-[#E8231F] font-bold uppercase tracking-widest text-sm mb-2 block text-center">QUEM COMPRA, CONFIA E RECOMENDA</span>
          <p className="text-gray-400 text-center">Avaliações reais de clientes que já realizaram o sonho do carro novo.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4 lg:gap-8">
          <Card className="flex flex-col items-center justify-center border-white/5 bg-[#121212] p-6 text-center sm:p-8">
            <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" className="h-8 mb-6 brightness-0 invert" />
            <div className="mb-2 text-4xl font-black text-white sm:text-5xl lg:text-6xl">4,9</div>
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />)}
            </div>
            <p className="text-sm text-gray-500">Baseado em 736 avaliações</p>
          </Card>

          <div className="grid gap-6 md:grid-cols-3 lg:col-span-3">
            {reviews.map((r, i) => (
              <Card key={i} className="relative border-white/5 bg-[#121212] p-6 sm:p-8">
                <Quote className="absolute top-6 right-6 w-8 h-8 text-[#E8231F] opacity-20" />
                <p className="text-gray-300 italic mb-8 relative z-10">"{r.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={r.photo} alt={r.name} className="w-12 h-12 rounded-full border-2 border-[#E8231F]" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{r.name}</h4>
                    <p className="text-[10px] text-gray-500 uppercase">Cliente C&M Veículos</p>
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
