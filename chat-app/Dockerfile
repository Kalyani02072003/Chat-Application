# Stage 1: Build the React app
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# # Build the React app for production
# RUN npm run build

CMD ["npm", "start"]
