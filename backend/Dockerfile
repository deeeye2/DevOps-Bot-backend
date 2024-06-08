FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Remove the existing directory if it exists and create a new one
RUN rm -rf /usr/src/app/uploads && mkdir -p /usr/src/app/uploads

RUN sqlite3 /usr/src/app/new_problems_solutions.db < /usr/src/app/init_db.sql

EXPOSE 5000

CMD [ "node", "server.js" ]
