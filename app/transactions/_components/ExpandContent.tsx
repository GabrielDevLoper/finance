import { Transacoes } from "@prisma/client";

export const ExpandedContent = ({
  transaction,
}: {
  transaction: Transacoes;
}) => {
  console.log(transaction);
  return (
    <div className="p-4 bg-gray-100 border rounded-md">
      <p>
        <strong>Data:</strong>{" "}
        {new Date(transaction.createdAt).toLocaleDateString()}
      </p>
      <p>
        <strong>Categoria:</strong> {transaction.categoria}
      </p>
      <p>
        <strong>Observação:</strong> {transaction.observacao || "Sem descrição"}
      </p>
    </div>
  );
};
