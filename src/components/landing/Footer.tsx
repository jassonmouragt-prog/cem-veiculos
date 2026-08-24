import { Instagram, Facebook, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black pb-8 pt-12 lg:pt-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:mb-12 md:grid-cols-3 lg:grid-cols-5 lg:gap-10">
          <div className="col-span-2 space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 bg-brand-gradient rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">CM</div>
              <span className="font-bold text-base text-white">C&M Veículos</span>
            </div>
            <p className="text-[11px] text-[#E8231F] uppercase tracking-wider font-medium">Confiança que move você</p>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
              Há mais de 30 anos conectando pessoas aos melhores veículos com procedência, rigor técnico e preço justo.
            </p>
            <div className="flex gap-3 text-gray-400 pt-1">
              <a href="#" className="hover:text-[#E8231F] transition-colors p-1"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="hover:text-[#E8231F] transition-colors p-1"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="hover:text-[#E8231F] transition-colors p-1"><Youtube className="w-4 h-4" /></a>
            </div>
          </div>

          {[
            { title: "Navegação", links: ["Início", "Estoque", "Seminovos", "Financiamento", "Avaliação", "Sobre", "Contato"] },
            { title: "Categorias", links: ["Todos os veículos", "Carros", "SUVs", "Picapes", "Motos"] },
            { title: "Institucional", links: ["Financiamento", "Garantia", "Dúvidas frequentes", "Política de privacidade", "Termos de uso"] },
            { title: "Contato", links: ["(86) 9 9914-8872", "(86) 9 9529-0088", "contato@cmveiculos.com.br", "Av. das Fronteiras, 1417"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-white mb-3.5 text-xs uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-center pt-6 border-t border-white/5 text-gray-400 text-xs">
          © {new Date().getFullYear()} C&M Veículos. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
