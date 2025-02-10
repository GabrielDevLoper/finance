"use server";

import { db } from "@/app/_lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { verificarUsoApi } from "../verify-call-api-ai";

type GenerateAirReportType = {
  month: string;
  year: string;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateAiReport = async ({
  month,
  year,
}: GenerateAirReportType) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Verifica limite de chamadas
  const usoExcedido = await verificarUsoApi(userId, "chatgpt");
  if (usoExcedido)
    throw new Error("Limite de chamadas atingido para este mês.");

  // Busca informações do usuário e valida plano premium
  const [user, transactions] = await Promise.all([
    clerkClient.users.getUser(userId),
    db.transacoes.findMany({
      where: {
        id_usuario: userId,
        ...(month && { mes: month }),
        ...(year && { ano: year }),
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (user?.publicMetadata.subscriptionPlan !== "premium") {
    throw new Error(
      "Você precisa de um plano premium para gerar relatórios de IA."
    );
  }

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

  // Chamada à OpenAI
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Você é um especialista em gestão e organização de finanças pessoais. você ajuda pessoas a organizarem melhor as suas finanças e dar dicas de investimentos",
      },
      { role: "user", content },
    ],
  });

  const reportContent = completion.choices[0]?.message?.content || "";

  // Salvar o uso da API e o relatório gerado no banco
  await Promise.all([
    db.usoApiRelatorios.create({
      data: {
        id_usuario: userId,
        ia_descricao: "chatgpt",
        quantidade_chamadas: 1,
      },
    }),
    db.relatoriosMensais.create({
      data: {
        id_usuario: userId,
        mes: month,
        ano: year,
        conteudo: reportContent,
      },
    }),
  ]);

  return reportContent;
};
