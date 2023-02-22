import { REST, Routes, AttachmentBuilder } from 'discord.js'

import stableDiffusion from '../stablediffusion/stableDiffusion.js';
import Conversations from '../chatgpt/conversations.js'
import { askQuestion } from '../chatgpt/chatgpt.js';
import { generateInteractionReply, createEmbedsForImageCommand } from './discord_helpers.js';

export const commands = [
    {
        name: 'ask',
        description: 'Ask Anything!',
        options: [
            {
                name: "question",
                description: "Your question",
                type: 3,
                required: true
            }
        ]
    },
    {
        name: 'image',
        description: 'Ask Anything!',
        options: [
            {
                name: "prompt",
                description: "Your prompt",
                type: 3,
                required: true
            }
        ]
    },
];

export async function initDiscordCommands() {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

export async function handle_interaction_ask(interaction) {
    const user = interaction.user

    // Begin conversation
    let conversationInfo = Conversations.getConversation(user.id)
    const question = interaction.options.getString("question")
    await interaction.deferReply()
    if (question.toLowerCase() == "reset") {
        generateInteractionReply(interaction,user,question,"Who are you ?")
        return;
    }

    try {
        askQuestion(question, async (content) => {
            generateInteractionReply(interaction,user,question,content)
        }, { conversationInfo })
    } catch (e) {
        console.error(e)
    }
}

export async function handle_interaction_image(interaction) {
    const user = interaction.user
    const prompt = interaction.options.getString("prompt")
    try {
        await interaction.deferReply()
        stableDiffusion.generate(prompt, async (result) => {
            if (result.error) {
                await interaction.editReply({ content: "error..." })
                return;
            }
            
            try {
                let embeds = createEmbedsForImageCommand(user,prompt,result.results)
                await interaction.editReply(embeds)
            } catch (e) {
                console.log(e)
                await interaction.editReply({ content: "error..." })
            }

        })
    } catch (e) {
        console.error(e)
    }
}