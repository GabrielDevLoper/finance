# Documentação Técnica - Aplicativo de Controle Financeiro

## Visão Geral

A aplicação de controle financeiro tem como objetivo permitir o gerenciamento de despesas e receitas, proporcionando insights gerados pela API do ChatGPT. A solução conta com autenticação via Clerk, processamento de pagamentos com Stripe e interface responsiva utilizando Next.js, TailwindCSS e ShadCN.

## Tecnologias Utilizadas

- **Next.js** - Framework React para aplicações web modernas
- **TailwindCSS** - Biblioteca de estilização baseada em utilitários
- **ShadCN** - Componentes prontos para UI
- **Stripe** - Plataforma de pagamentos
- **Clerk** - Serviço de autenticação
- **API do ChatGPT** - Geração de relatórios e insights financeiros

## Configuração do Ambiente

Para rodar a aplicação localmente, siga os seguintes passos:

### 1. Clonar o Repositório

```sh
 git clone https://github.com/seu-repositorio.git
 cd seu-repositorio
```

### 2. Instalar Dependências

```sh
npm install
# ou
yarn install
```

### 3. Configuração das Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto e configure as seguintes variáveis:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=SEU_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY=SEU_CLERK_SECRET_KEY
STRIPE_SECRET_KEY=SEU_STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=SEU_STRIPE_WEBHOOK_SECRET
OPENAI_API_KEY=SUA_OPENAI_API_KEY
```

### 4. Executar a Aplicação

```sh
npm run dev
# ou
yarn dev
```

A aplicação estará disponível em `http://localhost:3000`

## Configuração do Webhook do Stripe

Para testar pagamentos e webhooks do Stripe localmente:

### 1. Instalar a CLI do Stripe

Baixe e instale a [Stripe CLI](https://stripe.com/docs/stripe-cli)

### 2. Autenticar na Stripe

```sh
stripe login
```

### 3. Iniciar o Webhook

```sh
./stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Isso gerará um `STRIPE_WEBHOOK_SECRET` que deve ser adicionado ao `.env.local`

## Considerações Finais

Essa documentação cobre a configuração inicial e principais funcionalidades da aplicação. Para mais informações, consulte a documentação oficial das tecnologias utilizadas.
