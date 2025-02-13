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
  // Cria o conteúdo do prompt com instruções claras para a IA
  const content = `
Gere um relatório detalhado sobre minhas finanças, incluindo insights e dicas práticas para otimização financeira.
Analise as transações fornecidas abaixo, seguindo as regras e instruções específicas:

### Formato das Transações:
As transações estão no formato: {DATA}-{TIPO}-{VALOR}-{CATEGORIA}
Exemplo: 01/2023-despesa-150.00-Alimentação

Transações:
${formatTransactions(transactions)}

### Regras para Análise:
1. **Valores Monetários**:
   - Certifique-se de que todos os valores sejam tratados como números com duas casas decimais.
   - Ignore valores negativos ou nulos.
   - Converta strings formatadas como "R$100,00" para números antes de realizar cálculos.

2. **Filtragem por Tipo**:
   - Separe as transações em três categorias principais: "receita", "despesa" e "investimento".
   - Não misture tipos diferentes durante os cálculos.

3. **Duplicidade**:
   - Verifique se há transações duplicadas e remova-as antes de realizar qualquer cálculo.

4. **Cálculos**:
   - Calcule o total de receitas, despesas e investimentos separadamente.
   - Identifique as categorias que mais impactam o orçamento (ex.: "Alimentação", "Transporte").
   - Calcule o saldo final: Receitas - Despesas.

5. **Insights e Sugestões**:
   - Forneça sugestões para reduzir despesas desnecessárias.
   - Indique oportunidades para aumentar receitas ou melhorar investimentos.
   - Apresente os resultados de forma clara e objetiva.

### Exemplo de Saída Esperada:
- Total de Receitas: R$ X.XX
- Total de Despesas: R$ X.XX
- Total de Investimentos: R$ X.XX
- Saldo Final: R$ X.XX
- Categoria com Maior Gasto: [Nome da Categoria]
- Sugestões de Otimização: [Lista de Sugestões]

Por favor, siga estas instruções cuidadosamente para garantir que os valores e análises estejam corretos.
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
