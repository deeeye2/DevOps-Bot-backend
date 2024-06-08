# Use the official Node.js image
FROM node:14

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Ensure the uploads directory exists
RUN mkdir -p /usr/src/app/uploads || true

# Copy the init_db.sql script
COPY init_db.sql /usr/src/app/init_db.sql

# Initialize the SQLite database
RUN sqlite3 /usr/src/app/problems_solutions.db < /usr/src/app/init_db.sql

# Expose the port the app runs on
EXPOSE 5000

# Start the app
CMD ["node", "server.js"]
