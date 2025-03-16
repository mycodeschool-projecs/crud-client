## ----------------------------
## 1) Build Stage
## ----------------------------
#FROM node:18-alpine AS build
#
## Create app directory
#WORKDIR /app
#
## Copy package files and install dependencies
#COPY package*.json ./
#RUN npm ci
#
## Copy the rest of your source code
#COPY . .
#
## Build the React production bundle
#RUN npm run build
#
## ----------------------------
## 2) Production Stage
## ----------------------------
#FROM node:18-alpine
#
## Create and use an app directory
#WORKDIR /app
#
## Install "serve" globally to serve static files
#RUN npm install -g serve
#
## Copy over the build artifacts from the 'build' stage
#COPY --from=build /app/build ./build
#
## Expose port 3000
#EXPOSE 3000
#
## Use "serve" to serve the build folder on port 3000
#CMD ["serve", "-s", "build", "-l", "3000"]

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