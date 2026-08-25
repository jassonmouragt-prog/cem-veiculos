import { supabase } from "@/integrations/supabase/client";
import { Vehicle, Lead, DashboardStats, VehicleStatus, LeadStatus } from "./types";
import { INITIAL_VEHICLES } from "./initial-data";

const LEGACY_VEHICLES_KEY = "cm_veiculos_data_v1";
const LEGACY_LEADS_KEY = "cm_leads_data_v1";
const MIGRATION_FLAG_KEY = "cm_supabase_migrated_v1";

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

// --- CACHE + REACTIVITY ---

let cachedVehicles: Vehicle[] = [];
let cachedLeads: Lead[] = [];
let loaded = false;
let loadingPromise: Promise<void> | null = null;

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

export function isStoreLoaded(): boolean {
  return loaded;
}

export function subscribeToStore(listener: StoreListener): () => void {
  listeners.add(listener);
  void loadStore();
  return () => {
    listeners.delete(listener);
  };
}

// --- MAPPERS ---

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapVehicle(row: any): Vehicle {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand ?? "",
    model: row.model ?? "",
    version: row.version ?? "",
    manufacturingYear: row.manufacturing_year ?? 0,
    modelYear: row.model_year ?? 0,
    category: row.category,
    engine: row.engine ?? "",
    fuel: row.fuel,
    transmission: row.transmission,
    ...(row.power_hp !== null && row.power_hp !== undefined
      ? { powerHp: Number(row.power_hp) }
      : {}),
    mileage: Number(row.mileage ?? 0),
    price: Number(row.price ?? 0),
    ...(row.entry_value !== null && row.entry_value !== undefined
      ? { entryValue: Number(row.entry_value) }
      : {}),
    ...(row.installments_count !== null && row.installments_count !== undefined
      ? { installmentsCount: Number(row.installments_count) }
      : {}),
    ...(row.installment_value !== null && row.installment_value !== undefined
      ? { installmentValue: Number(row.installment_value) }
      : {}),
    acceptsTrade: !!row.accepts_trade,
    acceptsFinancing: !!row.accepts_financing,
    color: row.color ?? "",
    doors: row.doors ?? 4,
    features: row.features ?? [],
    singleOwner: !!row.single_owner,
    dealerMaintained: !!row.dealer_maintained,
    description: row.description ?? "",
    images: row.images ?? [],
    mainImageIndex: row.main_image_index ?? 0,
    status: row.status,
    isFeatured: !!row.is_featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toVehicleRow(data: Partial<Vehicle>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  const set = (key: string, value: unknown) => {
    if (value !== undefined) row[key] = value;
  };
  set("slug", data.slug);
  set("name", data.name);
  set("brand", data.brand);
  set("model", data.model);
  set("version", data.version);
  set("manufacturing_year", data.manufacturingYear);
  set("model_year", data.modelYear);
  set("category", data.category);
  set("engine", data.engine);
  set("fuel", data.fuel);
  set("transmission", data.transmission);
  set("power_hp", data.powerHp ?? null);
  set("mileage", data.mileage);
  set("price", data.price);
  set("entry_value", data.entryValue ?? null);
  set("installments_count", data.installmentsCount ?? null);
  set("installment_value", data.installmentValue ?? null);
  set("accepts_trade", data.acceptsTrade);
  set("accepts_financing", data.acceptsFinancing);
  set("color", data.color);
  set("doors", data.doors);
  set("features", data.features);
  set("single_owner", data.singleOwner);
  set("dealer_maintained", data.dealerMaintained);
  set("description", data.description);
  set("images", data.images);
  set("main_image_index", data.mainImageIndex);
  set("status", data.status);
  set("is_featured", data.isFeatured);
  return row;
}

function mapLead(row: any): Lead {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    ...(row.email ? { email: row.email } : {}),
    ...(row.vehicle_id ? { vehicleId: row.vehicle_id } : {}),
    ...(row.vehicle_name ? { vehicleName: row.vehicle_name } : {}),
    ...(row.message ? { message: row.message } : {}),
    status: row.status,
    createdAt: row.created_at,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// --- LOADING ---

export async function loadStore(force = false): Promise<void> {
  if (loaded && !force) return;
  if (loadingPromise && !force) return loadingPromise;

  loadingPromise = (async () => {
    const [vehiclesRes, leadsRes] = await Promise.all([
      supabase.from("vehicles").select("*").order("created_at", { ascending: false }),
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
    ]);

    if (vehiclesRes.error) {
      console.error("Erro ao carregar veículos:", vehiclesRes.error);
    } else {
      cachedVehicles = (vehiclesRes.data ?? []).map(mapVehicle);
    }

    // Leads are admin-only; a permission error simply keeps the list empty.
    if (!leadsRes.error) {
      cachedLeads = (leadsRes.data ?? []).map(mapLead);
    }

    loaded = true;
    notifyListeners();
  })();

  try {
    await loadingPromise;
  } finally {
    loadingPromise = null;
  }
}

export async function refreshStore(): Promise<void> {
  await loadStore(true);
}

// --- VEHICLES READ API (synchronous, from cache) ---

export function getVehiclesFromStorage(): Vehicle[] {
  return cachedVehicles;
}

export function getLeadsFromStorage(): Lead[] {
  return cachedLeads;
}

export function getPublicVehicles(filters?: {
  category?: string;
  brand?: string;
  status?: VehicleStatus;
  onlyFeatured?: boolean;
  search?: string;
  maxPrice?: number;
  year?: number;
}): Vehicle[] {
  return cachedVehicles.filter((v) => {
    if (filters?.onlyFeatured && !v.isFeatured) return false;
    if (filters?.status && v.status !== filters.status) return false;
    if (
      filters?.category &&
      filters.category !== "todos" &&
      filters.category !== "todas" &&
      v.category !== filters.category
    )
      return false;
    if (
      filters?.brand &&
      filters.brand !== "todas" &&
      v.brand.toLowerCase() !== filters.brand.toLowerCase()
    )
      return false;
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
  return cachedVehicles.find((v) => v.slug === slug || v.id === slug);
}

export function getVehicleById(id: string): Vehicle | undefined {
  return cachedVehicles.find((v) => v.id === id);
}

// --- VEHICLES WRITE API ---

export async function createVehicle(
  data: Omit<Vehicle, "id" | "slug" | "createdAt" | "updatedAt">,
): Promise<Vehicle> {
  const slug = generateSlug(data.name || `${data.brand} ${data.model}`, data.modelYear);
  const { data: row, error } = await supabase
    .from("vehicles")
    .insert(toVehicleRow({ ...data, slug }) as never)
    .select("*")
    .single();

  if (error) throw error;
  const vehicle = mapVehicle(row);
  cachedVehicles = [vehicle, ...cachedVehicles];
  notifyListeners();
  return vehicle;
}

export async function updateVehicle(
  id: string,
  data: Partial<Omit<Vehicle, "id" | "createdAt">>,
): Promise<Vehicle | null> {
  const { data: row, error } = await supabase
    .from("vehicles")
    .update(toVehicleRow(data) as never)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  const vehicle = mapVehicle(row);
  cachedVehicles = cachedVehicles.map((v) => (v.id === id ? vehicle : v));
  notifyListeners();
  return vehicle;
}

export async function deleteVehicle(id: string): Promise<boolean> {
  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) throw error;
  cachedVehicles = cachedVehicles.filter((v) => v.id !== id);
  notifyListeners();
  return true;
}

export async function toggleVehicleFeatured(id: string): Promise<boolean> {
  const current = getVehicleById(id);
  if (!current) return false;
  const next = !current.isFeatured;
  await updateVehicle(id, { isFeatured: next });
  return next;
}

export async function updateVehicleStatus(id: string, status: VehicleStatus): Promise<boolean> {
  await updateVehicle(id, { status });
  return true;
}

// --- LEADS API ---

export async function createLead(data: {
  name: string;
  phone: string;
  email?: string;
  vehicleId?: string;
  vehicleName?: string;
  message?: string;
}): Promise<Lead> {
  const payload = {
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: data.email?.trim() ?? null,
    vehicle_id: data.vehicleId ?? null,
    vehicle_name: data.vehicleName ?? null,
    message: data.message?.trim() ?? null,
  };

  const { data: row, error } = await supabase
    .from("leads")
    .insert(payload as never)
    .select("*")
    .single();

  if (error) throw error;
  const lead = mapLead(row);
  cachedLeads = [lead, ...cachedLeads];
  notifyListeners();
  return lead;
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<boolean> {
  const { error } = await supabase
    .from("leads")
    .update({ status } as never)
    .eq("id", id);
  if (error) throw error;
  cachedLeads = cachedLeads.map((l) => (l.id === id ? { ...l, status } : l));
  notifyListeners();
  return true;
}

export async function deleteLead(id: string): Promise<boolean> {
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw error;
  cachedLeads = cachedLeads.filter((l) => l.id !== id);
  notifyListeners();
  return true;
}

// --- ONE-TIME MIGRATION FROM LOCALSTORAGE ---

export async function migrateLegacyLocalData(): Promise<number> {
  if (typeof window === "undefined") return 0;
  if (localStorage.getItem(MIGRATION_FLAG_KEY)) return 0;

  await loadStore();
  if (cachedVehicles.length > 0) {
    localStorage.setItem(MIGRATION_FLAG_KEY, "done");
    return 0;
  }

  let legacy: Vehicle[] = [];
  try {
    const raw = localStorage.getItem(LEGACY_VEHICLES_KEY);
    legacy = raw ? (JSON.parse(raw) as Vehicle[]) : [];
  } catch {
    legacy = [];
  }

  const source = legacy.length > 0 ? legacy : INITIAL_VEHICLES;
  const rows = source.map((v) =>
    toVehicleRow({ ...v, slug: v.slug || generateSlug(v.name, v.modelYear, v.id) }),
  );

  const { error } = await supabase.from("vehicles").insert(rows as never);
  if (error) {
    console.error("Falha ao migrar veículos locais:", error);
    return 0;
  }

  // Legacy leads (best effort, without vehicle links)
  try {
    const rawLeads = localStorage.getItem(LEGACY_LEADS_KEY);
    const legacyLeads = rawLeads ? (JSON.parse(rawLeads) as Lead[]) : [];
    if (legacyLeads.length > 0) {
      await supabase.from("leads").insert(
        legacyLeads.map((l) => ({
          name: l.name,
          phone: l.phone,
          email: l.email ?? null,
          vehicle_name: l.vehicleName ?? null,
          message: l.message ?? null,
          status: l.status,
        })) as never,
      );
    }
  } catch (e) {
    console.error("Falha ao migrar leads locais:", e);
  }

  localStorage.setItem(MIGRATION_FLAG_KEY, "done");
  await refreshStore();
  return source.length;
}

// --- DASHBOARD STATS ---

export function getDashboardStats(): DashboardStats {
  const vehicles = cachedVehicles;
  const leads = cachedLeads;

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
