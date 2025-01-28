import { db } from "@/app/_lib/prisma";

export async function verificarUsoApi(userId: string, iaDescricao: string) {
  // Data atual
  const agora = new Date();
  const inicioDoMes = new Date(agora.getFullYear(), agora.getMonth(), 1); // Primeiro dia do mês
  const fimDoMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0); // Último dia do mês

  // Verifica se já existe um registro no mês atual
  const usoNoMes = await db.usoApiRelatorios.findFirst({
    where: {
      id_usuario: userId,
      ia_descricao: iaDescricao,
      createdAt: {
        gte: inicioDoMes, // Greater than or equal to (>=) início do mês
        lte: fimDoMes, // Less than or equal to (<=) fim do mês
      },
    },
  });

  // Permite a chamada à API
  return !!usoNoMes;
}
