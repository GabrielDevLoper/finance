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
];
