import { Link, useMatchRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MessageCircle, ShieldCheck } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 lg:h-18">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-gradient font-bold text-white text-base shadow-sm">
            CM
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-base font-bold tracking-tight text-white sm:text-lg">
              C&M Veículos
            </span>
            <span className="text-[11px] font-medium text-[#E8231F] tracking-wide">
              Confiança que move você
            </span>
          </div>
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
          <a href="/#financiamento" className="text-sm font-medium transition-colors hover:text-white text-gray-300">Financiamento</a>
          <a href="/#sobre" className="text-sm font-medium transition-colors hover:text-white text-gray-300">Sobre</a>
          <a href="/#localizacao" className="text-sm font-medium transition-colors hover:text-white text-gray-300">Localização</a>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/login" title="Acesso Administrativo" className="hidden sm:inline-flex">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </Button>
          </Link>

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
