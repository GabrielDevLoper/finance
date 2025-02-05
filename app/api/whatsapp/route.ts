// pages/api/whatsapp.ts
// import { db } from "@/app/_lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

import twilio from "twilio";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { Body, From } = req.body; // Mensagem enviada pelo usuário no WhatsApp

    // Usa o ChatGPT para extrair informações
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Você é um assistente financeiro. Extraia título, valor, categoria e data de mensagens de gastos ou ganhos.",
        },
        { role: "user", content: Body },
      ],
    });

    // Pega o JSON retornado pelo GPT-4
    const parsed = JSON.parse(response.choices[0].message.content || "");

    console.log(parsed);
    // Salva no banco de dados
    // await db.transacoes.create({
    //   data: {
    //     nome: parsed.titulo,
    //     valor: parsed.valor,
    //     categoria: parsed.categoria,
    //     id_usuario: From,
    //   },
    // });

    // Responde ao usuário no WhatsApp
    await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: From,
      body: `Cadastrado: ${parsed.titulo} - R$${parsed.valor} (${parsed.categoria})`,
    });

    return res.status(200).json({ success: true });
  }

  res.status(405).json({ error: "Método não permitido" });
}
