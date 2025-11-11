FROM node:18
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm ci --only=production --silent
COPY . .
EXPOSE 5001
ENV NODE_ENV=production
ENV PORT=5001
CMD ["node", "src/index.js"]
