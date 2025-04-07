# Use the official Node.js image to build the React app
FROM node:18 as build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the React app's source code
COPY . .

# Build the React app for production
RUN npm run build

# Use a smaller image (nginx) to serve the production build
FROM nginx:alpine

# Copy the build output to nginx's default directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 (nginx default)
EXPOSE 80

# Start nginx to serve the React app
CMD ["nginx", "-g", "daemon off;"]
