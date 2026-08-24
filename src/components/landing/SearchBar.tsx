import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

export function SearchBar() {
  return (
    <div className="container relative z-20 mx-auto -mt-8 px-4 lg:-mt-10">
      <div className="rounded-2xl border border-white/5 bg-[#121212] p-4 shadow-2xl sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          <div className="lg:col-span-2 space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Modelo ou Marca</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input 
                placeholder="Ex: Toyota Corolla, Honda Civic..." 
                className="bg-black/50 border-white/10 pl-10 h-12 text-white placeholder:text-gray-600 focus-visible:ring-[#E8231F]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Preço</label>
            <Select defaultValue="indiferente">
              <SelectTrigger className="bg-black/50 border-white/10 h-12 text-white focus:ring-[#E8231F]">
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

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Ano</label>
            <Select defaultValue="indiferente">
              <SelectTrigger className="bg-black/50 border-white/10 h-12 text-white focus:ring-[#E8231F]">
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

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Categoria</label>
            <Select defaultValue="todas">
              <SelectTrigger className="bg-black/50 border-white/10 h-12 text-white focus:ring-[#E8231F]">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent className="bg-[#121212] border-white/10 text-white">
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="hatch">Hatch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="bg-[#E8231F] hover:bg-[#E8231F]/90 h-12 text-white font-bold gap-2 w-full">
            <Search className="w-4 h-4" />
            Buscar veículos
          </Button>
        </div>
        
        <div className="flex justify-end mt-4">
          <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
            <Filter className="w-3 h-3" />
            Busca avançada
          </button>
        </div>
      </div>
    </div>
  );
}
