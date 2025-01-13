import {
  CategoriaTransacao,
  StatusTransacao,
  TipoTransacao,
} from "@prisma/client";
import { z } from "zod";

export const addTransactionSchema = z.object({
  nome: z.string().min(1),
  valor: z.number().positive(),
  tipo: z.nativeEnum(TipoTransacao),
  categoria: z.nativeEnum(CategoriaTransacao),
  status: z.nativeEnum(StatusTransacao),
  observacao: z.string(),
  data_pagamento: z.date(),
});
