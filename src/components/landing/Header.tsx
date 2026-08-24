import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 lg:h-18">
        <div className="flex min-w-0 items-center gap-3">
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
        </div>

        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          {[
            "Início",
            "Estoque",
            "Seminovos",
            "Financiamento",
            "Avaliação",
            "Sobre",
            "Contato",
          ].map((item) => (
            <a
              key={item}
              href="#"
              className={`text-sm font-medium transition-colors hover:text-white ${
                item === "Início"
                  ? "text-[#E8231F] font-semibold relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-[#E8231F]"
                  : "text-gray-300"
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

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
    </header>
  );
}
