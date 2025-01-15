import {
  CategoriaTransacao,
  StatusTransacao,
  TipoTransacao,
} from "@prisma/client";
import { z } from "zod";

export const addTransactionSchema = z.object({
  nome: z.string().min(1),
  valor: z.number().nullable().optional(),
  tipo: z.nativeEnum(TipoTransacao),
  categoria: z.nativeEnum(CategoriaTransacao),
  status: z.nativeEnum(StatusTransacao).nullable().optional(),
  observacao: z.string().nullable().optional(),
  data_pagamento: z.date().nullable().optional(),
  ano: z.string().nullable().optional(),
  mes: z.string().nullable().optional(),
});
