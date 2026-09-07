FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run seed
EXPOSE 5000
CMD ["npm", "start"]
