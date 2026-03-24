# Pull base image
FROM node:20-bullseye-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose ports for Expo Go and Web
EXPOSE 8081

# Start the Expo development server
CMD ["npm", "start"]
