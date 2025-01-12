import { db } from "../_lib/prisma";

const Transactions = async () => {
  const transactions = await db.transacoes.findMany({});

  return (
    <div>
      {transactions.map((transaction) => (
        <p key={transaction.id}>{transaction.nome}</p>
      ))}
    </div>
  );
};

export default Transactions;
