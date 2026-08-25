import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { getPublicVehicles, subscribeToStore, formatCurrency, formatMileage } from "@/lib/db/store";
import { Vehicle } from "@/lib/db/types";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { LeadModal } from "@/components/landing/LeadModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Car,
  Fuel,
  Gauge,
  Search,
  RotateCcw,
  MessageSquare,
  Sparkles,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/estoque")({
  head: () => ({
    title: "Estoque Completo | C&M Veículos",
    meta: [
      {
        name: "description",
        content:
          "Confira todo o estoque de veículos disponíveis na C&M Veículos. Carros, SUVs, Sedans, Hatches, Picapes e Motos com procedência garantida.",
      },
    ],
  }),
  component: EstoquePage,
});

function EstoquePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(getPublicVehicles());
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [brandFilter, setBrandFilter] = useState("todas");
  const [priceFilter, setPriceFilter] = useState("indiferente");
  const [yearFilter, setYearFilter] = useState("indiferente");
  const [transmissionFilter, setTransmissionFilter] = useState("indiferente");
  const [fuelFilter, setFuelFilter] = useState("indiferente");
  const [selectedVehicleForLead, setSelectedVehicleForLead] = useState<Vehicle | null>(null);

  useEffect(() => {
    const update = () => setVehicles(getPublicVehicles());
    update();
    const unsub = subscribeToStore(update);
    return () => unsub();
  }, []);

  // Build dynamic filter options from current stock
  const filterOptions = useMemo(() => {
    const categories = [...new Set(vehicles.map((v) => v.category))].sort();
    const brands = [...new Set(vehicles.map((v) => v.brand))].sort();
    const years = [...new Set(vehicles.map((v) => v.modelYear))].sort((a, b) => b - a);
    const transmissions = [...new Set(vehicles.map((v) => v.transmission))].sort();
    const fuels = [...new Set(vehicles.map((v) => v.fuel))].sort();
    return { categories, brands, years, transmissions, fuels };
  }, [vehicles]);

  const maxPrice = useMemo(() => {
    if (!vehicles.length) return 0;
    return Math.max(...vehicles.map((v) => v.price));
  }, [vehicles]);

  const priceRanges = useMemo(() => {
    const ranges = [];
    if (maxPrice > 0) ranges.push({ label: `Até R$ 50.000`, value: "50000" });
    if (maxPrice > 50000) ranges.push({ label: `Até R$ 100.000`, value: "100000" });
    if (maxPrice > 100000) ranges.push({ label: `Até R$ 150.000`, value: "150000" });
    if (maxPrice > 150000) ranges.push({ label: `Até R$ 200.000`, value: "200000" });
    return ranges;
  }, [maxPrice]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (categoryFilter !== "todas" && v.category !== categoryFilter) return false;
      if (brandFilter !== "todas" && v.brand !== brandFilter) return false;
      if (yearFilter !== "indiferente" && v.modelYear !== Number(yearFilter)) return false;
      if (transmissionFilter !== "indiferente" && v.transmission !== transmissionFilter)
        return false;
      if (fuelFilter !== "indiferente" && v.fuel !== fuelFilter) return false;
      if (priceFilter !== "indiferente" && v.price > Number(priceFilter)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const match =
          v.name.toLowerCase().includes(q) ||
          v.brand.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.version.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [
    vehicles,
    categoryFilter,
    brandFilter,
    yearFilter,
    transmissionFilter,
    fuelFilter,
    priceFilter,
    search,
  ]);

  const categoryLabel: Record<string, string> = {
    suv: "SUV",
    sedan: "Sedan",
    hatch: "Hatch",
    picape: "Picape",
    moto: "Moto",
    minivan: "Minivan",
    esportivo: "Esportivo",
    utilitario: "Utilitário",
    outro: "Outro",
  };

  const transmissionLabel: Record<string, string> = {
    manual: "Manual",
    automatico: "Automático",
    cvt: "CVT",
    automatizado: "Automatizado",
  };

  const fuelLabel: Record<string, string> = {
    flex: "Flex",
    gasolina: "Gasolina",
    diesel: "Diesel",
    etanol: "Etanol",
    hibrido: "Híbrido",
    eletrico: "Elétrico",
  };

  const hasActiveFilters =
    search.trim() ||
    categoryFilter !== "todas" ||
    brandFilter !== "todas" ||
    priceFilter !== "indiferente" ||
    yearFilter !== "indiferente" ||
    transmissionFilter !== "indiferente" ||
    fuelFilter !== "indiferente";

  const handleReset = () => {
    setSearch("");
    setCategoryFilter("todas");
    setBrandFilter("todas");
    setPriceFilter("indiferente");
    setYearFilter("indiferente");
    setTransmissionFilter("indiferente");
    setFuelFilter("indiferente");
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#E8231F] selection:text-white">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-16 lg:pt-28 lg:pb-24">
        {/* Page Header */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge
              variant="secondary"
              className="bg-[#E8231F]/10 border border-[#E8231F]/20 text-[#E8231F] font-semibold text-xs mb-2 rounded-full py-0.5 px-3"
            >
              ESTOQUE COMPLETO
            </Badge>
            <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl lg:text-4xl">
              Todos os Veículos Disponíveis
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {vehicles.length} veículo{vehicles.length !== 1 ? "s" : ""} no estoque •{" "}
              {filteredVehicles.length} exibido{filteredVehicles.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-[#121212] border border-white/5 rounded-2xl p-4 sm:p-5 mb-6 space-y-4 shadow-md">
          {/* Search Row */}
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Buscar por marca, modelo ou versão..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-black/50 border-white/10 pl-10 text-white placeholder:text-gray-500 h-11 text-sm rounded-lg"
              />
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={handleReset}
                className="h-11 px-3 text-xs text-[#E8231F] hover:text-white hover:bg-white/5 gap-1.5 shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Limpar
              </Button>
            )}
          </div>

          {/* Filter Selects Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Category */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Categoria
              </label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-black/50 border-white/10 h-10 text-xs text-white rounded-lg">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent className="bg-[#121212] border-white/10 text-white text-xs">
                  <SelectItem value="todas">Todas</SelectItem>
                  {filterOptions.categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {categoryLabel[cat] || cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Brand */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Marca
              </label>
              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger className="bg-black/50 border-white/10 h-10 text-xs text-white rounded-lg">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent className="bg-[#121212] border-white/10 text-white text-xs">
                  <SelectItem value="todas">Todas as marcas</SelectItem>
                  {filterOptions.brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Preço Máx.
              </label>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="bg-black/50 border-white/10 h-10 text-xs text-white rounded-lg">
                  <SelectValue placeholder="Indiferente" />
                </SelectTrigger>
                <SelectContent className="bg-[#121212] border-white/10 text-white text-xs">
                  <SelectItem value="indiferente">Indiferente</SelectItem>
                  {priceRanges.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Ano
              </label>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="bg-black/50 border-white/10 h-10 text-xs text-white rounded-lg">
                  <SelectValue placeholder="Indiferente" />
                </SelectTrigger>
                <SelectContent className="bg-[#121212] border-white/10 text-white text-xs">
                  <SelectItem value="indiferente">Indiferente</SelectItem>
                  {filterOptions.years.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Transmission */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Câmbio
              </label>
              <Select value={transmissionFilter} onValueChange={setTransmissionFilter}>
                <SelectTrigger className="bg-black/50 border-white/10 h-10 text-xs text-white rounded-lg">
                  <SelectValue placeholder="Indiferente" />
                </SelectTrigger>
                <SelectContent className="bg-[#121212] border-white/10 text-white text-xs">
                  <SelectItem value="indiferente">Indiferente</SelectItem>
                  {filterOptions.transmissions.map((t) => (
                    <SelectItem key={t} value={t}>
                      {transmissionLabel[t] || t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fuel */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Combustível
              </label>
              <Select value={fuelFilter} onValueChange={setFuelFilter}>
                <SelectTrigger className="bg-black/50 border-white/10 h-10 text-xs text-white rounded-lg">
                  <SelectValue placeholder="Indiferente" />
                </SelectTrigger>
                <SelectContent className="bg-[#121212] border-white/10 text-white text-xs">
                  <SelectItem value="indiferente">Indiferente</SelectItem>
                  {filterOptions.fuels.map((f) => (
                    <SelectItem key={f} value={f}>
                      {fuelLabel[f] || f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active filter badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-1 border-t border-white/5">
              <span className="text-[10px] text-gray-500 self-center">Filtros ativos:</span>
              {search && (
                <span className="inline-flex items-center gap-1 bg-[#E8231F]/15 text-[#E8231F] text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-[#E8231F]/30">
                  "{search}"{" "}
                  <button onClick={() => setSearch("")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {categoryFilter !== "todas" && (
                <span className="inline-flex items-center gap-1 bg-white/5 text-gray-300 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-white/10">
                  {categoryLabel[categoryFilter] || categoryFilter}{" "}
                  <button onClick={() => setCategoryFilter("todas")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {brandFilter !== "todas" && (
                <span className="inline-flex items-center gap-1 bg-white/5 text-gray-300 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-white/10">
                  {brandFilter}{" "}
                  <button onClick={() => setBrandFilter("todas")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {priceFilter !== "indiferente" && (
                <span className="inline-flex items-center gap-1 bg-white/5 text-gray-300 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-white/10">
                  Até {formatCurrency(Number(priceFilter))}{" "}
                  <button onClick={() => setPriceFilter("indiferente")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {yearFilter !== "indiferente" && (
                <span className="inline-flex items-center gap-1 bg-white/5 text-gray-300 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-white/10">
                  Ano {yearFilter}{" "}
                  <button onClick={() => setYearFilter("indiferente")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {transmissionFilter !== "indiferente" && (
                <span className="inline-flex items-center gap-1 bg-white/5 text-gray-300 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-white/10">
                  {transmissionLabel[transmissionFilter] || transmissionFilter}{" "}
                  <button onClick={() => setTransmissionFilter("indiferente")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {fuelFilter !== "indiferente" && (
                <span className="inline-flex items-center gap-1 bg-white/5 text-gray-300 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-white/10">
                  {fuelLabel[fuelFilter] || fuelFilter}{" "}
                  <button onClick={() => setFuelFilter("indiferente")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Vehicle Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="bg-[#121212] border border-white/5 rounded-2xl p-12 text-center space-y-3">
            <Car className="w-12 h-12 text-gray-600 mx-auto" />
            <h3 className="text-base font-bold text-white">Nenhum veículo encontrado</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Nenhum veículo corresponde aos filtros selecionados. Tente ajustar sua busca.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="border-white/10 text-xs mt-2"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Limpar filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredVehicles.map((v) => {
              const coverImage = v.images[v.mainImageIndex || 0] || v.images[0];
              const statusTag =
                v.status === "reservado"
                  ? { label: "Reservado", color: "bg-amber-500/80 text-white" }
                  : v.status === "vendido"
                    ? { label: "Vendido", color: "bg-zinc-700/90 text-zinc-300" }
                    : null;

              return (
                <Card
                  key={v.id}
                  className="bg-[#121212] border-white/5 overflow-hidden flex flex-col hover:border-[#E8231F]/40 transition-all rounded-xl shadow-md group"
                >
                  <Link to="/veiculos/$slug" params={{ slug: v.slug }} className="block">
                    <div className="relative aspect-[16/10] overflow-hidden bg-black">
                      {coverImage ? (
                        <img
                          src={coverImage}
                          alt={v.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-700">
                          <Car className="w-10 h-10" />
                        </div>
                      )}
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
                      <Link to="/veiculos/$slug" params={{ slug: v.slug }}>
                        <h3 className="font-bold text-white text-base truncate hover:text-[#E8231F] transition-colors mb-0.5">
                          {v.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-400 mb-3 truncate">{v.version || v.model}</p>

                      <div className="flex gap-3 mb-3 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Gauge className="w-3.5 h-3.5 text-gray-500" />
                          {formatMileage(v.mileage)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Fuel className="w-3.5 h-3.5 text-gray-500" />
                          <span className="capitalize">{fuelLabel[v.fuel] || v.fuel}</span>
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
                    <Link to="/veiculos/$slug" params={{ slug: v.slug }} className="flex-1">
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
      </main>

      <LeadModal
        isOpen={selectedVehicleForLead !== null}
        onClose={() => setSelectedVehicleForLead(null)}
        vehicle={selectedVehicleForLead}
      />

      <Footer />
    </div>
  );
}
