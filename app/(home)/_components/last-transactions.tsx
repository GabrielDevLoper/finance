import { Button } from "@/app/_components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { formatCurrency } from "@/app/_utils/currency";

import { Transacoes, TipoTransacao } from "@prisma/client";

import Link from "next/link";

interface LastTransactionsProps {
  lastTransactions: Transacoes[];
}

const LastTransactions = ({ lastTransactions }: LastTransactionsProps) => {
  const getAmountColor = (transaction: Transacoes) => {
    if (transaction.tipo === TipoTransacao.DESPESA) {
      return "text-red-500";
    }
    if (transaction.tipo === TipoTransacao.DEPOSITO) {
      return "text-primary";
    }
    return "text-cyan-500";
  };

  const getAmountPrefix = (transaction: Transacoes) => {
    if (transaction.tipo === TipoTransacao.DEPOSITO) {
      return "+";
    }
    return "-";
  };

  return (
    <ScrollArea className="rounded-md border hidden md:block bg-black bg-opacity-5 h-full">
      <div className="h-full flex flex-col">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="font-bold sm:text-xl">
            Últimas transações
          </CardTitle>
          <Button variant="outline" className="rounded-full font-bold" asChild>
            <Link href="/transactions">Ver mais</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 flex-1">
          {lastTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-bold">{transaction.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.createdAt).toLocaleDateString(
                      "pt-BR",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
              <p className={`text-sm font-bold ${getAmountColor(transaction)}`}>
                {getAmountPrefix(transaction)}
                {formatCurrency(Number(transaction.valor))}
              </p>
            </div>
          ))}
        </CardContent>
      </div>
    </ScrollArea>
  );
};

export default LastTransactions;
