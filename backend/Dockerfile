# First stage
FROM node:21 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci 

# Copy the rest of the application files to the container
COPY . .


# Rebuild bcrypt for the correct architecture
RUN npm rebuild bcrypt --build-from-source

# Second stage: Use a smaller Node.js image to run the application
FROM node:21-slim

WORKDIR /app

# Copy the built application and node_modules from the builder stage
COPY --from=builder /app /app

EXPOSE 8080 

# Set the command to run the application
CMD ["npm", "start"]
