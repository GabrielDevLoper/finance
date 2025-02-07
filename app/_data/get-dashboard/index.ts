import { db } from "@/app/_lib/prisma";
import { StatusTransacao, TipoTransacao } from "@prisma/client";
import {
  TotalDespesaPorCategoria,
  TransactionPercentagePerType,
} from "./types";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type GetDashboardProps = {
  ano: string;
  mes: string;
};

export const getDashboard = async ({ ano, mes }: GetDashboardProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const where = {
    ano,
    mes,
    id_usuario: userId,
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

  const despesasDoMesPagas = Number(
    (
      await db.transacoes.aggregate({
        where: { ...where, tipo: "DESPESA", status: StatusTransacao.PAGO },
        _sum: { valor: true },
      })
    )._sum?.valor
  );

  const despesasTotalPendentes = Number(
    (
      await db.transacoes.aggregate({
        where: { ...where, tipo: "DESPESA", status: StatusTransacao.PENDENTE },
        _sum: { valor: true },
      })
    )._sum?.valor
  );

  const despesasTotalPagas = Number(
    (
      await db.transacoes.aggregate({
        where: { ...where, tipo: "DESPESA", status: StatusTransacao.PAGO },
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

  const balancoGeral = depositosTotal - investimentosTotal - despesasDoMesPagas;

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

  const totalDespesaPorCategoria: TotalDespesaPorCategoria[] = (
    await db.transacoes.groupBy({
      by: ["categoria"],
      where: {
        ...where,
        tipo: TipoTransacao.DESPESA,
      },
      _sum: {
        valor: true,
      },
    })
  ).map((categoria) => ({
    categoria: categoria.categoria,
    totalValor: Number(categoria._sum.valor),
    porcentagemPorTotal: Math.round(
      (Number(categoria._sum.valor) / Number(despesasTotal)) * 100
    ),
  }));

  const ultimasTransacoes = await db.transacoes.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 15,
  });

  return {
    investimentosTotal,
    despesasTotal,
    depositosTotal,
    balancoGeral,
    month: mes,
    year: ano,
    tiposPorcentagem,
    totalDespesaPorCategoria,
    ultimasTransacoes: JSON.parse(JSON.stringify(ultimasTransacoes)),
    despesasTotalPendentes,
    despesasTotalPagas,
  };
};
