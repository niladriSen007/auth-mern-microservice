FROM node:22-alpine

# Install necessary packages for file watching
RUN apk add --no-cache git

WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files first for better caching
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code (this will be overridden by volume mount in development)
COPY . .

EXPOSE 5501

# Use development command with file watching
CMD ["pnpm", "dev"]


