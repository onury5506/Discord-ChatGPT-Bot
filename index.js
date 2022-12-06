import dotenv from 'dotenv'
import { ChatGPTAPI } from 'chatgpt'
import { Client, GatewayIntentBits, REST, Routes } from 'discord.js'
import OPENAI_SESSION from './openai_session.js'

dotenv.config()

const commands = [
    {
        name: 'ask',
        description: 'Ask Anything!',
        options:[
            {
                name:"question",
                description:"Your question",
                type:3,
                required:true
            }
        ]
    },
];

async function initChatGPT() {
    let sessionToken
    while(true){
        try{
            sessionToken = await OPENAI_SESSION.getSession(process.env.OPENAI_EMAIL,process.env.OPENAI_PASSWORD)
            break
        }catch(e){
            console.error("initChatGPT ERROR : "+e)
        }
    }

    let api = new ChatGPTAPI({ sessionToken })

    await api.ensureAuth()

    setInterval(async ()=>{
        try{
            let sessionToken = await OPENAI_SESSION.getSession(process.env.OPENAI_EMAIL,process.env.OPENAI_PASSWORD)
            let new_api = new ChatGPTAPI({ sessionToken })

            await new_api.ensureAuth()

            api = new_api
            console.log("Session Token Changed - ",new Date())
        }catch(e){
            console.error(e)
        }
    },600000)

    return {
        sendMessage:(message,opts={})=>{
            return api.sendMessage(message,opts)
        }
    };
}

async function initDiscordCommands(){
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}



async function main() {

    const chatGTP = await initChatGPT()

    await initDiscordCommands()

    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildIntegrations] });

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
        console.log(new Date())
    });

    function askQuestion(question,interaction){
        let tmr = setTimeout(()=>{
            interaction.editReply({content:"Oppss, something went wrong! (Timeout)"})
        },45000)

        chatGTP.sendMessage(question).then((response)=>{
            clearTimeout(tmr)
            interaction.editReply({content:response})
        }).catch(()=>{
            interaction.editReply({content:"Oppss, something went wrong! (Error)"})
        })
    }

    client.on("interactionCreate", async interaction => {
        const question = interaction.options.getString("question")
        interaction.reply({content:"let me think..."})
        try{
            askQuestion(question,interaction)
        }catch(e){
            console.error(e)
        }
        
    });
    
    client.login(process.env.DISCORD_BOT_TOKEN);
}

main()