import Moderations from './moderations.js'
import tokenCount from './tokenCount.js'

const MAX_TOKENS = parseInt(process.env.CONVERSATION_START_PROMPT) ? parseInt(process.env.CONVERSATION_START_PROMPT) : 1000

const chatGPT = {
    sendMessage: null,
}

chatGPT.sendMessage = async function (prompt) {

    const tokens = tokenCount(prompt)

    if (tokens > MAX_TOKENS / 2) {
        return `Please limit your prompt to a maximum of ${parseInt(MAX_TOKENS / 2)} tokens. Thank you.`
    }

    const messages = [
        {
            role: "system",
            content: process.env.CONVERSATION_START_PROMPT.toLowerCase() != "false" ?
                process.env.CONVERSATION_START_PROMPT.toLowerCase() :
                "You are helpful assistant"
        },
        {
            role: "user",
            content: prompt
        }
    ]

    const data = {
        model: process.env.OPENAI_MODEL,
        messages,
        max_tokens: MAX_TOKENS - tokens
    }

    let res = await fetch("https://api.openai.com/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify(data)
        })
    res = await res.json()

    return {
        text: res.choices[0].message.content.trim(),
        usage: res.usage,
        tokens
    }
}

export async function askQuestion(question, cb, opts = {}) {
    try {
        let redFlag = await Moderations(question)
        if (redFlag) {
            cb("Your prompt contains harmful content!")
            return;
        }
    } catch (e) {
        cb(e)
        return;
    }

    try {
        const response = await chatGPT.sendMessage(question)

        if (!response.text) {
            throw "no response!"
        }
        cb(response.text)
    } catch (e) {
        cb("Oppss, something went wrong! (Error)")
        console.error("chat error : " + e)
    }
}