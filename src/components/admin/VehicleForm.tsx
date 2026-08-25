import React, { useState } from "react";
import {
  Vehicle,
  VehicleCategory,
  FuelType,
  TransmissionType,
  VehicleStatus,
} from "@/lib/db/types";
import { ImageUploader } from "./ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Car,
  Wrench,
  DollarSign,
  Sliders,
  Image as ImageIcon,
  Save,
  X,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface VehicleFormProps {
  initialVehicle?: Vehicle | null;
  onSave: (vehicleData: Omit<Vehicle, "id" | "slug" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

const COMMON_BRANDS = [
  "Toyota",
  "Honda",
  "Jeep",
  "Volkswagen",
  "Yamaha",
  "Chevrolet",
  "Hyundai",
  "Fiat",
  "Ford",
  "Renault",
  "Nissan",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volvo",
  "BYD",
  "GWM",
  "Outros",
];

const AVAILABLE_FEATURES = [
  "Ar-condicionado",
  "Direção hidráulica / elétrica",
  "Airbag frontal e lateral",
  "Central multimídia",
  "Câmera de ré",
  "Sensor de estacionamento",
  "Bancos de couro",
  "Teto solar",
  "Rodas de liga leve",
  "Freios ABS",
  "Piloto automático",
  "Controle de tração e estabilidade",
  "Faróis de LED",
  "Chave presencial / Partida Start-Stop",
  "Vidros e travas elétricas",
  "Retrovisores elétricos",
  "Computador de bordo",
  "Assistente de partida em rampa",
];

export function VehicleForm({ initialVehicle, onSave, onCancel }: VehicleFormProps) {
  // 1. Basic Info
  const [brand, setBrand] = useState(initialVehicle?.brand || "Toyota");
  const [customBrand, setCustomBrand] = useState(initialVehicle?.brand || "");
  const [model, setModel] = useState(initialVehicle?.model || "");
  const [version, setVersion] = useState(initialVehicle?.version || "");
  const [manufacturingYear, setManufacturingYear] = useState(
    initialVehicle?.manufacturingYear || new Date().getFullYear(),
  );
  const [modelYear, setModelYear] = useState(initialVehicle?.modelYear || new Date().getFullYear());
  const [category, setCategory] = useState<VehicleCategory>(initialVehicle?.category || "sedan");

  // 2. Engine & Mechanics
  const [engine, setEngine] = useState(initialVehicle?.engine || "2.0");
  const [fuel, setFuel] = useState<FuelType>(initialVehicle?.fuel || "flex");
  const [transmission, setTransmission] = useState<TransmissionType>(
    initialVehicle?.transmission || "automatico",
  );
  const [powerHp, setPowerHp] = useState<number | "">(initialVehicle?.powerHp || "");
  const [mileage, setMileage] = useState<number | "">(initialVehicle?.mileage ?? 0);

  // 3. Price & Terms
  const [price, setPrice] = useState<number | "">(initialVehicle?.price || "");
  const [acquisitionCost, setAcquisitionCost] = useState<number | "">(
    initialVehicle?.acquisitionCost || "",
  );
  const [stockEntryDate, setStockEntryDate] = useState(
    initialVehicle?.stockEntryDate?.split("T")[0] || "",
  );
  const [entryValue, setEntryValue] = useState<number | "">(initialVehicle?.entryValue || "");
  const [installmentsCount, setInstallmentsCount] = useState<number | "">(
    initialVehicle?.installmentsCount || 48,
  );
  const [installmentValue, setInstallmentValue] = useState<number | "">(
    initialVehicle?.installmentValue || "",
  );
  const [acceptsTrade, setAcceptsTrade] = useState(initialVehicle?.acceptsTrade ?? true);
  const [acceptsFinancing, setAcceptsFinancing] = useState(
    initialVehicle?.acceptsFinancing ?? true,
  );

  // 4. Features & Specs
  const [color, setColor] = useState(initialVehicle?.color || "Preto");
  const [doors, setDoors] = useState(initialVehicle?.doors ?? 4);
  const [features, setFeatures] = useState<string[]>(
    initialVehicle?.features || [
      "Ar-condicionado",
      "Direção hidráulica / elétrica",
      "Airbag frontal e lateral",
      "Central multimídia",
      "Freios ABS",
    ],
  );
  const [singleOwner, setSingleOwner] = useState(initialVehicle?.singleOwner ?? false);
  const [dealerMaintained, setDealerMaintained] = useState(
    initialVehicle?.dealerMaintained ?? false,
  );

  // 5. Media, Description & Status
  const [description, setDescription] = useState(initialVehicle?.description || "");
  const [images, setImages] = useState<string[]>(
    initialVehicle?.images || [
      "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=1200",
    ],
  );
  const [mainImageIndex, setMainImageIndex] = useState(initialVehicle?.mainImageIndex || 0);
  const [status, setStatus] = useState<VehicleStatus>(initialVehicle?.status || "disponivel");
  const [isFeatured, setIsFeatured] = useState(initialVehicle?.isFeatured ?? true);

  const toggleFeature = (feat: string) => {
    if (features.includes(feat)) {
      setFeatures(features.filter((f) => f !== feat));
    } else {
      setFeatures([...features, feat]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalBrand = brand === "Outros" ? customBrand.trim() : brand;
    if (!finalBrand) {
      toast.error("Por favor, preencha a marca do veículo.");
      return;
    }
    if (!model.trim()) {
      toast.error("Por favor, preencha o modelo do veículo.");
      return;
    }
    if (!price || Number(price) <= 0) {
      toast.error("Por favor, informe um preço válido.");
      return;
    }

    const vehicleName = `${finalBrand} ${model.trim()}${version.trim() ? " " + version.trim() : ""}`;

    onSave({
      name: vehicleName,
      brand: finalBrand,
      model: model.trim(),
      version: version.trim(),
      manufacturingYear: Number(manufacturingYear),
      modelYear: Number(modelYear),
      category,
      engine: engine.trim(),
      fuel,
      transmission,
      ...(powerHp ? { powerHp: Number(powerHp) } : {}),
      mileage: Number(mileage) || 0,
      price: Number(price),
      ...(acquisitionCost ? { acquisitionCost: Number(acquisitionCost) } : {}),
      ...(stockEntryDate ? { stockEntryDate: new Date(stockEntryDate).toISOString() } : {}),
      ...(entryValue ? { entryValue: Number(entryValue) } : {}),
      ...(installmentsCount ? { installmentsCount: Number(installmentsCount) } : {}),
      ...(installmentValue ? { installmentValue: Number(installmentValue) } : {}),
      acceptsTrade,
      acceptsFinancing,
      color: color.trim(),
      doors: Number(doors),
      features,
      singleOwner,
      dealerMaintained,
      description: description.trim(),
      images:
        images.length > 0
          ? images
          : [
              "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=1200",
            ],
      mainImageIndex: Math.min(mainImageIndex, Math.max(0, images.length - 1)),
      status,
      isFeatured,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {initialVehicle ? `Editar: ${initialVehicle.name}` : "Cadastrar Novo Veículo"}
          </h2>
          <p className="text-xs text-gray-400">
            Preencha as informações do veículo organizadas por seções
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-white/10 hover:bg-white/5 text-gray-300 text-xs sm:text-sm h-10 gap-1.5 rounded-lg"
          >
            <X className="w-4 h-4" />
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-brand-gradient hover:opacity-95 text-white font-semibold text-xs sm:text-sm h-10 gap-2 px-5 rounded-lg shadow-md shadow-[#E8231F]/20"
          >
            <Save className="w-4 h-4" />
            {initialVehicle ? "Salvar Alterações" : "Publicar Veículo"}
          </Button>
        </div>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["item-1", "item-2", "item-3", "item-4", "item-5"]}
        className="space-y-4"
      >
        {/* 1. Informações Básicas */}
        <AccordionItem
          value="item-1"
          className="border border-white/10 bg-[#141414] rounded-xl px-5 py-1"
        >
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3 text-left">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8231F]/15 text-[#E8231F]">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">
                  1. Informações Básicas
                </h3>
                <p className="text-xs text-gray-400">Marca, modelo, versão, ano e categoria</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">Marca *</Label>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger className="bg-black/50 border-white/10 text-white h-11">
                    <SelectValue placeholder="Selecione a marca" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                    {COMMON_BRANDS.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {brand === "Outros" && (
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-300">Nome da Marca *</Label>
                  <Input
                    placeholder="Digite a marca"
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    className="bg-black/50 border-white/10 text-white h-11"
                    required
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">Modelo *</Label>
                <Input
                  placeholder="Ex: Corolla, HR-V, Compass"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="bg-black/50 border-white/10 text-white h-11"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">Versão / Acabamento</Label>
                <Input
                  placeholder="Ex: 2.0 XEi 16V Aut."
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="bg-black/50 border-white/10 text-white h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">Ano de Fabricação</Label>
                <Input
                  type="number"
                  placeholder="2021"
                  value={manufacturingYear}
                  onChange={(e) => setManufacturingYear(Number(e.target.value))}
                  className="bg-black/50 border-white/10 text-white h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">Ano do Modelo</Label>
                <Input
                  type="number"
                  placeholder="2021"
                  value={modelYear}
                  onChange={(e) => setModelYear(Number(e.target.value))}
                  className="bg-black/50 border-white/10 text-white h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">Categoria</Label>
                <Select
                  value={category}
                  onValueChange={(val) => setCategory(val as VehicleCategory)}
                >
                  <SelectTrigger className="bg-black/50 border-white/10 text-white h-11">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="hatch">Hatch</SelectItem>
                    <SelectItem value="picape">Picape</SelectItem>
                    <SelectItem value="moto">Moto</SelectItem>
                    <SelectItem value="utilitario">Utilitário</SelectItem>
                    <SelectItem value="coupe">Coupé</SelectItem>
                    <SelectItem value="perua">Perua</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 2. Motorização e Mecânica */}
        <AccordionItem
          value="item-2"
          className="border border-white/10 bg-[#141414] rounded-xl px-5 py-1"
        >
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3 text-left">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8231F]/15 text-[#E8231F]">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">
                  2. Motorização e Mecânica
                </h3>
                <p className="text-xs text-gray-400">
                  Motor, combustível, câmbio, potência e quilometragem
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">Motorização</Label>
                <Input
                  placeholder="Ex: 1.0 Turbo, 1.8, 2.0, 321cc"
                  value={engine}
                  onChange={(e) => setEngine(e.target.value)}
                  className="bg-black/50 border-white/10 text-white h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">Combustível</Label>
                <Select value={fuel} onValueChange={(val) => setFuel(val as FuelType)}>
                  <SelectTrigger className="bg-black/50 border-white/10 text-white h-11">
                    <SelectValue placeholder="Combustível" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                    <SelectItem value="flex">Flex (Álcool/Gasolina)</SelectItem>
                    <SelectItem value="gasolina">Gasolina</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="hibrido">Híbrido</SelectItem>
                    <SelectItem value="eletrico">100% Elétrico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">Câmbio / Transmissão</Label>
                <Select
                  value={transmission}
                  onValueChange={(val) => setTransmission(val as TransmissionType)}
                >
                  <SelectTrigger className="bg-black/50 border-white/10 text-white h-11">
                    <SelectValue placeholder="Câmbio" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                    <SelectItem value="automatico">Automático</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="cvt">Automático CVT</SelectItem>
                    <SelectItem value="automatizado">Automatizado / Dupla Embreagem</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">Potência (cv)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 177"
                  value={powerHp}
                  onChange={(e) => setPowerHp(e.target.value ? Number(e.target.value) : "")}
                  className="bg-black/50 border-white/10 text-white h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">Quilometragem (km) *</Label>
                <Input
                  type="number"
                  placeholder="Ex: 45000"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value ? Number(e.target.value) : "")}
                  className="bg-black/50 border-white/10 text-white h-11"
                  required
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 3. Preço e Condições */}
        <AccordionItem
          value="item-3"
          className="border border-white/10 bg-[#141414] rounded-xl px-5 py-1"
        >
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3 text-left">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8231F]/15 text-[#E8231F]">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">
                  3. Preço e Condições de Pagamento
                </h3>
                <p className="text-xs text-gray-400">
                  Preço à vista, entrada sugerida, parcelas e facilidades
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">Preço à Vista (R$) *</Label>
                <Input
                  type="number"
                  placeholder="Ex: 112900"
                  value={price}
                  onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
                  className="bg-black/50 border-white/10 text-white h-11 text-base font-bold text-[#E8231F]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">Custo de Aquisição (R$)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 100000"
                  value={acquisitionCost}
                  onChange={(e) => setAcquisitionCost(e.target.value ? Number(e.target.value) : "")}
                  className="bg-black/50 border-white/10 text-white h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">Data Entrada Estoque</Label>
                <Input
                  type="date"
                  value={stockEntryDate}
                  onChange={(e) => setStockEntryDate(e.target.value)}
                  className="bg-black/50 border-white/10 text-white h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">Entrada Sugerida (R$)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 20000"
                  value={entryValue}
                  onChange={(e) => setEntryValue(e.target.value ? Number(e.target.value) : "")}
                  className="bg-black/50 border-white/10 text-white h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">Nº de Parcelas</Label>
                <Input
                  type="number"
                  placeholder="Ex: 48"
                  value={installmentsCount}
                  onChange={(e) =>
                    setInstallmentsCount(e.target.value ? Number(e.target.value) : "")
                  }
                  className="bg-black/50 border-white/10 text-white h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">Valor da Parcela (R$)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 1899"
                  value={installmentValue}
                  onChange={(e) =>
                    setInstallmentValue(e.target.value ? Number(e.target.value) : "")
                  }
                  className="bg-black/50 border-white/10 text-white h-11"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-3 border-t border-white/5">
              <div className="flex items-center space-x-2">
                <Switch id="trade" checked={acceptsTrade} onCheckedChange={setAcceptsTrade} />
                <Label htmlFor="trade" className="text-xs sm:text-sm text-gray-200 cursor-pointer">
                  Aceita Troca por Veículo Usado
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="finance"
                  checked={acceptsFinancing}
                  onCheckedChange={setAcceptsFinancing}
                />
                <Label
                  htmlFor="finance"
                  className="text-xs sm:text-sm text-gray-200 cursor-pointer"
                >
                  Aceita Financiamento Bancário
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 4. Características e Opcionais */}
        <AccordionItem
          value="item-4"
          className="border border-white/10 bg-[#141414] rounded-xl px-5 py-1"
        >
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3 text-left">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8231F]/15 text-[#E8231F]">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">
                  4. Características e Opcionais
                </h3>
                <p className="text-xs text-gray-400">
                  Cor, portas, procedência e lista de equipamentos
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">Cor do Veículo</Label>
                <Input
                  placeholder="Ex: Prata, Branco Pérola, Preto"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="bg-black/50 border-white/10 text-white h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">Número de Portas</Label>
                <Select value={String(doors)} onValueChange={(val) => setDoors(Number(val))}>
                  <SelectTrigger className="bg-black/50 border-white/10 text-white h-11">
                    <SelectValue placeholder="Portas" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                    <SelectItem value="4">4 Portas</SelectItem>
                    <SelectItem value="2">2 Portas</SelectItem>
                    <SelectItem value="0">0 (Moto)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="single-owner"
                  checked={singleOwner}
                  onCheckedChange={(c) => setSingleOwner(Boolean(c))}
                />
                <Label htmlFor="single-owner" className="text-xs text-gray-200 cursor-pointer">
                  Único Dono
                </Label>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="dealer"
                  checked={dealerMaintained}
                  onCheckedChange={(c) => setDealerMaintained(Boolean(c))}
                />
                <Label htmlFor="dealer" className="text-xs text-gray-200 cursor-pointer">
                  Revisões na Concessionária
                </Label>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-white/5">
              <Label className="text-xs text-gray-300 font-semibold block mb-2">
                Itens e Opcionais Instalados:
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {AVAILABLE_FEATURES.map((feat) => {
                  const isChecked = features.includes(feat);
                  return (
                    <label
                      key={feat}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? "border-[#E8231F]/50 bg-[#E8231F]/10 text-white font-medium"
                          : "border-white/5 bg-black/30 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      <Checkbox checked={isChecked} onCheckedChange={() => toggleFeature(feat)} />
                      <span>{feat}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 5. Descrição, Mídia e Status */}
        <AccordionItem
          value="item-5"
          className="border border-white/10 bg-[#141414] rounded-xl px-5 py-1"
        >
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3 text-left">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8231F]/15 text-[#E8231F]">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">
                  5. Descrição, Galeria de Fotos e Status
                </h3>
                <p className="text-xs text-gray-400">
                  Texto descritivo, fotos do veículo, capa e status de publicação
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-5 space-y-5">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Descrição Detalhada do Veículo</Label>
              <Textarea
                placeholder="Descreva o estado de conservação, laudos cautelares, diferenciais, procedência e garantia..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-black/50 border-white/10 text-white min-h-[100px] text-xs sm:text-sm leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-gray-300 font-semibold block">
                Fotos do Veículo (Upload Múltiplo e Ordenação)
              </Label>
              <ImageUploader
                images={images}
                mainImageIndex={mainImageIndex}
                onChangeImages={setImages}
                onChangeMainImage={setMainImageIndex}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">Status do Veículo</Label>
                <Select value={status} onValueChange={(val) => setStatus(val as VehicleStatus)}>
                  <SelectTrigger className="bg-black/50 border-white/10 text-white h-11">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                    <SelectItem value="disponivel">🟢 Disponível para Venda</SelectItem>
                    <SelectItem value="reservado">🟡 Reservado</SelectItem>
                    <SelectItem value="vendido">🔴 Vendido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#E8231F]" />
                    <Label
                      htmlFor="featured"
                      className="text-xs sm:text-sm font-semibold text-white cursor-pointer"
                    >
                      Destaque na Home
                    </Label>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Exibir este veículo no carrossel de destaque do site público
                  </p>
                </div>
                <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-white/10 hover:bg-white/5 text-gray-300 text-xs sm:text-sm h-11 px-5 rounded-lg"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-brand-gradient hover:opacity-95 text-white font-semibold text-xs sm:text-sm h-11 gap-2 px-6 rounded-lg shadow-md shadow-[#E8231F]/20"
        >
          <Save className="w-4 h-4" />
          {initialVehicle ? "Salvar Alterações" : "Publicar Veículo"}
        </Button>
      </div>
    </form>
  );
}
