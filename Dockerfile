FROM node:23-alpine

WORKDIR /app/bot/

COPY package.json .
RUN npm install
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

COPY . .

CMD [ "npm", "start" ]