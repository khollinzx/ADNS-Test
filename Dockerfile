# Use an official Node.js runtime as the base image
FROM node:14 as base

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY ./package*.json ./

# Install dependencies
RUN rm -rf node_modules && npm install && npm install bcrypt --build-from-source

# Copy the rest of the application code to the container
COPY . .

# Expose the port on which your Express app is listening
EXPOSE 3001

# Specify the command to run your Express app
ENTRYPOINT npm run dev
#CMD ["node", "./server.js" ]
