import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

interface SearchBarProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  category?: string;
  onCategoryChange?: (val: string) => void;
  price?: string;
  onPriceChange?: (val: string) => void;
  year?: string;
  onYearChange?: (val: string) => void;
  onReset?: () => void;
}

export function SearchBar({
  searchQuery = "",
  onSearchChange,
  category = "todas",
  onCategoryChange,
  price = "indiferente",
  onPriceChange,
  year = "indiferente",
  onYearChange,
  onReset,
}: SearchBarProps) {
  const handleScrollToStock = () => {
    const el = document.getElementById("estoque");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="container relative z-20 mx-auto -mt-6 px-4 lg:-mt-8">
      <div className="rounded-2xl border border-white/10 bg-[#121212]/95 backdrop-blur-md p-4 shadow-xl sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 items-end">
          <div className="lg:col-span-2 space-y-1.5">
            <label className="text-xs font-medium text-gray-400">Modelo ou Marca</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input 
                placeholder="Ex: Corolla, HR-V, Compass..." 
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="bg-black/50 border-white/10 pl-10 h-11 text-sm text-white placeholder:text-gray-500 rounded-lg focus-visible:ring-[#E8231F]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400">Preço Máximo</label>
            <Select value={price} onValueChange={(value) => onPriceChange?.(value)}>
              <SelectTrigger className="bg-black/50 border-white/10 h-11 text-sm text-white rounded-lg focus:ring-[#E8231F]">
                <SelectValue placeholder="Indiferente" />
              </SelectTrigger>
              <SelectContent className="bg-[#121212] border-white/10 text-white">
                <SelectItem value="indiferente">Indiferente</SelectItem>
                <SelectItem value="50k">Até R$ 50.000</SelectItem>
                <SelectItem value="100k">Até R$ 100.000</SelectItem>
                <SelectItem value="150k">Até R$ 150.000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400">Ano</label>
            <Select value={year} onValueChange={(value) => onYearChange?.(value)}>
              <SelectTrigger className="bg-black/50 border-white/10 h-11 text-sm text-white rounded-lg focus:ring-[#E8231F]">
                <SelectValue placeholder="Indiferente" />
              </SelectTrigger>
              <SelectContent className="bg-[#121212] border-white/10 text-white">
                <SelectItem value="indiferente">Indiferente</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
                <SelectItem value="2019">2019</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400">Categoria</label>
            <Select value={category} onValueChange={(value) => onCategoryChange?.(value)}>
              <SelectTrigger className="bg-black/50 border-white/10 h-11 text-sm text-white rounded-lg focus:ring-[#E8231F]">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent className="bg-[#121212] border-white/10 text-white">
                <SelectItem value="todas">Todas as categorias</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="hatch">Hatch</SelectItem>
                <SelectItem value="picape">Picape</SelectItem>
                <SelectItem value="moto">Moto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleScrollToStock}
            className="bg-brand-gradient hover:opacity-95 h-11 text-white font-semibold text-sm gap-2 w-full rounded-lg shadow-sm shadow-[#E8231F]/20 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            Buscar veículos
          </Button>
        </div>
        
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5">
          <span className="text-[11px] text-gray-500 hidden sm:inline">
            Filtre por marca, modelo, faixa de preço ou categoria desejada
          </span>
          {onReset && (searchQuery || category !== "todas" || price !== "indiferente" || year !== "indiferente") ? (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-xs text-[#E8231F] hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              Limpar filtros
            </button>
          ) : (
            <span className="text-[11px] text-gray-400 sm:ml-auto">
              Estoque atualizado em tempo real
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
