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
    <section className="bg-black py-14 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:mb-10">
          <div className="min-w-0">
            <Badge variant="secondary" className="bg-[#E8231F]/10 text-[#E8231F] font-bold mb-2">ESCOLHA COM CONFIANÇA</Badge>
            <h2 className="text-2xl font-bold text-white uppercase sm:text-3xl lg:text-4xl">VEÍCULOS EM DESTAQUE</h2>
          </div>
          <a href="#" className="flex shrink-0 items-center gap-1 text-sm font-bold text-[#E8231F] hover:underline sm:text-base">
            <span className="hidden sm:inline">Ver todo estoque</span><span className="sm:hidden">Ver estoque</span> <ArrowRight className="h-4 w-4 shrink-0" />
          </a>
        </div>

        <Tabs defaultValue="todos" className="mb-8 min-w-0 sm:mb-10">
          <div className="overflow-x-auto pb-2">
          <TabsList className="w-max min-w-full border border-white/5 bg-[#121212] p-1">
            {["Todos", "Mais recentes", "Menor preço", "Maior preço", "SUV", "Sedan", "Hatch", "Picape", "Motos"].map((tab) => (
              <TabsTrigger 
                key={tab} 
                value={tab.toLowerCase()} 
                className="shrink-0 px-4 font-bold data-[state=active]:bg-[#E8231F] data-[state=active]:text-white sm:px-6"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          </div>
        </Tabs>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {vehicles.map((v) => (
            <Card key={v.id} className="bg-[#121212] border-white/5 overflow-hidden flex flex-col hover:border-[#E8231F]/50 transition-colors">
              <div className="relative aspect-[4/3]">
                <img src={`https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=400`} alt={v.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white">{v.year}</div>
                <button className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-full text-white hover:text-[#E8231F]">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
              <CardContent className="p-4 flex-1">
                <h3 className="font-bold text-white truncate">{v.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{v.specs}</p>
                <div className="flex gap-4 mb-4">
                  <div className="flex items-center gap-1 text-xs text-gray-400"><Gauge className="w-3 h-3" /> {v.km}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-400"><Fuel className="w-3 h-3" /> {v.fuel}</div>
                </div>
                <div className="text-xl font-black text-brand-gradient mb-1">{v.price}</div>
                <p className="text-xs text-gray-500">Entrada + Parcelas de {v.installment}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 gap-2">
                <Button variant="outline" className="flex-1 border-white/10 hover:bg-white/5">Ver detalhes</Button>
                <Button className="flex-1 bg-brand-gradient hover:opacity-90 transition-opacity font-black uppercase italic">Tenho interesse</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
