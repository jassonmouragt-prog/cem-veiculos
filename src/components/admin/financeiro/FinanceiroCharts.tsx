import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import {
  getFluxoFinanceiroChartData,
  getSalesByMonthChartData,
  getSalesBySellerChartData,
  getExpensesByCategoryChartData,
  getVehicleProfitabilityChartData,
  getPayableReceivableChartData,
} from "@/lib/db/store";

const COLORS = ["#E8231F", "#10B981", "#F59E0B", "#3B82F6", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"];

export function FinanceiroCharts() {
  const [fluxoPeriod, setFluxoPeriod] = useState<"day" | "week" | "month">("month");
  const [salesBySellerView, setSalesBySellerView] = useState<"count" | "value">("value");

  const fluxoData = getFluxoFinanceiroChartData(fluxoPeriod);
  const salesMonthData = getSalesByMonthChartData();
  const salesSellerData = getSalesBySellerChartData();
  const expensesCategoryData = getExpensesByCategoryChartData();
  const vehicleProfitData = getVehicleProfitabilityChartData();
  const payableReceivableData = getPayableReceivableChartData();

  return (
    <div className="space-y-6">
      {/* Row 1: Fluxo Financeiro + Vendas por Mês */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#121212] border-white/5 rounded-2xl">
          <CardHeader className="pb-3 border-b border-white/5">
            <div className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold text-white">Fluxo Financeiro</CardTitle>
              <Select value={fluxoPeriod} onValueChange={setFluxoPeriod}>
                <SelectTrigger className="w-40 h-8 text-xs bg-black/50 border-white/10">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white text-xs">
                  <SelectItem value="month">Mensal</SelectItem>
                  <SelectItem value="week">Semanal</SelectItem>
                  <SelectItem value="day">Diário</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="h-72">
            <ChartContainer
              config={{
                entradas: { label: "Entradas", color: "#10B981" },
                saidas: { label: "Saídas", color: "#EF4444" },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fluxoData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis
                    dataKey="period"
                    tick={{ fill: "#888", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#888", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatCompact(value)}
                  />
                  <Tooltip content={<ChartTooltipContent formatter={formatCurrencyTooltip} />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="entradas"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="saidas"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-[#121212] border-white/5 rounded-2xl">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-base font-bold text-white">Vendas por Mês</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ChartContainer
              config={{
                count: { label: "Quantidade", color: "#3B82F6" },
                value: { label: "Valor (R$)", color: "#E8231F" },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesMonthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#888", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#888", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatCompact(value)}
                  />
                  <Tooltip content={<ChartTooltipContent formatter={formatCurrencyTooltip} />} />
                  <Legend />
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Quantidade" />
                  <Bar dataKey="value" fill="#E8231F" radius={[4, 4, 0, 0]} name="Valor (R$)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Vendas por Vendedor + Despesas por Categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#121212] border-white/5 rounded-2xl">
          <CardHeader className="pb-3 border-b border-white/5">
            <div className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold text-white">Vendas por Vendedor</CardTitle>
              <Select value={salesBySellerView} onValueChange={setSalesBySellerView}>
                <SelectTrigger className="w-40 h-8 text-xs bg-black/50 border-white/10">
                  <SelectValue placeholder="Ver" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white text-xs">
                  <SelectItem value="value">Faturamento</SelectItem>
                  <SelectItem value="count">Quantidade</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="h-72">
            <ChartContainer
              config={{
                value: { label: "Faturamento", color: "#E8231F" },
                count: { label: "Quantidade", color: "#10B981" },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesSellerData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 80, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis
                    tick={{ fill: "#888", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatCompact(value)}
                  />
                  <YAxis
                    type="category"
                    dataKey="sellerName"
                    tick={{ fill: "#888", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip content={<ChartTooltipContent formatter={formatCurrencyTooltip} />} />
                  <Legend />
                  <Bar dataKey={salesBySellerView} fill="#E8231F" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-[#121212] border-white/5 rounded-2xl">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-base font-bold text-white">Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ChartContainer
              config={
                expensesCategoryData.reduce((acc, item, i) => {
                  acc[item.category] = { label: item.category, color: COLORS[i % COLORS.length] };
                  return acc;
                }, {} as Record<string, { label: string; color: string }>)
              }
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="category"
                    label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {expensesCategoryData.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent formatter={formatCurrencyTooltip} />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Rentabilidade Veículos + Contas a Pagar/Receber */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#121212] border-white/5 rounded-2xl">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-base font-bold text-white">Top 10 Rentabilidade</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ChartContainer
              config={{
                saleValue: { label: "Valor Venda", color: "#3B82F6" },
                margin: { label: "Margem Líquida", color: "#E8231F" },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={vehicleProfitData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 100, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis
                    tick={{ fill: "#888", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatCompact(value)}
                  />
                  <YAxis
                    type="category"
                    dataKey="vehicleName"
                    tick={{ fill: "#888", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={100}
                  />
                  <Tooltip content={<ChartTooltipContent formatter={formatCurrencyTooltip} />} />
                  <Legend />
                  <Bar dataKey="saleValue" fill="#3B82F6" radius={[0, 4, 4, 0]} name="Valor Venda" />
                  <Bar dataKey="margin" fill="#E8231F" radius={[0, 4, 4, 0]} name="Margem" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-[#121212] border-white/5 rounded-2xl">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-base font-bold text-white">A Pagar vs A Receber</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ChartContainer
              config={{
                aPagar: { label: "A Pagar", color: "#EF4444" },
                aReceber: { label: "A Receber", color: "#10B981" },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={payableReceivableData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis
                    dataKey="period"
                    tick={{ fill: "#888", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#888", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatCompact(value)}
                  />
                  <Tooltip content={<ChartTooltipContent formatter={formatCurrencyTooltip} />} />
                  <Legend />
                  <Bar dataKey="aPagar" fill="#EF4444" radius={[4, 4, 0, 0]} name="A Pagar" />
                  <Bar dataKey="aReceber" fill="#10B981" radius={[4, 4, 0, 0]} name="A Receber" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function formatCompact(value: number): string {
  if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
  if (value >= 1000) return (value / 1000).toFixed(1) + "K";
  return value.toString();
}

function formatCurrencyTooltip(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}