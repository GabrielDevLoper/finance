import twilio from "twilio";
import { OpenAI } from "openai";
import { NextResponse } from "next/server";
// import { NextResponse } from "next/server";

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
          content:
            "Você é um assistente financeiro. Extraia título, valor(trazer somente numero), categoria, identifique se é despesa, deposito ou investimento e identique se vinher outros dados.",
        },
        { role: "user", content: body },
      ],
    });

    // Verifica se a resposta e o conteúdo existem
    if (response.choices && response.choices[0].message.content) {
      const content = response.choices[0].message.content;

      // Função para processar o texto e transformar em objeto
      //   const parseTextToObject = (text: string) => {
      //     const result: { [key: string]: string } = {};
      //     const lines = text.split("\n"); // Divide o texto em linhas

      //     lines.forEach((line) => {
      //       // Remove o hífen e espaços em branco no início e no final
      //       const cleanedLine = line.replace(/^-/, "").trim();
      //       if (cleanedLine) {
      //         // Divide a linha em chave e valor
      //         const [key, value] = cleanedLine
      //           .split(":")
      //           .map((item) => item.trim());
      //         if (key && value) {
      //           // Adiciona ao objeto resultante
      //           result[key.toLowerCase()] = value;
      //         }
      //       }
      //     });

      //     return result;
      //   };

      //   // Processa o texto e transforma em objeto
      //   const parsed = parseTextToObject(content);

      // Se necessário, converte o objeto para JSON
      //   const json = JSON.stringify(parsed, null, 2);
      //   console.log(json);

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
        to: from,
        body: content,
      });

      return NextResponse.json({ success: true });
    } else {
      console.error("Nenhum conteúdo retornado pela API.");
    }
  } catch (apiError) {
    console.error("Erro ao chamar a API do OpenAI:", apiError);
  }
};
