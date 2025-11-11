### Multi-stage Dockerfile for frontend (Vite + React)
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
COPY . .
RUN npm ci --silent
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
