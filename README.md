# Discord ChatGpt Bot

In this project I used [DiscordJs](https://github.com/discordjs/discord.js) and [chatgpt](https://github.com/transitive-bullshit/chatgpt-api).

You can ask anything with ```/ask 'question'``` command.\
Or you can generate images with ```/image 'prompt'```.

**Now it can continue conversation in direct messages! :tada:**

You can restart conversation by sending "restart" message to bot.

## [You can test it on discord](https://discord.gg/xggt6w6Sz4)

Screenshots : 
![Screenshot_1](https://raw.githubusercontent.com/onury5506/Discord-ChatGPT-Bot/master/screen_shot/Screenshot_1.jpg)

![Screenshot_3](https://raw.githubusercontent.com/onury5506/Discord-ChatGPT-Bot/master/screen_shot/Screenshot_3.jpg)

![Screenshot_4](https://raw.githubusercontent.com/onury5506/Discord-ChatGPT-Bot/master/screen_shot/Screenshot_4.jpg)

## How to run it?

Firstly, you should rename ".env.example" file to ".env".\
After that you should fill it correctly.\
When you fill it, you can start it with two ways.
### with nodejs

```
npm install
npm start
```

### with docker -- not working for now ! --
```
docker build -t discordchatgpt .
docker run discordchatgpt
```