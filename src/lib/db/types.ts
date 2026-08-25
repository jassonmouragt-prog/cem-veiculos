export type VehicleCategory =
  "suv" | "sedan" | "hatch" | "picape" | "moto" | "utilitario" | "coupe" | "perua";

export type FuelType = "flex" | "gasolina" | "diesel" | "hibrido" | "eletrico";

export type TransmissionType = "manual" | "automatico" | "automatizado" | "cvt";

export type VehicleStatus = "disponivel" | "reservado" | "vendido";

export interface Vehicle {
  id: string;
  slug: string;
  name: string;
  brand: string;
  model: string;
  version: string;
  manufacturingYear: number;
  modelYear: number;
  category: VehicleCategory;
  engine: string;
  fuel: FuelType;
  transmission: TransmissionType;
  powerHp?: number;
  mileage: number;
  price: number;
  entryValue?: number;
  installmentsCount?: number;
  installmentValue?: number;
  acceptsTrade: boolean;
  acceptsFinancing: boolean;
  color: string;
  doors: number;
  features: string[];
  singleOwner: boolean;
  dealerMaintained: boolean;
  description: string;
  images: string[];
  mainImageIndex: number;
  status: VehicleStatus;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus = "novo" | "em_atendimento" | "concluido" | "descartado";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  vehicleId?: string;
  vehicleName?: string;
  message?: string;
  status: LeadStatus;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin";
}

export interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  reservedVehicles: number;
  soldVehicles: number;
  featuredVehicles: number;
  monthlyLeads: number;
  totalLeads: number;
}
