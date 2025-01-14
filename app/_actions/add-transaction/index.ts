"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  CategoriaTransacao,
  StatusTransacao,
  TipoTransacao,
} from "@prisma/client";
import { addTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";

interface addTransactionParams {
  id?: string;
  nome: string;
  valor: number;
  tipo: TipoTransacao;
  categoria: CategoriaTransacao;
  status: StatusTransacao;
  observacao?: string | null;
  data_pagamento?: Date | null;
}

export const upsertTransaction = async (params: addTransactionParams) => {
  addTransactionSchema.parse(params);

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await db.transacoes.upsert({
    update: { ...params, id_usuario: userId },
    create: { ...params, id_usuario: userId },
    where: {
      id: params?.id ?? "",
    },
  });

  revalidatePath("/transactions");
};
