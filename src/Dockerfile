FROM node:16

WORKDIR /app

COPY package.json .
COPY .env .

RUN npm install

COPY . .

EXPOSE  1

CMD ["node", "server.js"]
