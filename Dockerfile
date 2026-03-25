FROM node:22

WORKDIR /app

# Copy package file only to ensure fresh resolution in Linux environment
COPY package.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Ensure Expo SDK alignment inside the container
RUN npx expo install --fix

# Install serve for static hosting
RUN npm install -g serve

# Copy source code
COPY . .

# Set API URL for build
ENV EXPO_PUBLIC_API_URL=http://localhost:8000

# Build web app
RUN npx expo export --platform web

# Expose port
EXPOSE 8081

# Serve the built app
CMD ["serve", "-s", "dist", "-l", "8081"]
