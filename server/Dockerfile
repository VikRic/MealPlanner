FROM node:20

WORKDIR /app
COPY package*.json ./
RUN npm install

ENV NODE_ENV=production
COPY . .

EXPOSE 5000
CMD ["npm", "start"]