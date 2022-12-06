FROM node:lts-alpine
LABEL MAINTAINER Onur YILDIZ <onuryildizsai@gmail.com>

RUN mkdir discordChatGpt

WORKDIR /discordChatGpt

RUN apk update && apk add --no-cache nmap && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache \
      chromium \
      harfbuzz \
      "freetype>2.8" \
      ttf-freefont \
      nss

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY package.json /discordChatGpt/

RUN npm install

COPY . /discordChatGpt/

CMD ["npm","start"]