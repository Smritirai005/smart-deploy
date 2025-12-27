FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm link
EXPOSE 3000
CMD [ "node", "serve.js" ]