import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import SummaryCard from "./summary-card";
import { db } from "@/app/_lib/prisma";

interface SummaryCardsProps {
  month: string;
  year: string;
}

const SummaryCards = async ({ month, year }: SummaryCardsProps) => {
  const where = {
    createdAt: {
      gte: new Date(`${year}-${month}-01`),
      lt: new Date(`${year}-${month}-31`),
    },
  };

  const investimentosTotal = Number(
    (
      await db.transacoes.aggregate({
        where: { ...where, tipo: "INVESTIMENTO" },
        _sum: { valor: true },
      })
    )._sum?.valor
  );

  const despesasTotal = Number(
    (
      await db.transacoes.aggregate({
        where: { ...where, tipo: "DESPESA" },
        _sum: { valor: true },
      })
    )._sum?.valor
  );

  const depositosTotal = Number(
    (
      await db.transacoes.aggregate({
        where: { ...where, tipo: "DEPOSITO" },
        _sum: { valor: true },
      })
    )._sum?.valor
  );

  const balancoGeral = depositosTotal - investimentosTotal - despesasTotal;

  return (
    <div className="space-y-6">
      <SummaryCard
        icon={<WalletIcon size={16} />}
        title="Saldo"
        value={balancoGeral}
        size="large"
      />

      <div className="grid grid-cols-3 gap-6">
        <SummaryCard
          icon={<PiggyBankIcon size={16} className="text-cyan-500" />}
          title="Investido"
          value={investimentosTotal}
        />

        <SummaryCard
          icon={<TrendingUpIcon size={16} className="text-primary" />}
          title="Receita"
          value={depositosTotal}
        />

        <SummaryCard
          icon={<TrendingDownIcon size={16} className="text-danger" />}
          title="Despesas"
          value={despesasTotal}
        />
      </div>
    </div>
  );
};

export default SummaryCards;
