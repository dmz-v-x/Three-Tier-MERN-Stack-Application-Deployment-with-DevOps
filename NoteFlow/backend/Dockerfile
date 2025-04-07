# Use the official Node.js image from Docker Hub as a base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install the app dependencies inside the container
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that your backend API will run on (for example, 5000)
EXPOSE 5000

# Start the backend server (no hardcoding of Mongo URI here)
CMD ["npm", "start"]
