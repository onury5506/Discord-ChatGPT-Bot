import { REST, Routes, AttachmentBuilder } from 'discord.js'

import stableDiffusion from '../stablediffusion/stableDiffusion.js';
import Conversations from '../chatgpt/conversations.js'
import { askQuestion } from '../chatgpt/chatgpt.js';
import { createEmbedForAskCommand } from './discord_helpers.js';

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

    if (question.toLowerCase() == "reset") {
        Conversations.resetConversation(user.id)
        const embed = createEmbedForAskCommand(user, question, "Who are you ?")
        await interaction.reply({ embeds: [embed] })
        return;
    }

    try {
        await interaction.deferReply()
        askQuestion(question, async (content) => {
            const embed = createEmbedForAskCommand(user, question, content)
            interaction.editReply({ embeds: [embed] })
            let stableDiffusionPrompt = content.slice(0, Math.min(content.length, 200))
            stableDiffusion.generate(stableDiffusionPrompt, (result) => {
                const results = result.results
                if (!results || results.length == 0) {
                    return;
                }
                let data = result.results[0].split(",")[1]
                const buffer = Buffer.from(data, "base64")
                let attachment = new AttachmentBuilder(buffer, { name: "result0.jpg" })
                embed.setImage("attachment://result0.jpg")
                interaction.editReply({ embeds: [embed], files: [attachment] })
            })
        }, { conversationInfo })
    } catch (e) {
        console.error(e)
    }
}

export async function handle_interaction_image(interaction) {
    const prompt = interaction.options.getString("prompt")
    try {
        await interaction.deferReply()
        stableDiffusion.generate(prompt, async (result) => {
            if (result.error) {
                await interaction.editReply({ content: "error..." })
                return;
            }
            try {
                const attachments = []
                for (let i = 0; i < result.results.length; i++) {
                    let data = result.results[i].split(",")[1]
                    const buffer = Buffer.from(data, "base64")
                    let attachment = new AttachmentBuilder(buffer, { name: "result0.jpg" })
                    attachments.push(attachment)
                }
                await interaction.editReply({ content: "done...", files: attachments })
            } catch (e) {
                await interaction.editReply({ content: "error..." })
            }

        })
    } catch (e) {
        console.error(e)
    }
}