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

# Expose port 80
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
