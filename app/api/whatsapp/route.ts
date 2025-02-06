import twilio from "twilio";
import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { db } from "@/app/_lib/prisma";
import { validarCategoria, validarTipo } from "@/app/_constants/transaction";
import { clerkClient, User } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { StatusTransacao } from "@prisma/client";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const POST = async (req: Request) => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    throw new Error("Credenciais do Twilio não configuradas.");
  }

  if (!process.env.TWILIO_WHATSAPP_NUMBER) {
    throw new Error("Número do Twilio não configurado.");
  }

  // Lê o corpo da requisição no formato x-www-form-urlencoded
  const formData = await req.formData();
  const body = formData.get("Body")?.toString() || "";
  const from = formData.get("From")?.toString() || "";

  try {
    // Usa o ChatGPT para extrair informações
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
                    Você é um assistente financeiro especializado em classificar transações a partir de frases curtas. Seu objetivo é extrair corretamente o nome, valor, categoria e tipo da transação.  

            ⚠️ **Regras importantes:**
            - verificar se e enviado o email do usuario
            - Retorne **apenas um JSON válido** (sem explicações ou formatação desnecessária).
            - O valor deve ser um número (sem símbolos como R$ ou ponto decimal para milhares).
            - O **tipo da transação** deve ser um dos seguintes:
            - "DEPOSITO" → Quando for um salário, renda extra ou recebimento de freelancer.
            - "DESPESA" → Para qualquer gasto (alimentação, conta, serviço, lazer, fatura ,etc.).
            - "INVESTIMENTO" → Quando a frase indicar aplicação financeira.

            - A **categoria** deve ser uma das seguintes:
            - "TRANSPORTE" → Uber, gasolina, passagem, estacionamento, combustivel.
            - "EDUCACAO" → Escola, faculdade, cursos, livros.
            - "SAUDE" → Médico, remédio, exames, academia.
            - "LAZER" → Viagens, cinema, festas, hobbies.
            - "MORADIA" → Aluguel, condomínio, conta de luz, água, internet, manutencao na casa.
            - "ALIMENTACAO" → Restaurante, supermercado, comida em geral.
            - "SALARIO" → Salário fixo recebido mensalmente.
            - "FINANCIAMENTO" → Pagamentos de financiamentos ou empréstimos.
            - "FINANCEIRO" → Investimentos, poupança, aplicações.
            - "FREELANCER" → Trabalho extra, serviços prestados.
            - "FATURA_CARTAO_CREDITO" → Pagamento da fatura do cartão de crédito.
            - "SERVICOS" → Assinaturas, manutenção, serviços diversos.
            - "OUTROS" → Quando não se encaixar em nenhuma categoria específica.
            - "RENDA_EXTRA" → Qualquer renda além do salário principal.

            🎯 **Formato de saída esperado (JSON):**
            
            {
            "nome": "NOME_EXTRAIDO",
            "valor": 100, 
            "categoria": "CATEGORIA_CLASSIFICADA",
            "tipo": "TIPO_CLASSIFICADO"
            "email": "EMAIL_USUARIO"
            }

        `,
        },
        { role: "user", content: body },
      ],
    });

    // Verifica se a resposta e o conteúdo existem
    if (response.choices && response.choices[0].message.content) {
      const content = response.choices[0].message.content;

      // Processa o texto e transforma em objeto
      const parsed = JSON.parse(content);

      const userListResponse = await clerkClient().users.getUserList({
        emailAddress: parsed.email,
      });

      const userList: User[] = userListResponse.data;
      const dataAtual = new Date();
      const mesAtual = format(dataAtual, "MM");
      const anoAtual = format(dataAtual, "yyyy");

      //     Salva no banco de dados
      await db.transacoes.create({
        data: {
          nome: parsed.nome,
          valor: parseFloat(parsed.valor),
          categoria: validarCategoria(parsed.categoria),
          tipo: validarTipo(parsed.tipo),
          id_usuario: userList[0].id,
          ano: anoAtual,
          mes: mesAtual,
          status: StatusTransacao.PAGO,
        },
      });

      //   Responde ao usuário no WhatsApp
      await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: from,
        body: ` 
        ✅ *Sua transação foi registrada com sucesso!*

        🔹 *Nome:* ${parsed.nome}
        🔹 *Valor:* R$${parsed.valor}
        🔹 *Categoria:* ${validarCategoria(parsed.categoria)}
        🔹 *Tipo:* ${validarTipo(parsed.tipo)}
        
          *Você pode acessar suas transações em:* ${
            process.env.APP_URL
          }/transactions?month=${mesAtual}&year=${anoAtual}
        `,
      });

      return NextResponse.json({ success: true });
    } else {
      console.error("Nenhum conteúdo retornado pela API.");
    }
  } catch (apiError) {
    console.error("Erro ao chamar a API do OpenAI:", apiError);
    return NextResponse.error();
  }
};
