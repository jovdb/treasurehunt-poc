FROM node:13.12.0-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
ENTRYPOINT ["npm", "run"]