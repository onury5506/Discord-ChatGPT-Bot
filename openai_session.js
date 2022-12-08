import puppeteer from 'puppeteer'

const USER_AGENT = 'Mozilla/5.0 (Macintosh Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'

const OPENAI_URLS = {
    LOGIN: "https://chat.openai.com/auth/login"
}

const SELECTORS = {
    login_button_selector: "#__next > div > div > div.flex.flex-row.gap-3 > button:nth-child(1)",
    email_input_selector: "#username",
    button_login_id: "._button-login-id",
    button_login_password: "._button-login-password",
    password_input_selector: "#password",
}

function wait(t) {
    return new Promise((res) => {
        setTimeout(res, t)
    })
}

const options = {
    nodejs: {
        headless: true
    },
    docker: {
        headless: true,
        executablePath: '/usr/bin/chromium-browser',
        args: [
            '--no-sandbox',
            '--disable-gpu',
        ]
    }
}

async function getSession(email, password) {

    if (!email || !password) {
        throw "empty email or password!"
    }

    const browser = await puppeteer.launch(process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD ? options.docker : options.nodejs)
    const page = await browser.newPage()
    await page.setUserAgent(USER_AGENT)

    try {
        await page.goto(OPENAI_URLS.LOGIN,{timeout:120000})

        await wait(500)
        await page.waitForSelector(SELECTORS.login_button_selector)
        await page.click(SELECTORS.login_button_selector)

        await page.waitForNavigation({ waitUntil: 'networkidle2' }) // wait page load
        await wait(500)

        await page.type(SELECTORS.email_input_selector, email, { delay: 100 })

        await page.waitForSelector(SELECTORS.button_login_id)
        await page.click(SELECTORS.button_login_id)

        await wait(500)

        await page.type(SELECTORS.password_input_selector, password, { delay: 100 })
        await page.waitForSelector(SELECTORS.button_login_password)
        await page.click(SELECTORS.button_login_password)

        await page.waitForNavigation({ waitUntil: 'networkidle2' }) // wait page load
        await wait(1000)

        const cookies = await page.cookies()
        const session_cookie = cookies.filter((cookie) => cookie.name == "__Secure-next-auth.session-token")[0]

        if (!session_cookie || !session_cookie.value) {
            throw "session not found!"
        }

        return session_cookie.value
    } catch (e) {
        throw e
    } finally {
        browser.close()
    }


}

export default {
    getSession
}