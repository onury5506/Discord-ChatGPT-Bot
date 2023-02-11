import { EmbedBuilder } from 'discord.js'

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