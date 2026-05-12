# Use official Node.js LTS image as the base image
FROM node:lts-slim

# Activar yarn moderno
RUN npm install -g corepack

# Install build dependencies for sqlite3
RUN apt-get update && apt-get install -y curl python3 python3-pip make g++ libsqlite3-dev sqlite3 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --immutable-cache

# Copy source code and build
COPY . .

# Expose API port
EXPOSE ${API_SERVER_PORT}

# Run database migrations and start the server
CMD ["sh", "-c", "yarn start"]