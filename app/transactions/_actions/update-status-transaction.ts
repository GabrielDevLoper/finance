"use server";

import { db } from "@/app/_lib/prisma";
import { StatusTransacao } from "@prisma/client";
import { revalidatePath } from "next/cache";

type UpdateTransactionType = {
  transactionId: string;
  status: StatusTransacao;
};

export const updateStatusTransaction = async ({
  transactionId,
  status,
}: UpdateTransactionType) => {
  try {
    const data = {
      data_pagamento: status === StatusTransacao.PAGO ? new Date() : null,
      status,
    };

    await db.transacoes.update({
      where: {
        id: transactionId,
      },
      data,
    });

    revalidatePath("/transactions");
    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
};
