FROM node:18
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm ci --only=production --silent
COPY . .
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "src/index.js"]
