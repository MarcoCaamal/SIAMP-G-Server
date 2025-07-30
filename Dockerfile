# Use Node.js LTS version
FROM node:22-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Install dependencies
RUN npm ci --only=production --verbose || (npm install --only=production --verbose) && npm cache clean --force

# Development stage
FROM base AS development
RUN npm ci --verbose || npm install --verbose
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:debug"]

# Build stage
FROM base AS build
RUN npm ci --verbose || npm install --verbose
COPY . .
RUN npm run build

# Production stage
FROM base AS production
COPY --from=build /app/dist ./dist
EXPOSE 3000
USER node
CMD ["npm", "run", "start:prod"]