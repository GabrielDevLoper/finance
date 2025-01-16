import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import SummaryCard from "./summary-card";

interface SummaryCardsProps {
  month: string;
  year: string;
  balancoGeral: number;
  investimentosTotal: number;
  depositosTotal: number;
  despesasTotal: number;
}

const SummaryCards = async ({
  balancoGeral,
  depositosTotal,
  despesasTotal,
  investimentosTotal,
}: SummaryCardsProps) => {
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
