import twilio from "twilio";
import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const POST = async (req: Request) => {
  const { Body, From } = req.body; // Mensagem enviada pelo usuário no WhatsApp

  // Usa o ChatGPT para extrair informações
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Você é um assistente financeiro. Extraia título, valor, categoria e data de mensagens de gastos.",
      },
      { role: "user", content: Body },
    ],
  });

  // Pega o JSON retornado pelo GPT-4
  const parsed = JSON.parse(response.choices[0].message.content || "");

  console.log(parsed);
  // Salva no banco de dados
  // await prisma.despesa.create({
  //   data: {
  //     titulo: parsed.titulo,
  //     valor: parsed.valor,
  //     categoria: parsed.categoria,
  //     data: new Date(),
  //     usuario: From,
  //   },
  // });

  // Responde ao usuário no WhatsApp
  await twilioClient.messages.create({
    from: process.env.TWILIO_WHATSAPP_NUMBER,
    to: From,
    body: `Despesa cadastrada: ${parsed.titulo} - R$${parsed.valor} (${parsed.categoria})`,
  });

  return NextResponse.json({ success: true });
};
