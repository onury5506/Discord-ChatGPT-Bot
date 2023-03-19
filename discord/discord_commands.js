import { REST, Routes } from 'discord.js'

import stableDiffusion from '../huggingface/stablediffusion/stableDiffusion.js';
import instructPix2pix from '../huggingface/instruct-pix2pix/instruct-pix2pix.js';
import { askQuestion } from '../chatgpt/chatgpt.js';
import { generateInteractionReply, createEmbedsForImageCommand, createEmbedForRemixCommand } from './discord_helpers.js';

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
    {
        name: 'remix',
        description: 'Remix',
        options: [
            {
                name: "user",
                description: "user",
                type: 3,
                required: true
            },
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
    const question = interaction.options.getString("question")
    await interaction.deferReply()

    try {
        askQuestion(question, async (content) => {
            generateInteractionReply(interaction, user, question, content)
        })
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
                await interaction.editReply({ content: "error..." }).catch(() => { })
                return;
            }

            try {
                let embeds = createEmbedsForImageCommand(user, prompt, result.results)
                await interaction.editReply(embeds).catch(() => { })
            } catch (e) {
                console.log(e)
                await interaction.editReply({ content: "error..." }).catch(() => { })
            }

        })
    } catch (e) {
        console.error(e)
    }
}

export async function handle_interaction_remix(interaction, client) {
    await interaction.deferReply()

    const user = interaction.user
    const prompt = interaction.options.getString("prompt")
    let user_remix_id = interaction.options.getString("user")
    const regex = /^<@(\d+)>$/

    user_remix_id = regex.exec(user_remix_id)

    if (!user_remix_id) {
        return;
    }

    user_remix_id = user_remix_id[1]

    try {
        const user_remix = await client.users.fetch(user_remix_id)
        let pp_url = user_remix.displayAvatarURL()
        pp_url = pp_url.split(".")
        pp_url[pp_url.length - 1] = "jpg"
        pp_url = pp_url.join(".")
        
        const pp = await fetch(pp_url)
        const pp_blob = await pp.blob()
        const pp_buffer = Buffer.from(await pp_blob.arrayBuffer())
        const pp_base64 = "data:image/jpg;base64," + pp_buffer.toString("base64")
        
        instructPix2pix.remix(pp_base64, prompt, async (res) => {
            if (res.error) {
                await interaction.editReply({ content: "error..." }).catch(() => { })
                return;
            }
            
            let embed = createEmbedForRemixCommand(
                user,
                user_remix,
                prompt,
                res.image
            )

            await interaction.editReply({
                content:interaction.options.getString("user"),
                ...embed
            }).catch(() => { })
        })


    } catch (e) {
        console.error(e)
    }
}