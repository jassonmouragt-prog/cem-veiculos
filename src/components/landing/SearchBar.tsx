import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";

export function SearchBar() {
  return (
    <div className="container relative z-20 mx-auto -mt-6 px-4 lg:-mt-8">
      <div className="rounded-2xl border border-white/10 bg-[#121212]/95 backdrop-blur-md p-4 shadow-xl sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 items-end">
          <div className="lg:col-span-2 space-y-1.5">
            <label className="text-xs font-medium text-gray-400">Modelo ou Marca</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input 
                placeholder="Ex: Toyota Corolla, Honda Civic..." 
                className="bg-black/50 border-white/10 pl-10 h-11 text-sm text-white placeholder:text-gray-500 rounded-lg focus-visible:ring-[#E8231F]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400">Preço Máximo</label>
            <Select defaultValue="indiferente">
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
            <Select defaultValue="indiferente">
              <SelectTrigger className="bg-black/50 border-white/10 h-11 text-sm text-white rounded-lg focus:ring-[#E8231F]">
                <SelectValue placeholder="Indiferente" />
              </SelectTrigger>
              <SelectContent className="bg-[#121212] border-white/10 text-white">
                <SelectItem value="indiferente">Indiferente</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400">Categoria</label>
            <Select defaultValue="todas">
              <SelectTrigger className="bg-black/50 border-white/10 h-11 text-sm text-white rounded-lg focus:ring-[#E8231F]">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent className="bg-[#121212] border-white/10 text-white">
                <SelectItem value="todas">Todas as categorias</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="hatch">Hatch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="bg-brand-gradient hover:opacity-95 h-11 text-white font-semibold text-sm gap-2 w-full rounded-lg shadow-sm shadow-[#E8231F]/20">
            <Search className="w-4 h-4" />
            Buscar veículos
          </Button>
        </div>
        
        <div className="flex justify-end mt-3">
          <button className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filtros avançados
          </button>
        </div>
      </div>
    </div>
  );
}
