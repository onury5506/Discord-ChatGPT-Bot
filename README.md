
# Discord ChatGpt Bot

In this project I used [DiscordJs](https://github.com/discordjs/discord.js) and [chatgpt](https://github.com/transitive-bullshit/chatgpt-api).

commands :

* You can ask anything with ```/ask 'question'```
* You can generate images with ```/image 'prompt'```
* You can edit other members' pp with ```/remix @mentionuser prompt```

**Now it can continue conversation in direct messages! :tada:**

You can restart conversation by sending "restart" message to bot.

It uses reverse proxy now, known reverse proxies run by community members include:
details : https://github.com/transitive-bullshit/chatgpt-api/blob/main/readme.md#reverse-proxy
| Reverse Proxy URL                                | Author                                       | Rate Limits      | Last Checked |
| ------------------------------------------------ | -------------------------------------------- | ---------------- | ------------ |
| `https://chat.duti.tech/api/conversation`        | [@acheong08](https://github.com/acheong08)   | 40 req/min by IP | 2/19/2023    |
| `https://gpt.pawan.krd/backend-api/conversation` | [@PawanOsman](https://github.com/PawanOsman) | ?                | 2/19/2023    |

## [You can test it on discord](https://discord.gg/xggt6w6Sz4)

  

Screenshots :

![Screenshot_1](https://raw.githubusercontent.com/onury5506/Discord-ChatGPT-Bot/master/screen_shot/Screenshot_1.jpg)

  

![Screenshot_3](https://raw.githubusercontent.com/onury5506/Discord-ChatGPT-Bot/master/screen_shot/Screenshot_3.jpg)

  

![Screenshot_4](https://raw.githubusercontent.com/onury5506/Discord-ChatGPT-Bot/master/screen_shot/Screenshot_4.jpg)


![Screenshot_5](https://raw.githubusercontent.com/onury5506/Discord-ChatGPT-Bot/master/screen_shot/Screenshot_5.jpg)

## How to run it?

Firstly, you should rename ".env.example" file to ".env".
After that you should fill it correctly.
When you fill it, you can start it with two ways.

### with nodejs

```

npm install

npm start

```

### with docker

```

docker build -t discordchatgpt .

docker run discordchatgpt

```
