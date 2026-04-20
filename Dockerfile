# Production Dockerfile for the Agent Memory platform.
# This assumes the platform serves API requests or hosts the dashboard.
# (Currently acts as a demonstration standalone container)

FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy application code
COPY . .

# Build the app using Vite
RUN npm run build

# Use a lightweight static server to serve the frontend
RUN npm install -g serve

EXPOSE 3000

# Start script
CMD ["serve", "-s", "dist", "-l", "3000"]
