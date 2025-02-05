import twilio from "twilio";
import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

interface RequestBodyProps {
  Body: string;
  From: string;
}

export const POST = async (req: Request) => {
  const { Body, From } = (await req.json()) as RequestBodyProps;

  try {
    // Usa o ChatGPT para extrair informações
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Você é um assistente financeiro. Extraia título, valor, categoria e data de mensagens de gastos. trazer o texto puro sem formatações",
        },
        { role: "user", content: Body },
      ],
    });

    // Verifica se a resposta e o conteúdo existem
    if (response.choices && response.choices[0].message.content) {
      const content = response.choices[0].message.content;

      // Função para formatar a string e transformar em objeto
      const formatStringToObject = (str: string) => {
        const lines = str.split("\n"); // Divide a string em linhas
        const result: { [key: string]: string } = {};

        lines.forEach((line: string) => {
          const [key, value] = line.split(":").map((item) => item.trim()); // Divide cada linha em chave e valor
          if (key && value) {
            result[key.toLowerCase()] = value; // Adiciona ao objeto resultante
          }
        });

        return result;
      };

      // Formata a string e transforma em objeto
      const parsed = formatStringToObject(content);

      // Salva no banco de dados
      //   await prisma.despesa.create({
      //     data: {
      //       titulo: parsed.titulo,
      //       valor: parsed.valor,
      //       categoria: parsed.categoria,
      //       data: new Date(),
      //       usuario: From,
      //     },
      //   });

      //   Responde ao usuário no WhatsApp
      await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: From,
        body: `Cadastrado: ${parsed.titulo} - R$${parsed.valor} (${parsed.categoria})`,
      });

      return NextResponse.json({ success: true });
    } else {
      console.error("Nenhum conteúdo retornado pela API.");
    }
  } catch (apiError) {
    console.error("Erro ao chamar a API do OpenAI:", apiError);
  }
};
