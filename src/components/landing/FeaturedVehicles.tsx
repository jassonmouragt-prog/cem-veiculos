import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Fuel, Gauge, ArrowRight, Sparkles, MessageSquare } from "lucide-react";
import {
  getPublicVehicles,
  seedVehicles,
  subscribeToStore,
  formatCurrency,
  formatMileage,
} from "@/lib/db/store";
import { Vehicle } from "@/lib/db/types";
import { LeadModal } from "./LeadModal";

interface FeaturedVehiclesProps {
  initialVehicles?: Vehicle[];
  searchQuery?: string;
  categoryFilter?: string;
  maxPriceFilter?: number;
  yearFilter?: number;
}

export function FeaturedVehicles({
  initialVehicles,
  searchQuery,
  categoryFilter,
  maxPriceFilter,
  yearFilter,
}: FeaturedVehiclesProps) {
  const [activeTab, setActiveTab] = useState("todos");
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles ?? getPublicVehicles());
  const [selectedVehicleForLead, setSelectedVehicleForLead] = useState<Vehicle | null>(null);

  useEffect(() => {
    if (initialVehicles) seedVehicles(initialVehicles);
    const update = () => {
      setVehicles(getPublicVehicles());
    };
    update();
    const unsubscribe = subscribeToStore(update, true);
    return () => unsubscribe();
  }, [initialVehicles]);

  // Filter vehicles based on search bar filters and tab
  const displayedVehicles = vehicles.filter((v) => {
    // Tab filter
    if (activeTab === "destaque" && !v.isFeatured) return false;
    if (activeTab === "suv" && v.category !== "suv") return false;
    if (activeTab === "sedan" && v.category !== "sedan") return false;
    if (activeTab === "hatch" && v.category !== "hatch") return false;
    if (activeTab === "picape" && v.category !== "picape") return false;
    if (activeTab === "motos" && v.category !== "moto") return false;

    // External search bar props if provided
    if (categoryFilter && categoryFilter !== "todas" && v.category !== categoryFilter) return false;
    if (maxPriceFilter && v.price > maxPriceFilter) return false;
    if (yearFilter && v.modelYear !== yearFilter) return false;
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        v.name.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.version.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <section id="estoque" className="bg-black py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:mb-8">
          <div className="min-w-0">
            <Badge
              variant="secondary"
              className="bg-[#E8231F]/10 border border-[#E8231F]/20 text-[#E8231F] font-semibold text-xs mb-2 rounded-full py-0.5 px-3"
            >
              ESTOQUE SELECIONADO
            </Badge>
            <h2 className="text-xl font-bold text-white tracking-tight sm:text-2xl lg:text-3xl">
              Veículos em Destaque
            </h2>
          </div>
          <a
            href="#estoque"
            onClick={() => setActiveTab("todos")}
            className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[#E8231F] hover:text-[#ff5956] transition-colors sm:text-sm"
          >
            <span className="hidden sm:inline">Ver todo o estoque</span>
            <span className="sm:hidden">Ver todos</span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </a>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6 min-w-0 sm:mb-8">
          <div className="overflow-x-auto pb-2">
            <TabsList className="w-max min-w-full border border-white/5 bg-[#121212] p-1 rounded-xl">
              {[
                { label: "Todos os Veículos", value: "todos" },
                { label: "⭐ Destaques", value: "destaque" },
                { label: "SUVs", value: "suv" },
                { label: "Sedans", value: "sedan" },
                { label: "Hatches", value: "hatch" },
                { label: "Picapes", value: "picape" },
                { label: "Motos", value: "motos" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="shrink-0 px-3.5 py-1.5 text-xs font-medium rounded-lg data-[state=active]:bg-[#E8231F] data-[state=active]:text-white sm:px-5"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        {displayedVehicles.length === 0 ? (
          <div className="bg-[#121212] border border-white/5 rounded-2xl p-10 text-center">
            <p className="text-sm font-semibold text-white mb-1">
              Nenhum veículo encontrado nesta categoria
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Tente selecionar outra categoria ou limpar a busca.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("todos")}
              className="border-white/10 text-xs"
            >
              Exibir todos os veículos
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayedVehicles.map((v) => {
              const coverImage = v.images[v.mainImageIndex || 0] || v.images[0];
              const statusTag = {
                disponivel: null,
                reservado: { label: "Reservado", color: "bg-amber-500/80 text-white" },
                vendido: { label: "Vendido", color: "bg-zinc-700/90 text-zinc-300" },
              }[v.status];

              return (
                <Card
                  key={v.id}
                  className="bg-[#121212] border-white/5 overflow-hidden flex flex-col hover:border-[#E8231F]/40 transition-all rounded-xl shadow-md group"
                >
                  <Link to="/veiculos/$slug" params={{ slug: v.slug }} className="block" preload="intent">
                    <div className="relative aspect-[16/10] overflow-hidden bg-black">
                      <img
                        src={coverImage}
                        alt={v.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-semibold text-white">
                        {v.modelYear}
                      </div>
                      {statusTag && (
                        <div
                          className={`absolute top-2 right-2 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-bold uppercase shadow ${statusTag.color}`}
                        >
                          {statusTag.label}
                        </div>
                      )}
                      {v.isFeatured && !statusTag && (
                        <div className="absolute top-2 right-2 bg-[#E8231F] text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase shadow flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Destaque
                        </div>
                      )}
                    </div>
                  </Link>

                  <CardContent className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <Link to="/veiculos/$slug" params={{ slug: v.slug }} preload="intent">
                        <h3 className="font-bold text-white text-base truncate hover:text-[#E8231F] transition-colors mb-0.5">
                          {v.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-400 mb-3 truncate">{v.version || v.model}</p>

                      <div className="flex gap-3 mb-3 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Gauge className="w-3.5 h-3.5 text-gray-500" /> {formatMileage(v.mileage)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Fuel className="w-3.5 h-3.5 text-gray-500" />{" "}
                          <span className="capitalize">{v.fuel}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-lg font-bold text-brand-gradient mb-0.5">
                        {formatCurrency(v.price)}
                      </div>
                      {v.installmentValue ? (
                        <p className="text-[11px] text-gray-400 truncate">
                          Entrada + {v.installmentsCount || 48}x de{" "}
                          {formatCurrency(v.installmentValue)}
                        </p>
                      ) : (
                        <p className="text-[11px] text-gray-400">
                          Consulte condições de parcelamento
                        </p>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 gap-2">
                    <Link to="/veiculos/$slug" params={{ slug: v.slug }} className="flex-1" preload="intent">
                        <Button
                          variant="outline"
                          className="w-full h-9 text-xs font-semibold border-white/10 hover:bg-white/5 text-gray-200 rounded-lg"
                        >
                          Detalhes
                        </Button>
                      </Link>
                    <Button
                      onClick={() => setSelectedVehicleForLead(v)}
                      className="flex-1 h-9 text-xs font-semibold bg-brand-gradient hover:opacity-95 text-white rounded-lg shadow-sm shadow-[#E8231F]/15"
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1" />
                      Interesse
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Lead capture modal */}
      <LeadModal
        isOpen={selectedVehicleForLead !== null}
        onClose={() => setSelectedVehicleForLead(null)}
        vehicle={selectedVehicleForLead}
      />
    </section>
  );
}
