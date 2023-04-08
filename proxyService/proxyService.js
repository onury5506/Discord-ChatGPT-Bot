import proxyCheck from 'proxy-check'
import { getProxies } from './freeProxyList.js';

export async function getProxy() {
    let found = false
    return new Promise(async (res, rej) => {
        let proxyListToCheck = await getProxies()

        async function checkProxy() {
            if (found) {
                return;
            }
            if (proxyListToCheck.length == 0) {
                return rej("no proxy found")
            }
            let proxy = proxyListToCheck.splice(Math.floor(Math.random() * proxyListToCheck.length), 1)[0]
            try {
                await proxyCheck(`${proxy.ip}:${proxy.port}`)
                found = true
                res(proxy)
            } catch (e) {
                checkProxy()
            }
        }

        for (let i = 0; i < 10; i++) {
            checkProxy()
        }

    })
}