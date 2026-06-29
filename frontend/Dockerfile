# Costruzione di un app React con Vite
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build 

# costruzione statica con nginx
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
# nginx.conf parte a runtime via docker-compose
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
