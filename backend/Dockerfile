FROM node:14

WORKDIR /usr/src/app

# Install sqlite3
RUN apt-get update && apt-get install -y sqlite3

# Copy package.json and package-lock.json if available
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Create uploads directory if not exists
RUN mkdir -p /usr/src/app/uploads || true

# Initialize the SQLite database
COPY init_db.sql /usr/src/app/init_db.sql
RUN sqlite3 /usr/src/app/new_problems_solutions.db < /usr/src/app/init_db.sql

# Expose the application port
EXPOSE 5000

# Start the application
CMD [ "node", "server.js" ]
