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
ENV CI=1
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=4096
ENV WATCHMAN_DISABLE_ALL=1
ENV EXPO_NO_CACHE=1
ENV EXPO_NO_TELEMETRY=1
ENV EXPO_METRO_MAX_WORKERS=4

# Build web app
RUN npx expo export --platform web --clear 2>&1

# Expose port
EXPOSE 8081

# Serve the built app
CMD ["serve", "-s", "dist", "-l", "8081"]
