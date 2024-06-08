# Dockerfile for Backend

FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Copy initialization script
COPY init_db.sql /usr/src/app/init_db.sql

# Initialize the database
RUN apt-get update && apt-get install -y sqlite3
RUN sqlite3 /usr/src/app/problems_solutions.db < /usr/src/app/init_db.sql

# Expose port and start the server
EXPOSE 5000
CMD [ "node", "server.js" ]
