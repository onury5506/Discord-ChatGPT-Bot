import { EmbedBuilder, AttachmentBuilder } from 'discord.js'

import stableDiffusion from '../stablediffusion/stableDiffusion.js';

export const MAX_RESPONSE_CHUNK_LENGTH = 1500

export function createEmbedForAskCommand(user, prompt, response) {

    if (prompt.length >= 250) {
        prompt = prompt.slice(0, 250) + "..."
    }

    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setAuthor({ name: user.username })
        .setTitle(prompt)
        .setDescription(response.slice(0, Math.min(response.length, 4096)))

    if (response.length > 4096) {
        response = response.slice(4096, response.length)
        for (let i = 0; i < 10 && response.length > 0; i++) {
            embed.addFields({
                name: "",
                value: response.slice(0, Math.min(response.length, 1024))
            })
            response = response.slice(Math.min(response.length, 1024), response.length)
        }
    }

    return embed
}

export async function splitAndSendResponse(resp, user) {
    let tryCount = 3;
    while (resp.length > 0 && tryCount > 0) {
        try {
            let end = Math.min(MAX_RESPONSE_CHUNK_LENGTH, resp.length)
            await user.send(resp.slice(0, end))
            resp = resp.slice(end, resp.length)
        } catch (e) {
            tryCount--
            console.error("splitAndSendResponse Error : " + e + " | Counter " + tryCount)
        }
    }

    if (tryCount <= 0) {
        throw "Failed to send dm."
    }
}

export async function generateInteractionReply(interaction, user, question, content) {
    if (process.env.USE_EMBED.toLowerCase() == "true") {
        //embed
        const embed = createEmbedForAskCommand(user, question, content)
        await interaction.editReply({ embeds: [embed] })
        let stableDiffusionPrompt = content.slice(0, Math.min(content.length, 200))
        stableDiffusion.generate(stableDiffusionPrompt, async (result) => {
            const results = result.results
            if (!results || results.length == 0) {
                return;
            }
            let data = result.results[0].split(",")[1]
            const buffer = Buffer.from(data, "base64")
            let attachment = new AttachmentBuilder(buffer, { name: "result0.jpg" })
            embed.setImage("attachment://result0.jpg")
            await interaction.editReply({ embeds: [embed], files: [attachment] })
        })
    } else {
        //normal message
        if (content.length >= MAX_RESPONSE_CHUNK_LENGTH) {
            const attachment = new AttachmentBuilder(Buffer.from(content, 'utf-8'), { name: 'response.txt' });
            await interaction.editReply({ files: [attachment] })
        } else {
            await interaction.editReply({ content })
        }
    }
}