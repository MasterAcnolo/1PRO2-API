FROM node:20-alpine

# Build tools nécessaires pour les addons natifs (better-sqlite3, etc.)
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 1337

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]
