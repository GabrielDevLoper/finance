import { CategoriaTransacao, TipoTransacao } from "@prisma/client";

export type TransactionPercentagePerType = {
  [key in TipoTransacao]: number;
};

export type TotalDespesaPorCategoria = {
  categoria: CategoriaTransacao;
  totalValor: number;
  porcentagemPorTotal: number;
};
