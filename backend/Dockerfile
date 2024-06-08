# Dockerfile

FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Remove existing file and create directory
RUN rm -f /usr/src/app/uploads && mkdir -p /usr/src/app/uploads

EXPOSE 5000

CMD ["node", "server.js"]
