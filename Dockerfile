FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

EXPOSE 4200

CMD ["npx", "nx", "serve", "platform-shell-ui", "--host", "0.0.0.0", "--port", "4200", "--disable-host-check"]
