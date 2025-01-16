import { TipoTransacao } from "@prisma/client";

export type TransactionPercentagePerType = {
  [key in TipoTransacao]: number;
};
