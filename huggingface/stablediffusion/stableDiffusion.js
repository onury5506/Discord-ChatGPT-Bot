import huggingface_ws from "../huggingface_ws.js"

const API_URL = "wss://stabilityai-stable-diffusion.hf.space/queue/join"

function generate(prompt, cb) {
    const userData = [prompt, "", 9]

    huggingface_ws.request(API_URL, userData, (res) => {
        if (res.error) {
            cb({
                error: true
            })
        } else {
            const results = res.results[0]
            cb({
                error: false,
                results
            })
        }
    })
}

export default {
    generate
}