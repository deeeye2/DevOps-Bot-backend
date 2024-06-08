FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Copy app source code
COPY . .

# Ensure the uploads directory exists
RUN mkdir -p /usr/src/app/uploads

# Copy the verified database
COPY new_problems_solutions.db /usr/src/app/problems_solutions.db

# Expose port and start the server
EXPOSE 5000
CMD [ "node", "server.js" ]
