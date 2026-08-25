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
  acquisitionCost?: number;
  stockEntryDate?: string;
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

// ============================================
// TIPOS DO MÓDULO FINANCEIRO
// ============================================

export type TransactionType = "entrada" | "saida";

export type TransactionCategory =
  | "venda_veiculo"
  | "sinal_veiculo"
  | "recebimento_financiamento"
  | "recebimento_parcelado"
  | "servicos"
  | "outros_recebimentos"
  | "compra_veiculo"
  | "comissao"
  | "manutencao"
  | "documentacao"
  | "despachante"
  | "lavagem"
  | "combustivel"
  | "marketing"
  | "trafego_pago"
  | "aluguel"
  | "energia"
  | "agua"
  | "internet"
  | "contabilidade"
  | "salarios"
  | "pro_labore"
  | "impostos"
  | "seguros"
  | "fornecedores"
  | "equipamentos"
  | "escritorio"
  | "outros";

export type PaymentMethod =
  | "a_vista"
  | "financiamento"
  | "entrada_financiamento"
  | "consorcio"
  | "pix"
  | "transferencia"
  | "cartao"
  | "outro";

export type PaymentStatus = "pendente" | "pago" | "atrasado" | "cancelado";

export type CommissionStatus = "pendente" | "a_pagar" | "pago";

export type SaleStatus = "concluida" | "cancelada";

export interface Seller {
  id: string;
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  commissionRate: number;
  isActive: boolean;
  canReceiveCommission: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  vehicleId: string;
  sellerId?: string;
  announcedPrice: number;
  finalPrice: number;
  discountAmount: number;
  discountPercent: number;
  hadNegotiation: boolean;
  acquisitionCost: number;
  totalExpenses: number;
  grossMargin: number;
  netMargin: number;
  commissionRate: number;
  commissionValue: number;
  paymentMethod: PaymentMethod;
  totalReceived: number;
  totalToReceive: number;
  downPayment: number;
  financedAmount: number;
  saleDate: string;
  status: SaleStatus;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  // Relacionamentos (populados via join)
  vehicle?: Vehicle;
  seller?: Seller;
}

export interface FinancialTransaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  amount: number;
  transactionDate: string;
  dueDate?: string;
  paidDate?: string;
  paymentMethod?: PaymentMethod;
  status: PaymentStatus;
  vehicleId?: string;
  saleId?: string;
  sellerId?: string;
  supplier?: string;
  client?: string;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  // Relacionamentos
  vehicle?: Vehicle;
  sale?: Sale;
  seller?: Seller;
}

export interface VehicleExpense {
  id: string;
  vehicleId: string;
  description: string;
  category: TransactionCategory;
  amount: number;
  expenseDate: string;
  paymentStatus: PaymentStatus;
  paidDate?: string;
  paymentMethod?: PaymentMethod;
  supplier?: string;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  vehicle?: Vehicle;
}

export interface FinancialAuditLog {
  id: string;
  tableName: string;
  recordId: string;
  action: string;
  oldData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
  changedFields: string[];
  userId?: string;
  createdAt: string;
}

export interface FinancialDashboardStats {
  // Faturamento do período
  totalSales: number;
  totalSalesCount: number;
  // Entradas (dinheiro efetivamente recebido)
  totalReceived: number;
  // A receber
  totalToReceive: number;
  // Saídas (dinheiro efetivamente pago)
  totalPaid: number;
  // Contas a pagar
  totalPayable: number;
  // Comissões
  totalCommissionsGenerated: number;
  totalCommissionsPaid: number;
  totalCommissionsPending: number;
  // Lucro estimado
  estimatedProfit: number;
  // Margem média
  averageMarginPercent: number;
  // Período
  periodStart: string;
  periodEnd: string;
}

export interface SellerReport {
  sellerId: string;
  sellerName: string;
  salesCount: number;
  totalSold: number;
  totalCommissionGenerated: number;
  totalCommissionPaid: number;
  totalCommissionPending: number;
  averageTicket: number;
  averageDiscountPercent: number;
  averageMarginPercent: number;
}

export interface VehicleProfitability {
  vehicleId: string;
  vehicleName: string;
  acquisitionCost: number;
  totalExpenses: number;
  totalCost: number;
  announcedPrice: number;
  finalPrice: number;
  discountAmount: number;
  discountPercent: number;
  grossMargin: number;
  commissionValue: number;
  netMargin: number;
  marginPercent: number;
  daysInStock: number;
  sellerName?: string;
  commissionRate?: number;
  saleDate?: string;
}

export interface ChartDataPoint {
  period: string;
  entradas: number;
  saidas: number;
}

export interface SalesByMonthData {
  month: string;
  count: number;
  value: number;
}

export interface SalesBySellerData {
  sellerName: string;
  count: number;
  value: number;
}

export interface ExpensesByCategoryData {
  category: string;
  value: number;
}

export interface VehicleProfitabilityData {
  vehicleName: string;
  saleValue: number;
  margin: number;
}

export interface PayableReceivableData {
  period: string;
  aPagar: number;
  aReceber: number;
}
