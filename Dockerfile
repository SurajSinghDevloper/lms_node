# Step 1: Set up the base image for Node.js
FROM node:20.11.1 AS build

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package.json yarn.lock ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy all other source code to the working directory
COPY . .

# Step 6: Expose the necessary port (5000 for Node.js app)
EXPOSE 8090

# Step 7: Define the command to run the application
CMD ["npm", "start"]
