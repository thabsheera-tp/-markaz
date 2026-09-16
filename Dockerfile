# Production Dockerfile for Koyyam Markaz Next.js Full-Stack App
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install basic build tools if needed
RUN apk add --no-cache libc6-compat

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Build Next.js application
RUN npm run build

# Expose port
EXPOSE 3000

# Ensure uploads directory exists
RUN mkdir -p public/uploads

CMD ["npm", "start"]
