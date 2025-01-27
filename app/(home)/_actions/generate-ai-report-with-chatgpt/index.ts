"use server";

import { db } from "@/app/_lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import OpenAI from "openai";

type GenerateAirReportType = {
  month: string;
  year: string;
};

export const generateAiReport = async ({
  month,
  year,
}: GenerateAirReportType) => {
  // pegar as transacoes da competencia recebido:
  const { userId } = await auth();
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  if (!userId) {
    throw new Error("Unauthorization");
  }

  const user = await clerkClient().users.getUser(userId);

  const hasPremiumPlan = user?.publicMetadata.subscriptionPlan === "premium";

  if (!hasPremiumPlan) {
    throw new Error("You need a premium plan to generate ai reports");
  }

  const transactions = await db.transacoes.findMany({
    where: {
      id_usuario: userId,
      ...(month && { mes: month }),
      ...(year && { ano: year }),
    },
    orderBy: {
      createdAt: "desc", // ou 'createdAt', dependendo do campo que você usa
    },
  });
  //   mandar as transacoes pro chatgpt pedir relatorio com insights
  const content = `Gere um relatório com insights sobre as minhas finanças, 
  com dicas e orientações de como melhorar minha vida financeira. 
  As transações estão divididas por ponto e vírgula.
    A estrutura de cada uma é {DATA}-{TIPO}-{VALOR}-{CATEGORIA}. São elas:
  ${transactions
    .map(
      (transaction) =>
        `${transaction.createdAt.toLocaleDateString("pt-BR")}-R$${
          transaction.valor
        }-${transaction.tipo}-${transaction.categoria}`
    )
    .join(";")}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Você é um especialista em gestão e organização de finanaças pessoais. você ajuda pessoas a organizarem melhor as suas finanças",
      },
      {
        role: "user",
        content,
      },
    ],
  });
  // pegar relatorio gerado pelo chatgpt e retornar pro usuario

  return completion.choices[0].message.content;
};
