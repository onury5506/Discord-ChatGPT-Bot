import WebSocket from 'ws';

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

function request(API_URL,userData, callback,opts={}, tryCount=5) {
    const client = new WebSocket(API_URL);
    const hash = generateHash()

    let tmr = setTimeout(() => {
        client.close()
        callback({
            error: true
        })
    }, 10 * 60 * 1000);

    client.on("open", () => {
        
    })

    client.on("error",(err)=>{
        
        callback({
            error:true,
        })
    })

    client.on("message", (message) => {
        let msg = JSON.parse("" + message)
        
        if (msg.msg == "send_hash") {
            client.send(JSON.stringify(hash))
        } else if (msg.msg == "send_data") {
            let data = {
                data: userData,
                ...hash,
                ...opts
            }
            client.send(JSON.stringify(data))
        } else if (msg.msg == "process_completed") {
            clearTimeout(tmr)
            try{
                const results = msg.output.data
                callback({
                    error:false,
                    results
                })
            }catch(e){
                callback({
                    error:true,
                })
            }
            
        }else if(msg.msg == "queue_full"){
            if(tryCount <= 0){
                callback({
                    error:true,
                })
            }else{
                setTimeout(()=>{
                    request(API_URL,userData,callback,opts,tryCount-1)
                },5000)
            }
        }

    })
}

export default {
    request
}