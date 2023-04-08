import * as cheerio from 'cheerio';

let mem = {
    proxies:[],
    date: 0
}

export async function getProxies(opts = {
    params: "port=&type%5B%5D=http&type%5B%5D=https&speed%5B%5D=3&up_time=50",
    bannedCountries: ["China","Colombia"]
}) {

    let bannedCountriesMap = {}
    for(let i=0;i<opts.bannedCountries.length;i++){
        bannedCountriesMap[opts.bannedCountries[i]] = true
    }

    if(Date.now()-mem.date < 1000*60*5){
        return mem.proxies
    }

    let maxPage = 1;
    let proxies = []
    for (let page = 1; page <= maxPage; page++) {
        let html = await fetch(`https://www.free-proxy-list.com/?search=1&page=${page}&${opts.params}`)
        html = await html.text()
        const $ = cheerio.load(html)
        const rows = $(".proxy-list > tbody > tr")
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i]
            const columns = $(row).find("td")
            const proxy = {
                ip: $(columns[0]).text(),
                port: $(columns[2]).text(),
                country: $(columns[3])?.text()?.trim(),
                speedDownload:  parseInt($(columns[5]).text()),
                connectTimes: parseFloat($(columns[6]).text()),
                upTime: parseInt($(columns[7]).text()) || 0,
                type: $(columns[8])?.text()?.trim(),
                anon: $(columns[9])?.text()?.trim(),
                lastUpdate: $(columns[10])?.text()?.trim()
            }

            if(bannedCountriesMap[proxy.country]){
                continue;
            }

            proxies.push(proxy)
        }

        const pager = $(".content-list-pager")[0]
        const pageButtons = $(pager).find("li")

        maxPage = Math.max(parseInt($(pageButtons[pageButtons.length-3]).text()),maxPage)

    }

    mem.proxies = proxies
    mem.date = Date.now()

    return proxies
}