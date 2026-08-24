import { Vehicle, Lead, DashboardStats, VehicleStatus, LeadStatus } from "./types";
import { INITIAL_VEHICLES } from "./initial-data";

const VEHICLES_STORAGE_KEY = "cm_veiculos_data_v1";
const LEADS_STORAGE_KEY = "cm_leads_data_v1";

const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-1",
    name: "Carlos Eduardo Mendes",
    phone: "(86) 99841-2233",
    email: "carlos.mendes@gmail.com",
    vehicleId: "veh-1",
    vehicleName: "Honda HR-V EXL",
    message: "Tenho interesse no Honda HR-V. Gostaria de simular entrada de R$ 30.000.",
    status: "em_atendimento",
    createdAt: "2026-08-23T14:15:00.000Z",
  },
  {
    id: "lead-2",
    name: "Mariana Albuquerque",
    phone: "(86) 99455-8899",
    email: "mariana.albuquerque@hotmail.com",
    vehicleId: "veh-2",
    vehicleName: "Toyota Corolla XEi",
    message: "Aceita carro seminovo na troca (HB20 2019)?",
    status: "novo",
    createdAt: "2026-08-24T10:30:00.000Z",
  },
  {
    id: "lead-3",
    name: "Fernando Vasconcelos",
    phone: "(86) 98112-7744",
    email: "f.vasconcelos@outlook.com",
    vehicleId: "veh-4",
    vehicleName: "VW Polo Highline",
    message: "Gostaria de agendar um test drive para esta tarde.",
    status: "novo",
    createdAt: "2026-08-24T11:45:00.000Z",
  }
];

// Helper to create URL friendly slug
export function generateSlug(name: string, year?: number, id?: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  
  const yearSuffix = year ? `-${year}` : "";
  const randomSuffix = id ? `-${id.slice(-4)}` : `-${Math.random().toString(36).substring(2, 6)}`;
  return `${base}${yearSuffix}${randomSuffix}`;
}

// In-memory fallback for SSR/server environment
let memoryVehicles: Vehicle[] = [...INITIAL_VEHICLES];
let memoryLeads: Lead[] = [...INITIAL_LEADS];

// Event listeners for real-time reactivity across components
type StoreListener = () => void;
const listeners = new Set<StoreListener>();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error("Store listener error:", e);
    }
  });
}

export function subscribeToStore(listener: StoreListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// --- VEHICLES STORAGE METHODS ---
export function getVehiclesFromStorage(): Vehicle[] {
  if (typeof window === "undefined") {
    return memoryVehicles;
  }
  try {
    const raw = localStorage.getItem(VEHICLES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(INITIAL_VEHICLES));
      return INITIAL_VEHICLES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading vehicles from storage:", e);
    return memoryVehicles;
  }
}

export function saveVehiclesToStorage(vehicles: Vehicle[]) {
  memoryVehicles = vehicles;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehicles));
    } catch (e) {
      console.error("Error writing vehicles to storage:", e);
    }
  }
  notifyListeners();
}

// --- LEADS STORAGE METHODS ---
export function getLeadsFromStorage(): Lead[] {
  if (typeof window === "undefined") {
    return memoryLeads;
  }
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(INITIAL_LEADS));
      return INITIAL_LEADS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading leads from storage:", e);
    return memoryLeads;
  }
}

export function saveLeadsToStorage(leads: Lead[]) {
  memoryLeads = leads;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    } catch (e) {
      console.error("Error writing leads to storage:", e);
    }
  }
  notifyListeners();
}

// --- VEHICLES CRUD API ---

export function getPublicVehicles(filters?: {
  category?: string;
  brand?: string;
  status?: VehicleStatus;
  onlyFeatured?: boolean;
  search?: string;
  maxPrice?: number;
  year?: number;
}): Vehicle[] {
  const all = getVehiclesFromStorage();
  return all.filter((v) => {
    if (filters?.onlyFeatured && !v.isFeatured) return false;
    if (filters?.status && v.status !== filters.status) return false;
    if (filters?.category && filters.category !== "todos" && filters.category !== "todas" && v.category !== filters.category) return false;
    if (filters?.brand && filters.brand !== "todas" && v.brand.toLowerCase() !== filters.brand.toLowerCase()) return false;
    if (filters?.maxPrice && v.price > filters.maxPrice) return false;
    if (filters?.year && v.modelYear !== filters.year) return false;
    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      const match = 
        v.name.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.version.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}

export function getVehicleBySlug(slug: string): Vehicle | undefined {
  const all = getVehiclesFromStorage();
  return all.find((v) => v.slug === slug || v.id === slug);
}

export function getVehicleById(id: string): Vehicle | undefined {
  const all = getVehiclesFromStorage();
  return all.find((v) => v.id === id);
}

export function createVehicle(data: Omit<Vehicle, "id" | "slug" | "createdAt" | "updatedAt">): Vehicle {
  const all = getVehiclesFromStorage();
  const id = `veh-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const slug = generateSlug(data.name || `${data.brand} ${data.model}`, data.modelYear, id);
  
  const newVehicle: Vehicle = {
    ...data,
    id,
    slug,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [newVehicle, ...all];
  saveVehiclesToStorage(updated);
  return newVehicle;
}

export function updateVehicle(id: string, data: Partial<Omit<Vehicle, "id" | "createdAt">>): Vehicle | null {
  const all = getVehiclesFromStorage();
  const index = all.findIndex((v) => v.id === id);
  if (index === -1) return null;

  const existing = all[index]!;
  const updatedVehicle = {
    ...existing,
    ...data,
    updatedAt: new Date().toISOString(),
  } as Vehicle;

  all[index] = updatedVehicle;
  saveVehiclesToStorage([...all]);
  return updatedVehicle;
}



export function deleteVehicle(id: string): boolean {
  const all = getVehiclesFromStorage();
  const filtered = all.filter((v) => v.id !== id);
  if (filtered.length === all.length) return false;
  saveVehiclesToStorage(filtered);
  return true;
}

export function toggleVehicleFeatured(id: string): boolean {
  const all = getVehiclesFromStorage();
  const v = all.find((item) => item.id === id);
  if (!v) return false;
  v.isFeatured = !v.isFeatured;
  v.updatedAt = new Date().toISOString();
  saveVehiclesToStorage([...all]);
  return v.isFeatured;
}

export function updateVehicleStatus(id: string, status: VehicleStatus): boolean {
  const all = getVehiclesFromStorage();
  const v = all.find((item) => item.id === id);
  if (!v) return false;
  v.status = status;
  v.updatedAt = new Date().toISOString();
  saveVehiclesToStorage([...all]);
  return true;
}

// --- LEADS CRUD API ---

export function createLead(data: {
  name: string;
  phone: string;
  email?: string;
  vehicleId?: string;
  vehicleName?: string;
  message?: string;
}): Lead {
  const all = getLeadsFromStorage();
  const newLead: Lead = {
    id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: data.name.trim(),
    phone: data.phone.trim(),
    ...(data.email ? { email: data.email.trim() } : {}),
    ...(data.vehicleId ? { vehicleId: data.vehicleId } : {}),
    ...(data.vehicleName ? { vehicleName: data.vehicleName } : {}),
    ...(data.message ? { message: data.message.trim() } : {}),
    status: "novo",
    createdAt: new Date().toISOString(),
  };


  const updated = [newLead, ...all];
  saveLeadsToStorage(updated);
  return newLead;
}

export function updateLeadStatus(id: string, status: LeadStatus): boolean {
  const all = getLeadsFromStorage();
  const lead = all.find((l) => l.id === id);
  if (!lead) return false;
  lead.status = status;
  saveLeadsToStorage([...all]);
  return true;
}

export function deleteLead(id: string): boolean {
  const all = getLeadsFromStorage();
  const filtered = all.filter((l) => l.id !== id);
  if (filtered.length === all.length) return false;
  saveLeadsToStorage(filtered);
  return true;
}

// --- DASHBOARD STATS ---

export function getDashboardStats(): DashboardStats {
  const vehicles = getVehiclesFromStorage();
  const leads = getLeadsFromStorage();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyLeads = leads.filter((l) => {
    const d = new Date(l.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  return {
    totalVehicles: vehicles.length,
    availableVehicles: vehicles.filter((v) => v.status === "disponivel").length,
    reservedVehicles: vehicles.filter((v) => v.status === "reservado").length,
    soldVehicles: vehicles.filter((v) => v.status === "vendido").length,
    featuredVehicles: vehicles.filter((v) => v.isFeatured).length,
    monthlyLeads,
    totalLeads: leads.length,
  };
}

// --- FORMATTERS ---

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMileage(km: number): string {
  return `${new Intl.NumberFormat("pt-BR").format(km)} km`;
}

export function formatDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return isoDate;
  }
}
