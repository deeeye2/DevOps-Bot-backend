# Use the official image as a parent image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Ensure the uploads directory exists
RUN mkdir -p /usr/src/app/uploads

# Expose the port the app runs on
EXPOSE 5000

# Start the app
CMD ["node", "server.js"]
