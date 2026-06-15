# --- Stage 1: build the React app with Vite ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build 

# --- Stage 2: serve the static build with nginx ---
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
# nginx.conf is mounted at runtime via docker-compose
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
