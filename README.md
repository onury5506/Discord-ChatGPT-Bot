
# Discord ChatGpt Bot

The bot now uses the official ChatGpt API. :tada: This means you can expect more reliable and consistent responses from the bot.
However, if you prefer to use the unofficial API version, you can always find it on the "non_official_api" branch.
Thank you for using our bot and contributing to the project!

We now have a convenient dashboard for configuring the bot, eliminating the need to restart it to modify settings. The bot runs on port 8080. Additionally, there are plans to integrate usage statistics into the dashboard.

commands :

* You can ask anything with ```/ask 'question'```
* You can generate images with ```/image 'prompt'```
* You can edit other members' pp with ```/remix @mentionuser prompt```

## [You can test it on discord](https://discord.gg/xggt6w6Sz4)

Screenshots :

![Screenshot_6](https://raw.githubusercontent.com/onury5506/Discord-ChatGPT-Bot/master/screen_shot/Screenshot_6.jpg)

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

docker run -p 8080:8080 -v discordchatgptconfig:/discordChatGpt/configFile discordchatgpt

```
