FROM node:16
LABEL MAINTAINER Onur YILDIZ <onuryildizsai@gmail.com>

RUN mkdir discordChatGpt

WORKDIR /discordChatGpt

COPY package.json /discordChatGpt/

RUN npm install

COPY . /discordChatGpt/

CMD ["npm","start"]