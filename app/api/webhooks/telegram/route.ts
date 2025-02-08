import { validarCategoria, validarTipo } from "@/app/_constants/transaction";
import { db } from "@/app/_lib/prisma";
import { clerkClient, User } from "@clerk/nextjs/server";
import { StatusTransacao } from "@prisma/client";
import { format } from "date-fns";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.json(); // Obtendo o corpo da requisição

  const userListResponse = await clerkClient().users.getUserList({
    emailAddress: body.email,
  });

  if (userListResponse.data.length <= 0) {
    const response = `Verifique se o e-mail informado está correto. Não encontramos nenhum usuário com o e-mail ${body.email}.`;

    return NextResponse.json({ response });
  }

  try {
    const userList: User[] = userListResponse.data;
    const dataAtual = new Date();
    const mesAtual = format(dataAtual, "MM");
    const anoAtual = format(dataAtual, "yyyy");

    //     Salva no banco de dados
    await db.transacoes.create({
      data: {
        nome: body.nome,
        valor: parseFloat(body.valor),
        categoria: validarCategoria(body.categoria),
        tipo: validarTipo(body.tipo),
        id_usuario: userList[0].id,
        ano: anoAtual,
        mes: mesAtual,
        status: StatusTransacao.PAGO,
      },
    });

    const response = ` 
    ✅ *Sua transação foi registrada com sucesso!*

    🔹 *Nome:* ${body.nome}
    🔹 *Valor:* R$${body.valor}
    🔹 *Categoria:* ${validarCategoria(body.categoria)}
    🔹 *Tipo:* ${validarTipo(body.tipo)}

    Data: ${dataAtual.toLocaleDateString("pt-BR")}
    `;

    return NextResponse.json({ response });
  } catch (error) {
    console.log(error);
    const response = `Falha ao registrar a transação. Tente novamente mais tarde.`;

    return NextResponse.json({ response });
  }
};
