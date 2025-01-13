import { Badge } from "@/app/_components/ui/badge";
import { TipoTransacao, Transacoes } from "@prisma/client";
import { CircleIcon } from "lucide-react";

interface TransactionTypeBadgeProps {
  transaction: Transacoes;
}

const TransactionTypeBadge = ({ transaction }: TransactionTypeBadgeProps) => {
  if (transaction.tipo === TipoTransacao.DEPOSITO) {
    return (
      <Badge className="bg-muted text-primary hover:bg-muted font-bold">
        <CircleIcon className="fill-primary mr-2" size={10} />
        Depósito
      </Badge>
    );
  }

  if (transaction.tipo === TipoTransacao.DESPESA) {
    return (
      <Badge className="text-danger bg-danger bg-opacity-10 font-bold hover:bg-muted">
        <CircleIcon className="fill-danger mr-2" size={10} />
        Despesa
      </Badge>
    );
  }

  return (
    <Badge className="text-blue-500 bg-blue-500 bg-opacity-10 font-bold hover:bg-muted">
      <CircleIcon className="fill-blue-500 mr-2" size={10} />
      Investimento
    </Badge>
  );
};

export default TransactionTypeBadge;
