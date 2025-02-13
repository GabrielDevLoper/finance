"use server";

import { db } from "@/app/_lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { verificarUsoApi } from "../verify-call-api-ai";
import { Transacoes } from "@prisma/client";

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

  // Função para formatar transações de forma clara e consistente
  const formatTransactions = (transactions: Transacoes[]) => {
    return transactions
      .map(({ mes, ano, valor, tipo, categoria }) => {
        const formattedDate = `${String(mes).padStart(2, "0")}/${ano}`;
        const formattedValue = `R$${valor?.toFixed(2)}`; // Garante 2 casas decimais
        return `${formattedDate}-${tipo}-${formattedValue}-${categoria}`;
      })
      .join(";");
  };

  // Cria o conteúdo do prompt com instruções claras para a IA
  const content = `
Gere um relatório detalhado sobre minhas finanças, incluindo insights e dicas práticas para otimização financeira.
Analise as transações fornecidas abaixo, separando-as corretamente por tipo (receita, despesa ou investimento) e categoria.
Certifique-se de não cometer erros nos valores e organize os dados de forma clara.

Formato das transações: {DATA}-{TIPO}-{VALOR}-{CATEGORIA}
Transações:
${formatTransactions(transactions)}

Instruções adicionais:
1. Calcule o total de receitas, despesas e investimentos.
2. Identifique as categorias que mais impactam meu orçamento.
3. Sugira formas de reduzir despesas desnecessárias.
4. Indique oportunidades de aumento de receitas ou melhores investimentos.
5. Apresente os resultados de forma clara e objetiva.
`;

  // Chamada à OpenAI
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Você é um especialista em gestão e organização de finanças pessoais. você ajuda pessoas a organizarem melhor as suas finanças.",
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
