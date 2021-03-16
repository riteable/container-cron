FROM node:12.13.0-stretch

ENV NODE_ENV production

RUN mkdir /opt/container-cron

WORKDIR /home/node/app

COPY config.json /opt/container-cron/config.json
COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY index.js .
COPY healthcheck.js .

HEALTHCHECK CMD node healthcheck.js

CMD ["node", "index.js"]
