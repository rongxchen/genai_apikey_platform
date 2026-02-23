# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files for better caching
COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Expose the port
EXPOSE 8080

# Start the development server
CMD ["npm", "run", "serve"]