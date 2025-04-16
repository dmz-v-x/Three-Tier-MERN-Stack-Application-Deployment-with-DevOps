# Use a secure, lightweight Node image
FROM node:23-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install only production dependencies
COPY package*.json ./

# Install the app dependencies inside the container
RUN npm install

# Copy app source code
COPY . .

# Expose the backend port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
