import WebSocket from 'ws';

const API_URL = "wss://stabilityai-stable-diffusion.hf.space/queue/join"//"wss://runwayml-stable-diffusion-v1-5.hf.space/queue/join"

function generateHash() {
    const chars = "qwertyuopasdfghjklizxcvbnm0123456789"
    let hash = ""
    for (let i = 0; i < 11; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)]
    }
    return {
        session_hash: hash,
        fn_index: 2
    }
}

function generate(prompt, cb, tryCount=5) {
    const client = new WebSocket(API_URL);
    const hash = generateHash()

    let tmr = setTimeout(() => {
        client.close()
        cb({
            error: true
        })
    }, 120000);

    client.on("open", () => {
        //console.log("ws connected!")
    })

    client.on("error",(err)=>{
        console.log(err)
        cb({
            error:true,
        })
    })

    client.on("message", (message) => {
        let msg = JSON.parse("" + message)
        //console.log(msg)
        if (msg.msg == "send_hash") {
            client.send(JSON.stringify(hash))
        } else if (msg.msg == "send_data") {
            let data = {
                data: [prompt,"",9],
                ...hash
            }
            client.send(JSON.stringify(data))
        } else if (msg.msg == "process_completed") {
            clearTimeout(tmr)
            try{
                const results = msg.output.data[0]
                cb({
                    error:false,
                    results
                })
            }catch(e){
                cb({
                    error:true,
                })
            }
            
        }else if(msg.msg == "queue_full"){
            if(tryCount <= 0){
                cb({
                    error:true,
                })
            }else{
                setTimeout(()=>{
                    generate(prompt,cb,tryCount-1)
                },5000)
            }
        }

    })
}

export default {
    generate
}