import { validarCategoria, validarTipo } from "@/app/_constants/transaction";
import { db } from "@/app/_lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { StatusTransacao } from "@prisma/client";
import { format } from "date-fns";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { nome, valor, categoria, tipo, email, id_usuario_telegram } =
      await req.json();
    const dataAtual = new Date();
    const mesAtual = format(dataAtual, "MM");
    const anoAtual = format(dataAtual, "yyyy");

    let user = await db.usuarioServicoTelegram.findFirst({
      where: { id_usuario_telegram },
    });

    if (!user) {
      const userListResponse = await clerkClient.users.getUserList({
        emailAddress: email,
      });
      const usuarioClerk = userListResponse.data[0]?.id;

      if (!usuarioClerk) {
        return NextResponse.json({
          response: `Verifique se o e-mail informado está correto. Não encontramos nenhum usuário com o e-mail ${email}.`,
        });
      }

      user = await db.usuarioServicoTelegram.create({
        data: { id_usuario_clerk: usuarioClerk, id_usuario_telegram },
      });
    }

    await db.transacoes.create({
      data: {
        nome,
        valor: parseFloat(valor),
        categoria: validarCategoria(categoria),
        tipo: validarTipo(tipo),
        id_usuario: user.id_usuario_clerk!,
        ano: anoAtual,
        mes: mesAtual,
        status: StatusTransacao.PAGO,
      },
    });

    return NextResponse.json({
      response: `✅ *Sua transação foi registrada com sucesso!*\n\n🔹 *Nome:* ${nome}\n🔹 *Valor:* R$${valor}\n🔹 *Categoria:* ${validarCategoria(
        categoria
      )}\n🔹 *Tipo:* ${validarTipo(
        tipo
      )}\n\nData: ${dataAtual.toLocaleDateString("pt-BR")}`,
    });
  } catch (error) {
    console.error("Erro ao registrar transação:", error);
    return NextResponse.json({
      response: "Falha ao registrar a transação. Tente novamente mais tarde.",
    });
  }
};
