# Stage 1: Build the app
FROM node:23-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . . 
RUN npm run build

# Stage 2: Serve the app with a lightweight web server (Nginx)
FROM nginx:alpine-slim

# Copy the custom Nginx config file into the container
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy the built static files from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create env.sh script
RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-env.sh && \
    echo 'set -e' >> /docker-entrypoint.d/40-env.sh && \
    echo 'cat > /usr/share/nginx/html/config.js <<EOF' >> /docker-entrypoint.d/40-env.sh && \
    echo 'window.APP_CONFIG = {' >> /docker-entrypoint.d/40-env.sh && \
    echo '  API_URL: "${API_URL:-\"http://localhost:5000/api\"}",' >> /docker-entrypoint.d/40-env.sh && \
    echo '  NODE_ENV: "${NODE_ENV:-\"production\"}"' >> /docker-entrypoint.d/40-env.sh && \
    echo '};' >> /docker-entrypoint.d/40-env.sh && \
    echo 'EOF' >> /docker-entrypoint.d/40-env.sh && \
    chmod +x /docker-entrypoint.d/40-env.sh

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
