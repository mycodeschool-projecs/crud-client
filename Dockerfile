
FROM node:17

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Expose the port on which the app runs
EXPOSE 3000

# Command to start the React app
CMD ["npm", "start"]
