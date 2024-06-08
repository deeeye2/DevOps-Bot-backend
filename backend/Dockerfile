# Dockerfile

FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Ensure /usr/src/app/uploads is a directory
RUN mkdir -p /usr/src/app/uploads

EXPOSE 5000

CMD ["node", "server.js"]
