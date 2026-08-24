import { Instagram, Facebook, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black pb-8 pt-14 lg:pt-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:mb-16 md:grid-cols-3 lg:grid-cols-5 lg:gap-12">
          <div className="col-span-2 space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-[#E8231F] rounded-full flex items-center justify-center text-white font-bold text-sm">M</div>
              <span className="font-bold text-lg text-white">C&M Veículos</span>
            </div>
            <p className="text-[10px] text-[#E8231F] uppercase tracking-wider font-semibold">Confiança que move você</p>
            <p className="text-sm text-gray-500 leading-relaxed">Há mais de 30 anos conectando pessoas aos melhores veículos com procedência, qualidade e preço justo.</p>
            <div className="flex gap-4 text-gray-400">
              <Instagram className="w-5 h-5 hover:text-[#E8231F] cursor-pointer" />
              <Facebook className="w-5 h-5 hover:text-[#E8231F] cursor-pointer" />
              <Youtube className="w-5 h-5 hover:text-[#E8231F] cursor-pointer" />
            </div>
          </div>

          {[
            { title: "NAVEGAÇÃO", links: ["Início", "Estoque", "Seminovos", "Financiamento", "Avaliação", "Sobre", "Contato"] },
            { title: "ESTOQUE", links: ["Todos os veículos", "Carros", "SUVs", "Picapes", "Motos"] },
            { title: "AJUDA", links: ["Financiamento", "Garantia", "Perguntas frequentes", "Política de privacidade", "Termos de uso"] },
            { title: "CONTATO", links: ["(86) 9 9914-8872", "(86) 9 9529-0088", "contato@cmveiculos.com.br", "Av. das Fronteiras, 1417"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">{col.title}</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                {col.links.map((link) => <li key={link} className="hover:text-[#E8231F] cursor-pointer transition-colors">{link}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-center pt-8 border-t border-white/5 text-gray-600 text-sm">
          © 2024 C&M Veículos. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
