# Etapa 1 - Construção (instalação das dependências)
FROM node:18 AS build

# Definir diretório de trabalho dentro do container
WORKDIR /app

# Copiar package.json e package-lock.json primeiro para cache eficiente
COPY package*.json ./

# Instalar apenas as dependências de produção
RUN npm install --omit=dev

# Copiar todo o código do projeto para dentro do container
COPY . .

# Etapa 2 - Produção (executando o backend)
FROM node:18

# Definir diretório de trabalho na imagem final
WORKDIR /app

# Copiar apenas as dependências instaladas na etapa anterior
COPY --from=build /app /app

# Expor a porta em que o backend estará rodando (ajuste conforme necessário)
EXPOSE 3000

# Comando para rodar o servidor
CMD ["node", "server.js"]
