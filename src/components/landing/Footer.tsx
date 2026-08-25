import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black pb-8 pt-12 lg:pt-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:mb-12 md:grid-cols-3 lg:grid-cols-5 lg:gap-10">
          <div className="col-span-2 space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 bg-brand-gradient rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">
                CM
              </div>
              <span className="font-bold text-base text-white">C&M Veículos</span>
            </div>
            <p className="text-[11px] text-[#E8231F] uppercase tracking-wider font-medium">
              Confiança que move você
            </p>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
              Há mais de 30 anos conectando pessoas aos melhores veículos com procedência, rigor
              técnico e preço justo.
            </p>
            <div className="flex gap-3 text-gray-400 pt-1">
              <a href="#" className="hover:text-[#E8231F] transition-colors p-1">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-[#E8231F] transition-colors p-1">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-[#E8231F] transition-colors p-1">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navegação */}
          <div>
            <h4 className="font-semibold text-white mb-3.5 text-xs uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/estoque" className="hover:text-white transition-colors">
                  Estoque Completo
                </Link>
              </li>
              <li>
                <a href="/#financiamento" className="hover:text-white transition-colors">
                  Financiamento
                </a>
              </li>
              <li>
                <a href="/#sobre" className="hover:text-white transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="/#localizacao" className="hover:text-white transition-colors">
                  Localização
                </a>
              </li>
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="font-semibold text-white mb-3.5 text-xs uppercase tracking-wider">
              Categorias
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link to="/estoque" className="hover:text-white transition-colors">
                  Todos os veículos
                </Link>
              </li>
              <li>
                <Link to="/estoque" className="hover:text-white transition-colors">
                  SUVs
                </Link>
              </li>
              <li>
                <Link to="/estoque" className="hover:text-white transition-colors">
                  Sedans
                </Link>
              </li>
              <li>
                <Link to="/estoque" className="hover:text-white transition-colors">
                  Hatches
                </Link>
              </li>
              <li>
                <Link to="/estoque" className="hover:text-white transition-colors">
                  Picapes
                </Link>
              </li>
              <li>
                <Link to="/estoque" className="hover:text-white transition-colors">
                  Motos
                </Link>
              </li>
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <h4 className="font-semibold text-white mb-3.5 text-xs uppercase tracking-wider">
              Institucional
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Financiamento
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Garantia
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Dúvidas frequentes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Política de privacidade
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Termos de uso
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold text-white mb-3.5 text-xs uppercase tracking-wider">
              Contato
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <a
                  href="https://wa.me/558699148872"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  (86) 9 9914-8872
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/558699148872"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  (86) 9 9529-0088
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@cmveiculos.com.br"
                  className="hover:text-white transition-colors"
                >
                  contato@cmveiculos.com.br
                </a>
              </li>
              <li className="text-gray-500">Av. das Fronteiras, 1417</li>
            </ul>
          </div>
        </div>

        <div className="text-center pt-6 border-t border-white/5 text-gray-400 text-xs">
          © {new Date().getFullYear()} C&M Veículos. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
