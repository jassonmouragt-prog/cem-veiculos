import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Fuel, Gauge, ArrowRight } from "lucide-react";

const vehicles = [
  { id: 1, name: "Honda HR-V EXL", year: "2021", specs: "1.8 Flex 16V Aut.", km: "68.500 km", fuel: "Flex", transmission: "Automático", price: "R$ 104.900", installment: "R$ 1.899" },
  { id: 2, name: "Toyota Corolla XEi", year: "2020", specs: "2.0 Flex 16V Aut.", km: "72.300 km", fuel: "Flex", transmission: "Automático", price: "R$ 112.900", installment: "R$ 2.049" },
  { id: 3, name: "Jeep Compass Limited", year: "2019", specs: "2.0 4x2 Flex Aut.", km: "81.900 km", fuel: "Flex", transmission: "Automático", price: "R$ 119.900", installment: "R$ 2.169" },
  { id: 4, name: "VW Polo Highline", year: "2022", specs: "1.0 200 TSI Flex Aut.", km: "36.200 km", fuel: "Flex", transmission: "Automático", price: "R$ 88.900", installment: "R$ 1.169" },
  { id: 5, name: "Yamaha MT-03", year: "2023", specs: "321cc ABS", km: "9.800 km", fuel: "Gasolina", transmission: "Manual", price: "R$ 26.900", installment: "R$ 499" },
];

export function FeaturedVehicles() {
  return (
    <section className="bg-black py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:mb-8">
          <div className="min-w-0">
            <Badge variant="secondary" className="bg-[#E8231F]/10 border border-[#E8231F]/20 text-[#E8231F] font-semibold text-xs mb-2 rounded-full py-0.5 px-3">
              ESCOLHA COM CONFIANÇA
            </Badge>
            <h2 className="text-xl font-bold text-white tracking-tight sm:text-2xl lg:text-3xl">
              Veículos em Destaque
            </h2>
          </div>
          <a href="#" className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[#E8231F] hover:text-[#ff5956] transition-colors sm:text-sm">
            <span className="hidden sm:inline">Ver todo o estoque</span>
            <span className="sm:hidden">Ver estoque</span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </a>
        </div>

        <Tabs defaultValue="todos" className="mb-6 min-w-0 sm:mb-8">
          <div className="overflow-x-auto pb-2">
            <TabsList className="w-max min-w-full border border-white/5 bg-[#121212] p-1 rounded-xl">
              {["Todos", "Mais recentes", "Menor preço", "Maior preço", "SUV", "Sedan", "Hatch", "Picape", "Motos"].map((tab) => (
                <TabsTrigger 
                  key={tab} 
                  value={tab.toLowerCase()} 
                  className="shrink-0 px-3.5 py-1.5 text-xs font-medium rounded-lg data-[state=active]:bg-[#E8231F] data-[state=active]:text-white sm:px-5"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {vehicles.map((v) => (
            <Card key={v.id} className="bg-[#121212] border-white/5 overflow-hidden flex flex-col hover:border-[#E8231F]/40 transition-all rounded-xl shadow-md">
              <div className="relative aspect-[4/3]">
                <img src={`https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=400`} alt={v.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-semibold text-white">
                  {v.year}
                </div>
                <button className="absolute top-2 right-2 p-1.5 bg-black/70 backdrop-blur-md rounded-full text-white hover:text-[#E8231F] transition-colors">
                  <Heart className="w-3.5 h-3.5" />
                </button>
              </div>
              <CardContent className="p-4 flex-1">
                <h3 className="font-bold text-white text-base truncate mb-0.5">{v.name}</h3>
                <p className="text-xs text-gray-400 mb-3">{v.specs}</p>
                <div className="flex gap-3 mb-3 text-xs text-gray-400">
                  <div className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5 text-gray-500" /> {v.km}</div>
                  <div className="flex items-center gap-1"><Fuel className="w-3.5 h-3.5 text-gray-500" /> {v.fuel}</div>
                </div>
                <div className="text-lg font-bold text-brand-gradient mb-0.5">{v.price}</div>
                <p className="text-[11px] text-gray-400">Entrada + Parcelas de {v.installment}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 gap-2">
                <Button variant="outline" className="flex-1 h-9 text-xs font-semibold border-white/10 hover:bg-white/5 rounded-lg">
                  Detalhes
                </Button>
                <Button className="flex-1 h-9 text-xs font-semibold bg-brand-gradient hover:opacity-95 text-white rounded-lg shadow-sm shadow-[#E8231F]/15">
                  Interesse
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
