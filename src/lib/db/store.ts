import { supabase } from "@/integrations/supabase/client";
import {
  Vehicle,
  Lead,
  DashboardStats,
  VehicleStatus,
  LeadStatus,
  Seller,
  Sale,
  FinancialTransaction,
  VehicleExpense,
  FinancialDashboardStats,
  SellerReport,
  VehicleProfitability,
  TransactionType,
  TransactionCategory,
  PaymentMethod,
  PaymentStatus,
  CommissionStatus,
  SaleStatus,
} from "./types";
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
let cachedSellers: Seller[] = [];
let cachedSales: Sale[] = [];
let cachedTransactions: FinancialTransaction[] = [];
let cachedExpenses: VehicleExpense[] = [];
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

function mapSeller(row: any): Seller {
  return {
    id: row.id,
    userId: row.user_id ?? undefined,
    name: row.name,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    commissionRate: Number(row.commission_rate ?? 0),
    isActive: !!row.is_active,
    canReceiveCommission: !!row.can_receive_commission,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapSale(row: any): Sale {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    sellerId: row.seller_id ?? undefined,
    announcedPrice: Number(row.announced_price ?? 0),
    finalPrice: Number(row.final_price ?? 0),
    discountAmount: Number(row.discount_amount ?? 0),
    discountPercent: Number(row.discount_percent ?? 0),
    hadNegotiation: !!row.had_negotiation,
    acquisitionCost: Number(row.acquisition_cost ?? 0),
    totalExpenses: Number(row.total_expenses ?? 0),
    grossMargin: Number(row.gross_margin ?? 0),
    netMargin: Number(row.net_margin ?? 0),
    commissionRate: Number(row.commission_rate ?? 0),
    commissionValue: Number(row.commission_value ?? 0),
    paymentMethod: row.payment_method,
    totalReceived: Number(row.total_received ?? 0),
    totalToReceive: Number(row.total_to_receive ?? 0),
    downPayment: Number(row.down_payment ?? 0),
    financedAmount: Number(row.financed_amount ?? 0),
    saleDate: row.sale_date,
    status: row.status,
    notes: row.notes ?? undefined,
    createdBy: row.created_by ?? undefined,
    updatedBy: row.updated_by ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapTransaction(row: any): FinancialTransaction {
  return {
    id: row.id,
    type: row.type,
    category: row.category,
    description: row.description,
    amount: Number(row.amount ?? 0),
    transactionDate: row.transaction_date,
    dueDate: row.due_date ?? undefined,
    paidDate: row.paid_date ?? undefined,
    paymentMethod: row.payment_method ?? undefined,
    status: row.status,
    vehicleId: row.vehicle_id ?? undefined,
    saleId: row.sale_id ?? undefined,
    sellerId: row.seller_id ?? undefined,
    supplier: row.supplier ?? undefined,
    client: row.client ?? undefined,
    notes: row.notes ?? undefined,
    createdBy: row.created_by ?? undefined,
    updatedBy: row.updated_by ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapExpense(row: any): VehicleExpense {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    description: row.description,
    category: row.category,
    amount: Number(row.amount ?? 0),
    expenseDate: row.expense_date,
    paymentStatus: row.payment_status,
    paidDate: row.paid_date ?? undefined,
    paymentMethod: row.payment_method ?? undefined,
    supplier: row.supplier ?? undefined,
    notes: row.notes ?? undefined,
    createdBy: row.created_by ?? undefined,
    updatedBy: row.updated_by ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// --- LOADING ---

export async function loadStore(force = false): Promise<void> {
  if (loaded && !force) return;
  if (loadingPromise && !force) return loadingPromise;

  loadingPromise = (async () => {
    const [vehiclesRes, leadsRes, sellersRes, salesRes, transactionsRes, expensesRes] =
      await Promise.all([
        supabase.from("vehicles").select("*").order("created_at", { ascending: false }),
        supabase.from("leads").select("*").order("created_at", { ascending: false }),
        supabase.from("sellers").select("*").order("created_at", { ascending: false }),
        supabase.from("sales").select("*").order("sale_date", { ascending: false }),
        supabase
          .from("financial_transactions")
          .select("*")
          .order("transaction_date", { ascending: false }),
        supabase.from("vehicle_expenses").select("*").order("expense_date", { ascending: false }),
      ]);

    if (vehiclesRes.error) {
      console.error("Erro ao carregar veículos:", vehiclesRes.error);
    } else {
      cachedVehicles = (vehiclesRes.data ?? []).map(mapVehicle);
    }

    if (!leadsRes.error) {
      cachedLeads = (leadsRes.data ?? []).map(mapLead);
    }

    if (!sellersRes.error) {
      cachedSellers = (sellersRes.data ?? []).map(mapSeller);
    }

    if (!salesRes.error) {
      cachedSales = (salesRes.data ?? []).map(mapSale);
    }

    if (!transactionsRes.error) {
      cachedTransactions = (transactionsRes.data ?? []).map(mapTransaction);
    }

    if (!expensesRes.error) {
      cachedExpenses = (expensesRes.data ?? []).map(mapExpense);
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

// ============================================
// SELLERS (VENDEDORES) API
// ============================================

export function getSellersFromStorage(): Seller[] {
  return cachedSellers;
}

export function getSellerById(id: string): Seller | undefined {
  return cachedSellers.find((s) => s.id === id);
}

export function getActiveSellers(): Seller[] {
  return cachedSellers.filter((s) => s.isActive && s.canReceiveCommission);
}

export async function createSeller(data: {
  userId?: string;
  name: string;
  email?: string;
  phone?: string;
  commissionRate: number;
  isActive?: boolean;
  canReceiveCommission?: boolean;
}): Promise<Seller> {
  const { supabase } = await import("@/integrations/supabase/client");

  const { data: row, error } = await supabase
    .from("sellers")
    .insert({
      user_id: data.userId,
      name: data.name,
      email: data.email ?? null,
      phone: data.phone ?? null,
      commission_rate: data.commissionRate,
      is_active: data.isActive ?? true,
      can_receive_commission: data.canReceiveCommission ?? true,
    } as never)
    .select("*")
    .single();

  if (error) throw error;
  const seller = mapSeller(row);
  cachedSellers = [seller, ...cachedSellers];
  notifyListeners();
  return seller;
}

export async function updateSeller(
  id: string,
  data: Partial<Omit<Seller, "id" | "createdAt">>,
): Promise<Seller | null> {
  const { supabase } = await import("@/integrations/supabase/client");

  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.commissionRate !== undefined) updateData.commission_rate = data.commissionRate;
  if (data.isActive !== undefined) updateData.is_active = data.isActive;
  if (data.canReceiveCommission !== undefined)
    updateData.can_receive_commission = data.canReceiveCommission;

  const { data: row, error } = await supabase
    .from("sellers")
    .update(updateData as never)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  const seller = mapSeller(row);
  cachedSellers = cachedSellers.map((s) => (s.id === id ? seller : s));
  notifyListeners();
  return seller;
}

export async function deleteSeller(id: string): Promise<boolean> {
  const { supabase } = await import("@/integrations/supabase/client");

  const { error } = await supabase.from("sellers").delete().eq("id", id);
  if (error) throw error;
  cachedSellers = cachedSellers.filter((s) => s.id !== id);
  notifyListeners();
  return true;
}

// ============================================
// SALES (VENDAS) API
// ============================================

export function getSalesFromStorage(): Sale[] {
  return cachedSales;
}

export function getSaleById(id: string): Sale | undefined {
  return cachedSales.find((s) => s.id === id);
}

export function getSaleByVehicleId(vehicleId: string): Sale | undefined {
  return cachedSales.find((s) => s.vehicleId === vehicleId);
}

export async function createSale(data: {
  vehicleId: string;
  sellerId?: string;
  announcedPrice: number;
  finalPrice: number;
  hadNegotiation: boolean;
  acquisitionCost: number;
  totalExpenses: number;
  commissionRate: number;
  paymentMethod: PaymentMethod;
  downPayment: number;
  financedAmount: number;
  notes?: string;
  createdBy?: string;
}): Promise<Sale> {
  const discountAmount = data.announcedPrice - data.finalPrice;
  const discountPercent =
    data.announcedPrice > 0 ? (discountAmount / data.announcedPrice) * 100 : 0;
  const commissionValue = (data.finalPrice * data.commissionRate) / 100;
  const grossMargin = data.finalPrice - data.acquisitionCost - data.totalExpenses;
  const netMargin = grossMargin - commissionValue;
  const totalReceived = data.downPayment;
  const totalToReceive = data.financedAmount;

  const { data: row, error } = await supabase
    .from("sales")
    .insert({
      vehicle_id: data.vehicleId,
      seller_id: data.sellerId ?? null,
      announced_price: data.announcedPrice,
      final_price: data.finalPrice,
      discount_amount: discountAmount,
      discount_percent: discountPercent,
      had_negotiation: data.hadNegotiation,
      acquisition_cost: data.acquisitionCost,
      total_expenses: data.totalExpenses,
      commission_rate: data.commissionRate,
      commission_value: commissionValue,
      payment_method: data.paymentMethod,
      total_received: totalReceived,
      total_to_receive: totalToReceive,
      down_payment: data.downPayment,
      financed_amount: data.financedAmount,
      notes: data.notes ?? null,
      created_by: data.createdBy ?? null,
    } as never)
    .select("*")
    .single();

  if (error) throw error;
  const sale = mapSale(row);
  cachedSales = [sale, ...cachedSales];
  notifyListeners();
  return sale;
}

export async function updateSale(
  id: string,
  data: Partial<Omit<Sale, "id" | "createdAt">>,
): Promise<Sale | null> {
  const updateData: Record<string, unknown> = {};
  if (data.sellerId !== undefined) updateData.seller_id = data.sellerId;
  if (data.announcedPrice !== undefined) updateData.announced_price = data.announcedPrice;
  if (data.finalPrice !== undefined) updateData.final_price = data.finalPrice;
  if (data.hadNegotiation !== undefined) updateData.had_negotiation = data.hadNegotiation;
  if (data.acquisitionCost !== undefined) updateData.acquisition_cost = data.acquisitionCost;
  if (data.totalExpenses !== undefined) updateData.total_expenses = data.totalExpenses;
  if (data.commissionRate !== undefined) updateData.commission_rate = data.commissionRate;
  if (data.paymentMethod !== undefined) updateData.payment_method = data.paymentMethod;
  if (data.downPayment !== undefined) updateData.down_payment = data.downPayment;
  if (data.financedAmount !== undefined) updateData.financed_amount = data.financedAmount;
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.updatedBy !== undefined) updateData.updated_by = data.updatedBy;

  // Recalculate derived fields if price/expenses changed
  const existing = getSaleById(id);
  if (existing) {
    const finalPrice = data.finalPrice ?? existing.finalPrice;
    const announcedPrice = data.announcedPrice ?? existing.announcedPrice;
    const acquisitionCost = data.acquisitionCost ?? existing.acquisitionCost;
    const totalExpenses = data.totalExpenses ?? existing.totalExpenses;
    const commissionRate = data.commissionRate ?? existing.commissionRate;

    if (data.finalPrice !== undefined || data.announcedPrice !== undefined) {
      updateData.discount_amount = announcedPrice - finalPrice;
      updateData.discount_percent =
        announcedPrice > 0 ? ((announcedPrice - finalPrice) / announcedPrice) * 100 : 0;
    }
    if (data.finalPrice !== undefined || data.commissionRate !== undefined) {
      updateData.commission_value = (finalPrice * commissionRate) / 100;
    }
    if (
      data.finalPrice !== undefined ||
      data.acquisitionCost !== undefined ||
      data.totalExpenses !== undefined ||
      data.commissionRate !== undefined
    ) {
      const commissionValue = (finalPrice * commissionRate) / 100;
      const grossMargin = finalPrice - acquisitionCost - totalExpenses;
      updateData.gross_margin = grossMargin;
      updateData.net_margin = grossMargin - commissionValue;
    }
  }

  const { data: row, error } = await supabase
    .from("sales")
    .update(updateData as never)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  const sale = mapSale(row);
  cachedSales = cachedSales.map((s) => (s.id === id ? sale : s));
  notifyListeners();
  return sale;
}

export async function cancelSale(id: string, updatedBy?: string): Promise<boolean> {
  const { error } = await supabase
    .from("sales")
    .update({ status: "cancelada", updated_by: updatedBy ?? null } as never)
    .eq("id", id);
  if (error) throw error;
  cachedSales = cachedSales.map((s) =>
    s.id === id ? { ...s, status: "cancelada" as SaleStatus } : s,
  );
  notifyListeners();
  return true;
}

export async function resetAllSales(createdBy?: string): Promise<number> {
  const { supabase } = await import("@/integrations/supabase/client");

  const saleIds = cachedSales.map((s) => s.id);

  await supabase.from("financial_transactions").delete().in("sale_id", saleIds);
  await supabase.from("sales").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const vehicleIds = cachedSales.map((s) => s.vehicleId);
  await supabase
    .from("vehicles")
    .update({ status: "disponivel" } as never)
    .in("id", vehicleIds);

  cachedSales = [];
  cachedTransactions = cachedTransactions.filter((t) => !saleIds.includes(t.saleId ?? ""));
  cachedVehicles = cachedVehicles.map((v) =>
    vehicleIds.includes(v.id) ? { ...v, status: "disponivel" as VehicleStatus } : v,
  );
  notifyListeners();

  return saleIds.length;
}

// ============================================
// FINALIZAR VENDA - FLUXO PRINCIPAL
// ============================================

export interface FinalizeSaleData {
  vehicleId: string;
  finalPrice: number;
  hadNegotiation: boolean;
  sellerId: string;
  commissionRate: number;
  paymentMethod: PaymentMethod;
  downPayment: number;
  financedAmount: number;
  notes?: string;
  createdBy?: string;
}

export async function finalizeSale(data: FinalizeSaleData): Promise<Sale> {
  const vehicle = getVehicleById(data.vehicleId);
  if (!vehicle) throw new Error("Veículo não encontrado");

  if (vehicle.status === "vendido") {
    const existingSale = getSaleByVehicleId(data.vehicleId);
    if (existingSale) throw new Error("Veículo já foi vendido");
  }

  // Calcular despesas do veículo
  const expenses = getExpensesByVehicle(data.vehicleId);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const acquisitionCost = vehicle.acquisitionCost ?? 0;

  const sale = await createSale({
    vehicleId: data.vehicleId,
    sellerId: data.sellerId,
    announcedPrice: vehicle.price,
    finalPrice: data.finalPrice,
    hadNegotiation: data.hadNegotiation,
    acquisitionCost,
    totalExpenses,
    commissionRate: data.commissionRate,
    paymentMethod: data.paymentMethod,
    downPayment: data.downPayment,
    financedAmount: data.financedAmount,
    notes: data.notes,
    createdBy: data.createdBy,
  });

  // Atualizar status do veículo
  await updateVehicle(data.vehicleId, { status: "vendido" });

  // Criar transação financeira de entrada (venda)
  await createFinancialTransaction({
    type: "entrada",
    category: "venda_veiculo",
    description: `Venda de ${vehicle.name}`,
    amount: data.finalPrice,
    transactionDate: new Date().toISOString(),
    paymentMethod: data.paymentMethod,
    status: data.downPayment > 0 ? "pago" : "pendente",
    paidDate: data.downPayment > 0 ? new Date().toISOString() : undefined,
    vehicleId: data.vehicleId,
    saleId: sale.id,
    sellerId: data.sellerId,
    client: vehicle.name,
    notes: data.notes,
    createdBy: data.createdBy,
  });

  // Se houve entrada, registrar como recebida
  if (data.downPayment > 0) {
    await createFinancialTransaction({
      type: "entrada",
      category: "sinal_veiculo",
      description: `Sinal da venda de ${vehicle.name}`,
      amount: data.downPayment,
      transactionDate: new Date().toISOString(),
      paymentMethod: data.paymentMethod,
      status: "pago",
      paidDate: new Date().toISOString(),
      vehicleId: data.vehicleId,
      saleId: sale.id,
      client: vehicle.name,
      notes: "Entrada da venda",
      createdBy: data.createdBy,
    });
  }

  // Se há financiado, criar conta a receber
  if (data.financedAmount > 0) {
    await createFinancialTransaction({
      type: "entrada",
      category: "recebimento_financiamento",
      description: `Financiamento da venda de ${vehicle.name}`,
      amount: data.financedAmount,
      transactionDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
      paymentMethod: data.paymentMethod,
      status: "pendente",
      vehicleId: data.vehicleId,
      saleId: sale.id,
      client: vehicle.name,
      notes: "Valor financiado a receber",
      createdBy: data.createdBy,
    });
  }

  // Criar comissão do vendedor
  if (data.commissionRate > 0) {
    const seller = getSellerById(data.sellerId);
    await createFinancialTransaction({
      type: "saida",
      category: "comissao",
      description: `Comissão - ${seller?.name || "Vendedor"} - ${vehicle.name}`,
      amount: sale.commissionValue,
      transactionDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 dias
      paymentMethod: "transferencia",
      status: "pendente",
      vehicleId: data.vehicleId,
      saleId: sale.id,
      sellerId: data.sellerId,
      supplier: seller?.name,
      notes: `Comissão de ${data.commissionRate}% sobre R$ ${formatCurrency(data.finalPrice)}`,
      createdBy: data.createdBy,
    });
  }

  return sale;
}

// ============================================
// FINANCIAL TRANSACTIONS API
// ============================================

export function getTransactionsFromStorage(): FinancialTransaction[] {
  return cachedTransactions;
}

export function getTransactionsByType(type: TransactionType): FinancialTransaction[] {
  return cachedTransactions.filter((t) => t.type === type);
}

export function getTransactionsByCategory(category: TransactionCategory): FinancialTransaction[] {
  return cachedTransactions.filter((t) => t.category === category);
}

export function getTransactionsBySale(saleId: string): FinancialTransaction[] {
  return cachedTransactions.filter((t) => t.saleId === saleId);
}

export function getTransactionsByVehicle(vehicleId: string): FinancialTransaction[] {
  return cachedTransactions.filter((t) => t.vehicleId === vehicleId);
}

export function getTransactionsBySeller(sellerId: string): FinancialTransaction[] {
  return cachedTransactions.filter((t) => t.sellerId === sellerId);
}

export async function createFinancialTransaction(data: {
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  amount: number;
  transactionDate: string;
  dueDate?: string;
  paidDate?: string;
  paymentMethod?: PaymentMethod;
  status?: PaymentStatus;
  vehicleId?: string;
  saleId?: string;
  sellerId?: string;
  supplier?: string;
  client?: string;
  notes?: string;
  createdBy?: string;
}): Promise<FinancialTransaction> {
  const { data: row, error } = await supabase
    .from("financial_transactions")
    .insert({
      type: data.type,
      category: data.category,
      description: data.description,
      amount: data.amount,
      transaction_date: data.transactionDate,
      due_date: data.dueDate ?? null,
      paid_date: data.paidDate ?? null,
      payment_method: data.paymentMethod ?? null,
      status: data.status ?? "pendente",
      vehicle_id: data.vehicleId ?? null,
      sale_id: data.saleId ?? null,
      seller_id: data.sellerId ?? null,
      supplier: data.supplier ?? null,
      client: data.client ?? null,
      notes: data.notes ?? null,
      created_by: data.createdBy ?? null,
    } as never)
    .select("*")
    .single();

  if (error) throw error;
  const transaction = mapTransaction(row);
  cachedTransactions = [transaction, ...cachedTransactions];
  notifyListeners();
  return transaction;
}

export async function updateFinancialTransaction(
  id: string,
  data: Partial<FinancialTransaction>,
): Promise<FinancialTransaction | null> {
  const updateData: Record<string, unknown> = {};
  if (data.type !== undefined) updateData.type = data.type;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.amount !== undefined) updateData.amount = data.amount;
  if (data.transactionDate !== undefined) updateData.transaction_date = data.transactionDate;
  if (data.dueDate !== undefined) updateData.due_date = data.dueDate;
  if (data.paidDate !== undefined) updateData.paid_date = data.paidDate;
  if (data.paymentMethod !== undefined) updateData.payment_method = data.paymentMethod;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.vehicleId !== undefined) updateData.vehicle_id = data.vehicleId;
  if (data.saleId !== undefined) updateData.sale_id = data.saleId;
  if (data.sellerId !== undefined) updateData.seller_id = data.sellerId;
  if (data.supplier !== undefined) updateData.supplier = data.supplier;
  if (data.client !== undefined) updateData.client = data.client;
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.updatedBy !== undefined) updateData.updated_by = data.updatedBy;

  const { data: row, error } = await supabase
    .from("financial_transactions")
    .update(updateData as never)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  const transaction = mapTransaction(row);
  cachedTransactions = cachedTransactions.map((t) => (t.id === id ? transaction : t));
  notifyListeners();
  return transaction;
}

export async function markTransactionAsPaid(
  id: string,
  paidDate?: string,
  updatedBy?: string,
): Promise<FinancialTransaction | null> {
  return updateFinancialTransaction(id, {
    status: "pago",
    paidDate: paidDate ?? new Date().toISOString(),
    updatedBy,
  });
}

export async function deleteFinancialTransaction(id: string): Promise<boolean> {
  const { error } = await supabase.from("financial_transactions").delete().eq("id", id);
  if (error) throw error;
  cachedTransactions = cachedTransactions.filter((t) => t.id !== id);
  notifyListeners();
  return true;
}

// ============================================
// VEHICLE EXPENSES API
// ============================================

export function getExpensesFromStorage(): VehicleExpense[] {
  return cachedExpenses;
}

export function getExpensesByVehicle(vehicleId: string): VehicleExpense[] {
  return cachedExpenses.filter((e) => e.vehicleId === vehicleId);
}

export async function createVehicleExpense(data: {
  vehicleId: string;
  description: string;
  category: TransactionCategory;
  amount: number;
  expenseDate: string;
  paymentStatus?: PaymentStatus;
  paidDate?: string;
  paymentMethod?: PaymentMethod;
  supplier?: string;
  notes?: string;
  createdBy?: string;
}): Promise<VehicleExpense> {
  const { data: row, error } = await supabase
    .from("vehicle_expenses")
    .insert({
      vehicle_id: data.vehicleId,
      description: data.description,
      category: data.category,
      amount: data.amount,
      expense_date: data.expenseDate,
      payment_status: data.paymentStatus ?? "pendente",
      paid_date: data.paidDate ?? null,
      payment_method: data.paymentMethod ?? null,
      supplier: data.supplier ?? null,
      notes: data.notes ?? null,
      created_by: data.createdBy ?? null,
    } as never)
    .select("*")
    .single();

  if (error) throw error;
  const expense = mapExpense(row);
  cachedExpenses = [expense, ...cachedExpenses];
  notifyListeners();
  return expense;
}

export async function updateVehicleExpense(
  id: string,
  data: Partial<VehicleExpense>,
): Promise<VehicleExpense | null> {
  const updateData: Record<string, unknown> = {};
  if (data.description !== undefined) updateData.description = data.description;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.amount !== undefined) updateData.amount = data.amount;
  if (data.expenseDate !== undefined) updateData.expense_date = data.expenseDate;
  if (data.paymentStatus !== undefined) updateData.payment_status = data.paymentStatus;
  if (data.paidDate !== undefined) updateData.paid_date = data.paidDate;
  if (data.paymentMethod !== undefined) updateData.payment_method = data.paymentMethod;
  if (data.supplier !== undefined) updateData.supplier = data.supplier;
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.updatedBy !== undefined) updateData.updated_by = data.updatedBy;

  const { data: row, error } = await supabase
    .from("vehicle_expenses")
    .update(updateData as never)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  const expense = mapExpense(row);
  cachedExpenses = cachedExpenses.map((e) => (e.id === id ? expense : e));
  notifyListeners();
  return expense;
}

export async function deleteVehicleExpense(id: string): Promise<boolean> {
  const { error } = await supabase.from("vehicle_expenses").delete().eq("id", id);
  if (error) throw error;
  cachedExpenses = cachedExpenses.filter((e) => e.id !== id);
  notifyListeners();
  return true;
}

// ============================================
// FINANCIAL DASHBOARD STATS
// ============================================

export function getFinancialDashboardStats(
  periodStart?: string,
  periodEnd?: string,
): FinancialDashboardStats {
  const start = periodStart
    ? new Date(periodStart)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const end = periodEnd ? new Date(periodEnd) : new Date();

  const salesInPeriod = cachedSales.filter((s) => {
    const d = new Date(s.saleDate);
    return d >= start && d <= end && s.status === "concluida";
  });

  const transactionsInPeriod = cachedTransactions.filter((t) => {
    const d = new Date(t.transactionDate);
    return d >= start && d <= end;
  });

  const entries = transactionsInPeriod.filter((t) => t.type === "entrada");
  const exits = transactionsInPeriod.filter((t) => t.type === "saida");

  const totalSales = salesInPeriod.reduce((sum, s) => sum + s.finalPrice, 0);
  const totalSalesCount = salesInPeriod.length;

  const totalReceived = entries
    .filter((t) => t.status === "pago")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalToReceive = entries
    .filter((t) => t.status === "pendente")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPaid = exits.filter((t) => t.status === "pago").reduce((sum, t) => sum + t.amount, 0);

  const totalPayable = exits
    .filter((t) => t.status === "pendente")
    .reduce((sum, t) => sum + t.amount, 0);

  const commissionTransactions = entries.filter((t) => t.category === "comissao");
  const totalCommissionsGenerated = commissionTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalCommissionsPaid = commissionTransactions
    .filter((t) => t.status === "pago")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalCommissionsPending = totalCommissionsGenerated - totalCommissionsPaid;

  const totalCost = salesInPeriod.reduce((sum, s) => sum + s.acquisitionCost + s.totalExpenses, 0);
  const estimatedProfit = totalSales - totalCost - totalCommissionsGenerated;

  const averageMarginPercent = totalSales > 0 ? ((totalSales - totalCost) / totalSales) * 100 : 0;

  return {
    totalSales,
    totalSalesCount,
    totalReceived,
    totalToReceive,
    totalPaid,
    totalPayable,
    totalCommissionsGenerated,
    totalCommissionsPaid,
    totalCommissionsPending,
    estimatedProfit,
    averageMarginPercent,
    periodStart: start.toISOString(),
    periodEnd: end.toISOString(),
  };
}

// ============================================
// SELLER REPORT
// ============================================

export function getSellerReport(
  sellerId: string,
  periodStart?: string,
  periodEnd?: string,
): SellerReport | null {
  const seller = getSellerById(sellerId);
  if (!seller) return null;

  const start = periodStart ? new Date(periodStart) : new Date(0);
  const end = periodEnd ? new Date(periodEnd) : new Date();

  const salesInPeriod = cachedSales.filter((s) => {
    const d = new Date(s.saleDate);
    return s.sellerId === sellerId && d >= start && d <= end && s.status === "concluida";
  });

  if (salesInPeriod.length === 0) {
    return {
      sellerId,
      sellerName: seller.name,
      salesCount: 0,
      totalSold: 0,
      totalCommissionGenerated: 0,
      totalCommissionPaid: 0,
      totalCommissionPending: 0,
      averageTicket: 0,
      averageDiscountPercent: 0,
      averageMarginPercent: 0,
    };
  }

  const totalSold = salesInPeriod.reduce((sum, s) => sum + s.finalPrice, 0);
  const totalCommissionGenerated = salesInPeriod.reduce((sum, s) => sum + s.commissionValue, 0);
  const commissionTransactions = cachedTransactions.filter(
    (t) => t.sellerId === sellerId && t.category === "comissao",
  );
  const totalCommissionPaid = commissionTransactions
    .filter((t) => t.status === "pago")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalCommissionPending = totalCommissionGenerated - totalCommissionPaid;
  const averageTicket = totalSold / salesInPeriod.length;
  const averageDiscountPercent =
    salesInPeriod.reduce((sum, s) => sum + s.discountPercent, 0) / salesInPeriod.length;
  const averageMarginPercent =
    salesInPeriod.reduce((sum, s) => {
      const margin = s.finalPrice - s.acquisitionCost - s.totalExpenses;
      return sum + (s.finalPrice > 0 ? (margin / s.finalPrice) * 100 : 0);
    }, 0) / salesInPeriod.length;

  return {
    sellerId,
    sellerName: seller.name,
    salesCount: salesInPeriod.length,
    totalSold,
    totalCommissionGenerated,
    totalCommissionPaid,
    totalCommissionPending,
    averageTicket,
    averageDiscountPercent,
    averageMarginPercent,
  };
}

export function getAllSellersReport(periodStart?: string, periodEnd?: string): SellerReport[] {
  return getActiveSellers()
    .map((s) => getSellerReport(s.id, periodStart, periodEnd)!)
    .filter(Boolean);
}

// ============================================
// VEHICLE PROFITABILITY
// ============================================

export function getVehicleProfitability(vehicleId: string): VehicleProfitability | null {
  const vehicle = getVehicleById(vehicleId);
  const sale = getSaleByVehicleId(vehicleId);
  if (!vehicle || !sale) return null;

  const seller = sale.sellerId ? getSellerById(sale.sellerId) : undefined;
  const stockEntry = vehicle.stockEntryDate
    ? new Date(vehicle.stockEntryDate)
    : new Date(vehicle.createdAt);
  const saleDate = sale.saleDate ? new Date(sale.saleDate) : new Date();
  const daysInStock = Math.floor(
    (saleDate.getTime() - stockEntry.getTime()) / (1000 * 60 * 60 * 24),
  );

  return {
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    acquisitionCost: vehicle.acquisitionCost ?? 0,
    totalExpenses: sale.totalExpenses,
    totalCost: (vehicle.acquisitionCost ?? 0) + sale.totalExpenses,
    announcedPrice: sale.announcedPrice,
    finalPrice: sale.finalPrice,
    discountAmount: sale.discountAmount,
    discountPercent: sale.discountPercent,
    grossMargin: sale.grossMargin,
    commissionValue: sale.commissionValue,
    netMargin: sale.netMargin,
    marginPercent: sale.finalPrice > 0 ? (sale.netMargin / sale.finalPrice) * 100 : 0,
    daysInStock: Math.max(0, daysInStock),
    sellerName: seller?.name,
    commissionRate: sale.commissionRate,
    saleDate: sale.saleDate,
  };
}

export function getAllVehiclesProfitability(): VehicleProfitability[] {
  return cachedSales
    .filter((s) => s.status === "concluida")
    .map((s) => getVehicleProfitability(s.vehicleId)!)
    .filter(Boolean);
}

// ============================================
// CHART DATA
// ============================================

export function getFluxoFinanceiroChartData(
  period: "day" | "week" | "month" = "month",
  monthsBack = 6,
): ChartDataPoint[] {
  const now = new Date();
  const data: ChartDataPoint[] = [];

  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

    const entries = cachedTransactions.filter((t) => {
      if (t.type !== "entrada") return false;
      const d = new Date(t.transactionDate);
      return d >= date && d < nextMonth;
    });
    const exits = cachedTransactions.filter((t) => {
      if (t.type !== "saida") return false;
      const d = new Date(t.transactionDate);
      return d >= date && d < nextMonth;
    });

    const entradas = entries.reduce((sum, t) => sum + t.amount, 0);
    const saidas = exits.reduce((sum, t) => sum + t.amount, 0);

    data.push({
      period: date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }),
      entradas,
      saidas,
    });
  }

  return data;
}

export function getSalesByMonthChartData(monthsBack = 12, year?: number): SalesByMonthData[] {
  const now = new Date();
  const targetYear = year ?? now.getFullYear();
  const data: SalesByMonthData[] = [];

  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = new Date(targetYear, now.getMonth() - i, 1);
    const nextMonth = new Date(targetYear, now.getMonth() - i + 1, 1);

    const sales = cachedSales.filter((s) => {
      const d = new Date(s.saleDate);
      return s.status === "concluida" && d >= date && d < nextMonth;
    });

    data.push({
      month: date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }),
      count: sales.length,
      value: sales.reduce((sum, s) => sum + s.finalPrice, 0),
    });
  }

  return data;
}

export function getCurrentMonthRevenue(): number {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  return cachedSales
    .filter((s) => {
      const d = new Date(s.saleDate);
      return s.status === "concluida" && d >= startOfMonth && d <= endOfMonth;
    })
    .reduce((sum, s) => sum + s.finalPrice, 0);
}

export function getCurrentMonthExpenses(): number {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  return cachedTransactions
    .filter((t) => {
      const d = new Date(t.transactionDate);
      return t.type === "saida" && d >= startOfMonth && d <= endOfMonth;
    })
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getSalesBySellerChartData(): SalesBySellerData[] {
  return getActiveSellers().map((seller) => {
    const sales = cachedSales.filter((s) => s.sellerId === seller.id && s.status === "concluida");
    return {
      sellerName: seller.name,
      count: sales.length,
      value: sales.reduce((sum, s) => sum + s.finalPrice, 0),
    };
  });
}

export function getExpensesByCategoryChartData(): ExpensesByCategoryData[] {
  const categories: TransactionCategory[] = [
    "operacional",
    "veiculos",
    "marketing",
    "comissao",
    "estrutura",
    "outros",
  ];
  // Since we use specific categories, group them
  const categoryMap: Record<string, number> = {
    Operacionais: 0,
    Veículos: 0,
    Marketing: 0,
    Comissões: 0,
    Estrutura: 0,
    Outros: 0,
  };

  cachedTransactions
    .filter((t) => t.type === "saida")
    .forEach((t) => {
      switch (t.category) {
        case "manutencao":
        case "documentacao":
        case "despachante":
        case "lavagem":
        case "combustivel":
          categoryMap.Operacionais += t.amount;
          break;
        case "compra_veiculo":
          categoryMap.Veículos += t.amount;
          break;
        case "marketing":
        case "trafego_pago":
          categoryMap.Marketing += t.amount;
          break;
        case "comissao":
          categoryMap.Comissões += t.amount;
          break;
        case "aluguel":
        case "energia":
        case "agua":
        case "internet":
        case "contabilidade":
        case "salarios":
        case "pro_labore":
        case "impostos":
        case "seguros":
        case "fornecedores":
        case "equipamentos":
        case "escritorio":
          categoryMap.Estrutura += t.amount;
          break;
        default:
          categoryMap.Outros += t.amount;
      }
    });

  return Object.entries(categoryMap)
    .filter(([, value]) => value > 0)
    .map(([category, value]) => ({ category, value }));
}

export function getVehicleProfitabilityChartData(limit = 10): VehicleProfitabilityData[] {
  return getAllVehiclesProfitability()
    .sort((a, b) => b.margin - a.margin)
    .slice(0, limit)
    .map((v) => ({
      vehicleName: v.vehicleName.length > 20 ? v.vehicleName.slice(0, 20) + "..." : v.vehicleName,
      saleValue: v.finalPrice,
      margin: v.netMargin,
    }));
}

export function getPayableReceivableChartData(monthsBack = 6): PayableReceivableData[] {
  const now = new Date();
  const data: PayableReceivableData[] = [];

  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

    const toReceive = cachedTransactions
      .filter((t) => t.type === "entrada" && t.status === "pendente")
      .filter((t) => {
        const d = t.dueDate ? new Date(t.dueDate) : new Date(t.transactionDate);
        return d >= date && d < nextMonth;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const toPay = cachedTransactions
      .filter((t) => t.type === "saida" && t.status === "pendente")
      .filter((t) => {
        const d = t.dueDate ? new Date(t.dueDate) : new Date(t.transactionDate);
        return d >= date && d < nextMonth;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    data.push({
      period: date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }),
      aPagar: toPay,
      aReceber: toReceive,
    });
  }

  return data;
}

// ============================================
// ACCOUNTS PAYABLE / RECEIVABLE
// ============================================

export function getAccountsPayable(): FinancialTransaction[] {
  return cachedTransactions
    .filter((t) => t.type === "saida" && (t.status === "pendente" || t.status === "atrasado"))
    .sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate) : new Date(a.transactionDate);
      const dateB = b.dueDate ? new Date(b.dueDate) : new Date(b.transactionDate);
      return dateA.getTime() - dateB.getTime();
    });
}

export function getAccountsReceivable(): FinancialTransaction[] {
  return cachedTransactions
    .filter((t) => t.type === "entrada" && (t.status === "pendente" || t.status === "atrasado"))
    .sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate) : new Date(a.transactionDate);
      const dateB = b.dueDate ? new Date(b.dueDate) : new Date(b.transactionDate);
      return dateA.getTime() - dateB.getTime();
    });
}

export function getOverduePayable(): FinancialTransaction[] {
  const now = new Date();
  return getAccountsPayable().filter((t) => {
    const due = t.dueDate ? new Date(t.dueDate) : new Date(t.transactionDate);
    return due < now && t.status === "pendente";
  });
}

export function getOverdueReceivable(): FinancialTransaction[] {
  const now = new Date();
  return getAccountsReceivable().filter((t) => {
    const due = t.dueDate ? new Date(t.dueDate) : new Date(t.transactionDate);
    return due < now && t.status === "pendente";
  });
}

// ============================================
// EXPORT HELPERS
// ============================================

export function exportToCSV<T>(data: T[], filename: string): void {
  if (data.length === 0) return;
  const headers = Object.keys(data[0] as object);
  const rows = data.map((item) =>
    headers
      .map((h) => {
        const val = (item as Record<string, unknown>)[h];
        return typeof val === "string" && val.includes(",") ? `"${val}"` : val;
      })
      .join(","),
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
}

export function exportTransactionsToCSV(
  transactions: FinancialTransaction[],
  filename: string,
): void {
  const data = transactions.map((t) => ({
    Data: formatDate(t.transactionDate),
    Tipo: t.type,
    Categoria: t.category,
    Descrição: t.description,
    Valor: t.amount,
    Status: t.status,
    "Forma Pagamento": t.paymentMethod ?? "",
    Vencimento: t.dueDate ? formatDate(t.dueDate) : "",
    Pagamento: t.paidDate ? formatDate(t.paidDate) : "",
    Veículo: t.vehicleId ?? "",
    Venda: t.saleId ?? "",
    Vendedor: t.sellerId ?? "",
    Fornecedor: t.supplier ?? "",
    Cliente: t.client ?? "",
    Observação: t.notes ?? "",
  }));
  exportToCSV(data, filename);
}
