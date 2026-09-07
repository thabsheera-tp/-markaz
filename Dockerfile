# Production Dockerfile for Koyyam Markaz Next.js Full-Stack App
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install build dependencies for native modules (sqlite3)
RUN apk add --no-cache python3 make g++ sqlite

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install all dependencies including native build
RUN npm ci

# Copy project files
COPY . .

# Build Next.js application
RUN npm run build

# Expose port
EXPOSE 3000

# Ensure data and uploads directories exist
RUN mkdir -p data public/uploads

CMD ["npm", "start"]
