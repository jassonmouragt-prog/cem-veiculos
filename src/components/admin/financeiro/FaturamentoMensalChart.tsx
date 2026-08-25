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
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  getSalesByMonthChartData,
  getSalesByMonthChartData as getSalesByMonthData,
} from "@/lib/db/store";

const MONTH_LABELS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export function FaturamentoMensalChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "este-ano" | "ano-anterior" | "ultimos-12-meses"
  >("este-ano");

  const now = new Date();
  const currentYear = now.getFullYear();

  let chartData: { month: string; value: number }[];
  let periodLabel: string;

  if (selectedPeriod === "este-ano") {
    chartData = getSalesByMonthChartData(12, currentYear);
    periodLabel = String(currentYear);
  } else if (selectedPeriod === "ano-anterior") {
    chartData = getSalesByMonthChartData(12, currentYear - 1);
    periodLabel = String(currentYear - 1);
  } else {
    chartData = getSalesByMonthChartData(12);
    periodLabel = "Últimos 12 meses";
  }

  const maxValue = Math.max(...chartData.map((d) => d.value), 1);

  return (
    <Card className="bg-[#121212] border-white/5 rounded-2xl w-full">
      <CardHeader className="pb-3 border-b border-white/5">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-white">Faturamento por mês</CardTitle>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48 h-8 text-xs bg-black/50 border-white/10">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/10 text-white text-xs">
              <SelectItem value="este-ano">Este ano</SelectItem>
              <SelectItem value="ano-anterior">Ano anterior</SelectItem>
              <SelectItem value="ultimos-12-meses">Últimos 12 meses</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-gray-500 mt-1">{periodLabel}</p>
      </CardHeader>
      <CardContent className="h-80">
        <ChartContainer
          config={{
            value: { label: "Faturamento (R$)", color: "#E8231F" },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                domain={[0, maxValue * 1.15]}
              />
              <Tooltip
                content={<ChartTooltipContent formatter={formatCurrencyTooltip} />}
                labelFormatter={(month) => month}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#E8231F"
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2, fill: "#E8231F" }}
                activeDot={{ r: 8, strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
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
