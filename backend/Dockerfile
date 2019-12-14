FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i --only=prod
COPY ./dist .
EXPOSE 8080
CMD [ "npm", "run dev" ]