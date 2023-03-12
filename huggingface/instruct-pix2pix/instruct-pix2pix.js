import huggingface_ws from "../huggingface_ws.js"

const API_URL = "wss://timbrooks-instruct-pix2pix.hf.space/queue/join"

function remix(image, prompt, cb) {
    const userData = [
        image,
        prompt,
        50,
        "Randomize Seed",
        22892,
        "Fix CFG",
        7.5,
        1.5
    ]

    huggingface_ws.request(API_URL, userData, (res) => {
        if (res.error) {
            cb({
                error: true
            })
        } else {
            const image = res.results[3]
            cb({
                error: false,
                image
            })
        }
    }, { fn_index: 1 })
}

export default {
    remix
}