import { db } from "@/app/_lib/prisma";
import { TipoTransacao } from "@prisma/client";
import { TransactionPercentagePerType } from "./types";

type GetDashboardProps = {
  ano: string;
  mes: string;
};

export const getDashboard = async ({ ano, mes }: GetDashboardProps) => {
  const where = {
    ano,
    mes,
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

  const totalTransacoes = Number(
    (
      await db.transacoes.aggregate({
        where,
        _sum: { valor: true },
      })
    )._sum.valor
  );

  const tiposPorcentagem: TransactionPercentagePerType = {
    [TipoTransacao.DEPOSITO]: Math.round(
      (Number(depositosTotal || 0) / Number(totalTransacoes)) * 100
    ),
    [TipoTransacao.DESPESA]: Math.round(
      (Number(despesasTotal || 0) / Number(totalTransacoes)) * 100
    ),

    [TipoTransacao.INVESTIMENTO]: Math.round(
      (Number(investimentosTotal || 0) / Number(totalTransacoes)) * 100
    ),
  };

  return {
    investimentosTotal,
    despesasTotal,
    depositosTotal,
    balancoGeral,
    month: mes,
    year: ano,
    tiposPorcentagem,
  };
};
