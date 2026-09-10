import { Link, useMatchRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const LOGO_URL = "/images/logo-cem.webp";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 lg:h-18">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src={LOGO_URL}
            alt="C&M Veículos"
            className="h-10 w-auto shrink-0 object-contain sm:h-11"
          />
          <span className="hidden text-[11px] font-medium tracking-wide text-[#E8231F] sm:block">
            Confiança que move você
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          <Link
            to="/"
            className="text-sm font-medium transition-colors hover:text-white text-gray-300 [&.active]:text-[#E8231F] [&.active]:font-semibold"
          >
            Início
          </Link>
          <Link
            to="/estoque"
            className="text-sm font-medium transition-colors hover:text-white text-gray-300 [&.active]:text-[#E8231F] [&.active]:font-semibold"
          >
            Estoque
          </Link>
          <a
            href="/#financiamento"
            className="text-sm font-medium transition-colors hover:text-white text-gray-300"
          >
            Financiamento
          </a>
          <a
            href="/#sobre"
            className="text-sm font-medium transition-colors hover:text-white text-gray-300"
          >
            Sobre
          </a>
          <a
            href="/#localizacao"
            className="text-sm font-medium transition-colors hover:text-white text-gray-300"
          >
            Localização
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/558699148872?text=Olá!%20Gostaria%20de%20mais%20informações."
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="shrink-0 bg-brand-gradient hover:opacity-95 transition-all text-white font-semibold text-xs sm:text-sm gap-2 px-3 sm:px-4 h-9 sm:h-10 rounded-lg shadow-md shadow-[#E8231F]/15">
              <MessageCircle className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Fale no WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
