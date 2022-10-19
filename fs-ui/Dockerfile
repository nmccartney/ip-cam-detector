FROM node:12-alpine

RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/node-app

COPY package.json package-lock.json ./

USER node

RUN npm install

COPY --chown=node:node . .

# RUN mkdir -p /usr/src/node-app/ftp-dir && chown -R node:node /usr/src/node-app/ftp-dir


# RUN openssl genrsa -out private-key.pem 1024
# RUN cat ./private-key.pem

EXPOSE 8080