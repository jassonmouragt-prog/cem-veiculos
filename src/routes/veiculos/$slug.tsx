import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  getVehicleBySlug,
  seedVehicles,
  subscribeToStore,
  formatCurrency,
  formatMileage,
} from "@/lib/db/store";
import { Vehicle } from "@/lib/db/types";
import { getPublicVehiclesServer } from "@/lib/db/vehicles.functions";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { LeadModal } from "@/components/landing/LeadModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Gauge,
  Fuel,
  CheckCircle2,
  Calendar,
  Palette,
  DoorClosed,
  ShieldCheck,
  Sparkles,
  MessageSquare,
  Calculator,
  ArrowLeft,
  Clock,
  Tag,
  Check,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/veiculos/$slug")({
  loader: async () => ({ vehicles: await getPublicVehiclesServer() }),
  component: VehicleDetailPage,
});

function VehicleDetailPage() {
  const { slug } = useParams({ from: "/veiculos/$slug" });
  const { vehicles: initialVehicles } = Route.useLoaderData();
  const [vehicle, setVehicle] = useState<Vehicle | undefined>(
    initialVehicles.find((v) => v.slug === slug || v.id === slug) ?? getVehicleBySlug(slug),
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  useEffect(() => {
    if (initialVehicles.length > 0) seedVehicles(initialVehicles);
    const update = () => {
      setVehicle(getVehicleBySlug(slug));
    };
    update();
    const unsubscribe = subscribeToStore(update, true);
    return () => unsubscribe();
  }, [slug, initialVehicles]);

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Car className="w-16 h-16 text-gray-600 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Veículo não encontrado</h1>
          <p className="text-sm text-gray-400 max-w-md mb-6">
            O veículo solicitado pode ter sido vendido ou o link está incorreto.
          </p>
          <Link to="/">
            <Button className="bg-brand-gradient hover:opacity-95 text-white gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Início
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images =
    vehicle.images.length > 0
      ? vehicle.images
      : [
          "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=1200",
        ];
  const currentImage = images[selectedImageIndex] || images[0];

  const statusBadge = {
    disponivel: {
      label: "Disponível para Compra",
      color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    },
    reservado: {
      label: "Veículo Reservado",
      color: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    },
    vendido: { label: "Veículo Vendido", color: "bg-zinc-800 text-zinc-400 border-zinc-700" },
  }[vehicle.status];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${vehicle.name} - C&M Veículos`,
        text: `Confira este ${vehicle.name} por ${formatCurrency(vehicle.price)} na C&M Veículos!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link do veículo copiado para a área de transferência!");
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Olá! Gostaria de mais informações sobre o veículo ${vehicle.name} (${vehicle.modelYear}) anunciado por ${formatCurrency(vehicle.price)}.`,
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#E8231F] selection:text-white">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-16 lg:pt-28 lg:pb-24 space-y-8">
        {/* Top Breadcrumb and Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
          <Link to="/" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Estoque</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="h-8 text-xs text-gray-300 hover:text-white gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Compartilhar</span>
          </Button>
        </div>

        {/* Main Grid: Gallery on Left, Pricing/Actions on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image Gallery & Description (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Main Featured Image */}
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#121212] border border-white/10 shadow-2xl">
              <img
                src={currentImage}
                alt={vehicle.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border backdrop-blur-md ${statusBadge.color}`}
                >
                  {statusBadge.label}
                </span>
                {vehicle.isFeatured && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-[#E8231F] text-white shadow">
                    <Sparkles className="w-3 h-3" /> Destaque
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative h-16 w-24 sm:h-20 sm:w-28 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImageIndex === idx
                        ? "border-[#E8231F] scale-95 shadow-md shadow-[#E8231F]/25"
                        : "border-white/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Miniatura ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Description Card */}
            {vehicle.description && (
              <Card className="bg-[#121212] border-white/5 p-6 rounded-2xl">
                <h3 className="text-base font-bold text-white mb-3">Sobre o Veículo</h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                  {vehicle.description}
                </p>
              </Card>
            )}

            {/* Features & Installed Options */}
            {vehicle.features && vehicle.features.length > 0 && (
              <Card className="bg-[#121212] border-white/5 p-6 rounded-2xl space-y-4">
                <h3 className="text-base font-bold text-white">Itens de Série e Opcionais</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {vehicle.features.map((feat) => (
                    <div
                      key={feat}
                      className="flex items-center gap-2 text-xs text-gray-300 bg-black/40 p-2.5 rounded-lg border border-white/5"
                    >
                      <Check className="w-4 h-4 text-[#E8231F] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column: Pricing, Specs & CTAs (5 cols) */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            {/* Header info card */}
            <Card className="bg-[#121212] border-white/10 p-6 rounded-2xl shadow-xl space-y-5">
              <div>
                <Badge
                  variant="outline"
                  className="text-[#E8231F] border-[#E8231F]/30 bg-[#E8231F]/10 text-xs font-semibold uppercase mb-2"
                >
                  {vehicle.category.toUpperCase()} • {vehicle.brand}
                </Badge>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {vehicle.name}
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  {vehicle.version || `${vehicle.brand} ${vehicle.model}`}
                </p>
              </div>

              {/* Price & Financing */}
              <div className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-1">
                <span className="text-xs font-medium text-gray-400">Preço à vista</span>
                <div className="text-3xl font-extrabold text-brand-gradient">
                  {formatCurrency(vehicle.price)}
                </div>
                {vehicle.installmentValue && (
                  <p className="text-xs text-gray-400 pt-1">
                    Entrada sugerida de {formatCurrency(vehicle.entryValue || 0)} +{" "}
                    {vehicle.installmentsCount || 48}x de{" "}
                    <strong className="text-white">
                      {formatCurrency(vehicle.installmentValue)}
                    </strong>
                  </p>
                )}
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-black/40 border border-white/5">
                  <Calendar className="w-4 h-4 text-[#E8231F] shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400">Ano Modelo</p>
                    <p className="text-xs font-semibold text-white">
                      {vehicle.manufacturingYear}/{vehicle.modelYear}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-black/40 border border-white/5">
                  <Gauge className="w-4 h-4 text-[#E8231F] shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400">Quilometragem</p>
                    <p className="text-xs font-semibold text-white">
                      {formatMileage(vehicle.mileage)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-black/40 border border-white/5">
                  <Fuel className="w-4 h-4 text-[#E8231F] shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400">Combustível</p>
                    <p className="text-xs font-semibold text-white capitalize">{vehicle.fuel}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-black/40 border border-white/5">
                  <Car className="w-4 h-4 text-[#E8231F] shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400">Câmbio</p>
                    <p className="text-xs font-semibold text-white capitalize">
                      {vehicle.transmission}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-black/40 border border-white/5">
                  <Palette className="w-4 h-4 text-[#E8231F] shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400">Cor</p>
                    <p className="text-xs font-semibold text-white">
                      {vehicle.color || "Não informada"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-black/40 border border-white/5">
                  <DoorClosed className="w-4 h-4 text-[#E8231F] shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400">Portas</p>
                    <p className="text-xs font-semibold text-white">
                      {vehicle.doors > 0 ? `${vehicle.doors} Portas` : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Badges of provenance */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                {vehicle.singleOwner && (
                  <Badge
                    variant="secondary"
                    className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium py-1 px-2.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Único Dono
                  </Badge>
                )}
                {vehicle.dealerMaintained && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-medium py-1 px-2.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Revisões na Concessionária
                  </Badge>
                )}
                {vehicle.acceptsTrade && (
                  <Badge
                    variant="secondary"
                    className="bg-white/5 text-gray-300 border border-white/10 text-[11px] font-medium py-1 px-2.5"
                  >
                    Aceita Troca
                  </Badge>
                )}
                {vehicle.acceptsFinancing && (
                  <Badge
                    variant="secondary"
                    className="bg-white/5 text-gray-300 border border-white/10 text-[11px] font-medium py-1 px-2.5"
                  >
                    Financiamento Disponível
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-3">
                <Button
                  onClick={() => setIsLeadModalOpen(true)}
                  className="w-full h-12 bg-brand-gradient hover:opacity-95 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-[#E8231F]/20 gap-2 transition-all"
                >
                  <MessageSquare className="w-5 h-5" />
                  Tenho Interesse
                </Button>

                <a
                  href={`https://wa.me/558699148872?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button
                    variant="outline"
                    className="w-full h-11 border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-xs sm:text-sm rounded-xl gap-2 transition-all"
                  >
                    <span>Falar Direto no WhatsApp</span>
                  </Button>
                </a>
              </div>
            </Card>

            {/* Store Security & Trust card */}
            <Card className="bg-[#121212] border-white/5 p-5 rounded-2xl space-y-3 text-xs text-gray-400">
              <div className="flex items-center gap-2.5 text-white font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-[#E8231F]" />
                <span>Garantia e Procedência C&M</span>
              </div>
              <ul className="space-y-1.5 list-disc pl-4 text-[11px] leading-relaxed">
                <li>Veículo com laudo cautelar 100% aprovado</li>
                <li>Garantia de motor e câmbio</li>
                <li>Documentação rigorosamente em dia</li>
                <li>Financiamento em até 60x com os principais bancos</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>

      {/* Lead Capture Modal */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        vehicle={vehicle}
      />

      <Footer />
    </div>
  );
}
