"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getRelatoriosMensais(month: string, year: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }
  const relatorios = await db.relatoriosMensais.findFirst({
    where: {
      id_usuario: userId,
      mes: month,
      ano: year,
    },
  });

  return relatorios;
}
