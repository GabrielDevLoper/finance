// import { validarCategoria, validarTipo } from "@/app/_constants/transaction";
// import { db } from "@/app/_lib/prisma";
// import { clerkClient, User } from "@clerk/nextjs/server";
// import { StatusTransacao } from "@prisma/client";
// import { format } from "date-fns";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json(); // Obtém o corpo da requisição como JSON

    if (!Array.isArray(body) || body.length === 0 || !body[0].result) {
      return NextResponse.json(
        { error: "Formato inválido ou JSON não encontrado na resposta." },
        { status: 400 }
      );
    }

    // Expressão regular para capturar o JSON dentro da string "result"
    const jsonMatch = body[0].result.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Nenhum JSON válido encontrado na resposta." },
        { status: 400 }
      );
    }

    // Converte a string JSON para objeto real
    const jsonData = JSON.parse(jsonMatch[0]);

    // Retorna apenas o JSON limpo para evitar erro no n8n
    return NextResponse.json(jsonData);
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json(
      { error: "Erro ao processar JSON", details: errorMessage },
      { status: 500 }
    );
  }

  // const userListResponse = await clerkClient().users.getUserList({
  //   emailAddress: body.email,
  // });
  // if (userListResponse.data.length <= 0) {
  //   const response = `Verifique se o e-mail informado está correto. Não encontramos nenhum usuário com o e-mail ${body.email}.`;
  //   return NextResponse.json({ response });
  // }
  // try {
  //   const userList: User[] = userListResponse.data;
  //   const dataAtual = new Date();
  //   const mesAtual = format(dataAtual, "MM");
  //   const anoAtual = format(dataAtual, "yyyy");
  //   //     Salva no banco de dados
  //   await db.transacoes.create({
  //     data: {
  //       nome: body.nome,
  //       valor: parseFloat(body.valor),
  //       categoria: validarCategoria(body.categoria),
  //       tipo: validarTipo(body.tipo),
  //       id_usuario: userList[0].id,
  //       ano: anoAtual,
  //       mes: mesAtual,
  //       status: StatusTransacao.PAGO,
  //     },
  //   });
  //   const response = `
  //   ✅ *Sua transação foi registrada com sucesso!*
  //   🔹 *Nome:* ${body.nome}
  //   🔹 *Valor:* R$${body.valor}
  //   🔹 *Categoria:* ${validarCategoria(body.categoria)}
  //   🔹 *Tipo:* ${validarTipo(body.tipo)}
  //   Data: ${dataAtual.toLocaleDateString("pt-BR")}
  //   `;
  //   return NextResponse.json({ response });
  // } catch (error) {
  //   console.log(error);
  //   const response = `Falha ao registrar a transação. Tente novamente mais tarde.`;
  //   return NextResponse.json({ response });
  // }
};
