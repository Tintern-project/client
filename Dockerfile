# Dockerfile for Next.js Client on Fly.io
FROM node:20-alpine AS Builder
WORKDIR /app

# Set environment variables for build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-https://tintern-server.fly.dev}

# Copy package files first for better caching
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the application with ESLint and TypeScript checking disabled
ENV NEXT_DISABLE_ESLINT_DURING_BUILD=true
ENV NEXT_DISABLE_TYPE_CHECKING_DURING_BUILD=true
RUN npm run build

# Production stage
FROM node:20-alpine AS Production
WORKDIR /app

# Set environment variables for runtime
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-https://tintern-server.fly.dev}
ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=Builder /app/next.config.* ./
COPY --from=Builder /app/public ./public
COPY --from=Builder /app/package.json ./package.json
COPY --from=Builder /app/.next ./.next
COPY --from=Builder /app/node_modules ./node_modules

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
