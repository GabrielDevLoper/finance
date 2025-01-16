"use client";

import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart";
import { TipoTransacao } from "@prisma/client";
import { TransactionPercentagePerType } from "@/app/_data/get-dashboard/types";
import PercentageItem from "./percentage-item";

interface TransactionsPieChartProps {
  investimentosTotal: number;
  depositosTotal: number;
  despesasTotal: number;
  tiposPorcentagem: TransactionPercentagePerType;
}

const chartConfig = {
  [TipoTransacao.DEPOSITO]: {
    label: "Receita",
    color: "#55B02E",
  },
  [TipoTransacao.INVESTIMENTO]: {
    label: "Investimento",
    color: "#06b6d4",
  },
  [TipoTransacao.DESPESA]: {
    label: "Despesa",
    color: "#E93030",
  },
} satisfies ChartConfig;

export function TransactionsPieChart({
  depositosTotal,
  despesasTotal,
  investimentosTotal,
  tiposPorcentagem,
}: TransactionsPieChartProps) {
  const chartData = [
    {
      type: TipoTransacao.DEPOSITO,
      amount: depositosTotal,
      fill: "#55B02E",
    },
    {
      type: TipoTransacao.DESPESA,
      amount: despesasTotal,
      fill: "#E93030",
    },
    {
      type: TipoTransacao.INVESTIMENTO,
      amount: investimentosTotal,
      fill: "#06b6d4",
    },
  ];

  return (
    <Card className="flex flex-col p-12">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="type"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
        <div className="space-y-2">
          <PercentageItem
            icon={<TrendingUpIcon size={16} className="text-primary" />}
            title="Receita"
            value={tiposPorcentagem[TipoTransacao.DEPOSITO]}
          />

          <PercentageItem
            icon={<TrendingDownIcon size={16} className="text-danger" />}
            title="Despesa"
            value={tiposPorcentagem[TipoTransacao.DESPESA]}
          />

          <PercentageItem
            icon={<PiggyBankIcon size={16} className="text-cyan-500" />}
            title="Investimento"
            value={tiposPorcentagem[TipoTransacao.INVESTIMENTO]}
          />
        </div>
      </CardContent>
    </Card>
  );
}
