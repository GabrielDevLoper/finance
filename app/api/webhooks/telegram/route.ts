import { validarCategoria, validarTipo } from "@/app/_constants/transaction";
import { db } from "@/app/_lib/prisma";
import { clerkClient, User } from "@clerk/nextjs/server";
import { StatusTransacao } from "@prisma/client";
import { format } from "date-fns";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.json(); // Obtendo o corpo da requisição

  // Processa o texto e transforma em objeto
  const parsed = JSON.parse(body);

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

  const response = ` 
  ✅ *Sua transação foi registrada com sucesso!*

  🔹 *Nome:* ${parsed.nome}
  🔹 *Valor:* R$${parsed.valor}
  🔹 *Categoria:* ${validarCategoria(parsed.categoria)}
  🔹 *Tipo:* ${validarTipo(parsed.tipo)}
`;

  return NextResponse.json(response);
};
