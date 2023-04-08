import replicate from "../replicate.js";

const replicateInfo = {
    user: "cjwbw",
    model: "damo-text-to-video",
    version: "1e205ea73084bd17a0a3b43396e49ba0d6bc2e754e9283b2df49fad2dcf95755"
}


export default function damoTextToVideo(prompt) {
    const data = {
        inputs: {
            prompt,
            "fps": 8,
            "num_frames": 40,
            "num_inference_steps": 50
        }
    }

    return replicate(replicateInfo.user,replicateInfo.model,replicateInfo.version,data)
}