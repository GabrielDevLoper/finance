# Etapa 1: Construção da aplicação
FROM node:18 AS builder

WORKDIR /app

# Copia os arquivos necessários
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Gera a build da aplicação
RUN npm run build

# Etapa 2: Runtime (reduz a imagem final)
FROM node:18-alpine AS runner

WORKDIR /app

# Copia apenas os arquivos necessários da etapa anterior
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Define a variável de ambiente para o modo de produção
ENV NODE_ENV=production

# Expõe a porta usada pela aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]
