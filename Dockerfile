# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve the built application with a lightweight server
FROM nginx:alpine

# Copy the built files from the previous stage into Nginx's web root
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port Nginx runs on
EXPOSE 80

# Command to start Nginx
CMD ["nginx", "-g", "daemon off;"]