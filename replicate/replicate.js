import HttpsProxyAgent from 'https-proxy-agent';
import fetch from 'node-fetch';
import { getProxy } from '../proxyService/proxyService.js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
const wait = (t) => new Promise((res) => setTimeout(res, t))

export default async function replicate(user, model, version, data) {
    let start;
    let proxy;
    let proxyAgent;
    let c = 0
    for (let i = 0; i < 50; i++) {
        try {
            if (!proxy || c <= 0) {
                proxy = await getProxy().catch(()=>{})

                if (!proxy) {
                    await wait(1000)
                    continue
                }

                proxyAgent = new HttpsProxyAgent.HttpsProxyAgent({
                    host: proxy.ip,
                    port: proxy.port,
                    timeout: 2500
                })

                c = 5
            }

            c--

            start = await fetch(`https://replicate.com/api/models/${user}/${model}/versions/${version}/predictions`, {
                "headers": {
                    "accept": "application/json",
                    "content-type": "application/json",
                },
                "referrer": `https://replicate.com/${user}/${model}`,
                "body": JSON.stringify(data),
                "method": "POST",
                agent: proxyAgent,

            })
        } catch (e) {
        }

        if (start && (start.status == 200 || start.status == 201)) {
            break;
        }

        await wait(1000)
    }

    if (start?.status != 200 && start?.status != 201) {
        return {
            error: true,
            errorMsg:"proxy not found"
        }
    }
    start = await start.json().catch(e => { })
    const uuid = start?.uuid

    if (!uuid) {
        return {
            error: true,
            errorMsg:"uuid not found"
        }
    }
    let run = true

    let timer = setTimeout(() => {
        run=false
    }, 1000 * 60)

    while (run) {
        await wait(1000)
        try {
            let result = await fetch(`https://replicate.com/api/models/${user}/${model}/versions/${version}/predictions/${uuid}`, {
                "referrer": "https://replicate.com/cjwbw/damo-text-to-video",
                "headers": {
                    "accept": "application/json",
                    "content-type": "application/json"
                },
                "referrer": `https://replicate.com/${user}/${model}`,
                agent: proxyAgent
            })
            result = await result.json()
            
            clearTimeout(timer)
            timer = setTimeout(() => {
                run=false
            }, 1000 * 60)

            if (result.prediction.status == "succeeded") {
                clearTimeout(timer)
                return {
                    error: false,
                    output: result.prediction.output
                }
            }
        } catch (e) {
        }
    }

    return {
        error: true,
        errorMsg: "timeout"
    }
}