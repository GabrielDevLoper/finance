import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { ScrollArea } from "@/app/_components/ui/scroll-area"; // Ajuste o import se necessário
import { formatCurrency } from "@/app/_utils/currency";
import { Transacoes, TipoTransacao } from "@prisma/client";
import Link from "next/link";

interface LastTransactionsProps {
  lastTransactions: Transacoes[];
}

const LastTransactions = ({ lastTransactions }: LastTransactionsProps) => {
  const getAmountColor = (transaction: Transacoes) => {
    if (transaction.tipo === TipoTransacao.DESPESA) return "text-red-500";
    if (transaction.tipo === TipoTransacao.DEPOSITO) return "text-primary";
    return "text-cyan-500";
  };

  const getAmountPrefix = (transaction: Transacoes) => {
    return transaction.tipo === TipoTransacao.DEPOSITO ? "+" : "-";
  };

  return (
    <Card className="rounded-md border hidden md:block bg-black bg-opacity-5 h-[800px] flex flex-col">
      {/* Cabeçalho fixo */}
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="font-bold sm:text-xl">
          Últimas transações
        </CardTitle>
        <Button variant="outline" className="rounded-full font-bold" asChild>
          <Link href="/transactions">Ver mais</Link>
        </Button>
      </CardHeader>

      {/* Área rolável */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[700px] overflow-y-auto px-4">
          <div className="space-y-4">
            {lastTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <p className="text-sm font-bold">{transaction.nome}</p>
                  <p className="text-xs text-muted-foreground">
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
                <p
                  className={`text-sm font-bold ${getAmountColor(transaction)}`}
                >
                  {getAmountPrefix(transaction)}
                  {formatCurrency(Number(transaction.valor))}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LastTransactions;
