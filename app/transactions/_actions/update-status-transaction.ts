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
    await db.transacoes.update({
      where: {
        id: transactionId,
      },
      data: {
        status,
      },
    });

    revalidatePath("/transactions");
    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
};
