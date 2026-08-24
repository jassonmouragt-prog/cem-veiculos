import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 lg:h-20 xl:flex xl:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient font-black text-white text-lg italic lg:h-10 lg:w-10 lg:text-xl">
            M
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-base font-bold leading-none tracking-tight text-white uppercase sm:text-xl">
              C&M Veículos
            </span>
            <span className="text-[10px] text-[#E8231F] uppercase tracking-wider font-semibold">
              Confiança que move você
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-5 xl:flex 2xl:gap-8">
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
              className={`text-sm font-medium transition-colors hover:text-[#E8231F] ${
                item === "Início"
                  ? "text-[#E8231F] relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-[#E8231F]"
                  : "text-gray-300"
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        <Button className="shrink-0 bg-brand-gradient hover:opacity-90 transition-opacity text-white font-black uppercase italic gap-2 px-3 sm:px-5">
          <MessageCircle className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Fale no WhatsApp</span>
          <span className="sm:hidden">WhatsApp</span>
        </Button>
      </div>
    </header>
  );
}
