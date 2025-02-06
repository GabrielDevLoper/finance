import {
  CategoriaTransacao,
  StatusTransacao,
  TipoTransacao,
} from "@prisma/client";

export const TRANSACTION_TYPE_OPTIONS = [
  {
    value: TipoTransacao.DEPOSITO,
    label: "Depósito",
  },
  {
    value: TipoTransacao.DESPESA,
    label: "Despesa",
  },
  {
    value: TipoTransacao.INVESTIMENTO,
    label: "Investimento",
  },
];

export const TRANSACTION_STATUS_OPTIONS = [
  {
    value: StatusTransacao.PAGO,
    label: "Pago",
  },
  {
    value: StatusTransacao.PENDENTE,
    label: "Pendente",
  },
  {
    value: StatusTransacao.RECEBIDO,
    label: "Recebido",
  },
];

export const TRANSACTION_CATEGORY_LABELS = {
  [CategoriaTransacao.ALIMENTACAO]: "Alimentação",
  [CategoriaTransacao.MORADIA]: "Moradia",
  [CategoriaTransacao.EDUCACAO]: "Educação",
  [CategoriaTransacao.FATURA_CARTAO_CREDITO]: "Fatura Cartão de Crédito",
  [CategoriaTransacao.FINANCEIRO]: "Financeiro",
  [CategoriaTransacao.FINANCIAMENTO]: "Financiamento",
  [CategoriaTransacao.FREELANCER]: "Freelancer",
  [CategoriaTransacao.LAZER]: "Lazer",
  [CategoriaTransacao.SALARIO]: "Salário",
  [CategoriaTransacao.SAUDE]: "Saúde",
  [CategoriaTransacao.TRANSPORTE]: "Transporte",
  [CategoriaTransacao.SERVICOS]: "Serviços",
  [CategoriaTransacao.OUTROS]: "Outros",
  [CategoriaTransacao.RENDA_EXTRA]: "Renda Extra",
};

export const TRANSACTION_CATEGORY_OPTIONS = [
  {
    value: CategoriaTransacao.ALIMENTACAO,
    label: TRANSACTION_CATEGORY_LABELS[CategoriaTransacao.ALIMENTACAO],
  },
  {
    value: CategoriaTransacao.MORADIA,
    label: TRANSACTION_CATEGORY_LABELS[CategoriaTransacao.MORADIA],
  },
  {
    value: CategoriaTransacao.EDUCACAO,
    label: TRANSACTION_CATEGORY_LABELS[CategoriaTransacao.EDUCACAO],
  },

  {
    value: CategoriaTransacao.FATURA_CARTAO_CREDITO,
    label:
      TRANSACTION_CATEGORY_LABELS[CategoriaTransacao.FATURA_CARTAO_CREDITO],
  },
  {
    value: CategoriaTransacao.FINANCIAMENTO,
    label: TRANSACTION_CATEGORY_LABELS[CategoriaTransacao.FINANCIAMENTO],
  },
  {
    value: CategoriaTransacao.FINANCEIRO,
    label: TRANSACTION_CATEGORY_LABELS[CategoriaTransacao.FINANCEIRO],
  },

  {
    value: CategoriaTransacao.FREELANCER,
    label: TRANSACTION_CATEGORY_LABELS[CategoriaTransacao.FREELANCER],
  },
  {
    value: CategoriaTransacao.LAZER,
    label: TRANSACTION_CATEGORY_LABELS[CategoriaTransacao.LAZER],
  },

  {
    value: CategoriaTransacao.SALARIO,
    label: TRANSACTION_CATEGORY_LABELS[CategoriaTransacao.SALARIO],
  },
  {
    value: CategoriaTransacao.SAUDE,
    label: TRANSACTION_CATEGORY_LABELS[CategoriaTransacao.SAUDE],
  },
  {
    value: CategoriaTransacao.TRANSPORTE,
    label: TRANSACTION_CATEGORY_LABELS[CategoriaTransacao.TRANSPORTE],
  },
  {
    value: CategoriaTransacao.SERVICOS,
    label: TRANSACTION_CATEGORY_LABELS[CategoriaTransacao.SERVICOS],
  },
  {
    value: CategoriaTransacao.OUTROS,
    label: TRANSACTION_CATEGORY_LABELS[CategoriaTransacao.OUTROS],
  },
  {
    value: CategoriaTransacao.RENDA_EXTRA,
    label: TRANSACTION_CATEGORY_LABELS[CategoriaTransacao.RENDA_EXTRA],
  },
];

// Função para validar se a categoria retornada é válida
export function validarCategoria(categoria: string): CategoriaTransacao {
  return Object.values(CategoriaTransacao).includes(
    categoria as CategoriaTransacao
  )
    ? (categoria as CategoriaTransacao)
    : CategoriaTransacao.OUTROS; // Padrão para categorias inválidas
}

// Função para validar se o tipo retornado é válido
export function validarTipo(tipo: string): TipoTransacao {
  return Object.values(TipoTransacao).includes(tipo as TipoTransacao)
    ? (tipo as TipoTransacao)
    : TipoTransacao.DESPESA; // Padrão para tipos inválidos
}
