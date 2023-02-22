/* 
    @rhaym-tech
    https://github.com/rhaym-tech/AIKey
*/

import makeFetchCookie from "fetch-cookie";
const session = { fetch: makeFetchCookie(fetch) };

export default class OpenAITokenGen {
    constructor() { }

    async login(email, password) {
        return this.#zero()
            .then(this.#one)
            .then(this.#two)
            .then(this.#three)
            .then((state) => this.#four(state, email))
            .then((state) => this.#five(state, email, password))
            .then(this.#six)
            .then(this.#seven);
    }

    async refresh() {
        return this.#seven();
    }

    async logout() {
        // TODO: implement
    }

    async #zero() {
        const response = await session.fetch(
            "https://explorer.api.openai.com/api/auth/csrf"
        );
        const { csrfToken } = await response.json();
        return csrfToken;
    }

    async #one(csrfToken) {
        const response = await session.fetch(
            "https://explorer.api.openai.com/api/auth/signin/auth0?prompt=login",
            {
                method: "POST",
                body: new URLSearchParams({
                    callbackUrl: "/",
                    csrfToken,
                    json: true,
                }),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        const { url } = await response.json();
        return url;
    }

    async #two(url) {
        const response = await session.fetch(url, {
            redirect: "manual",
        });
        return (await response.text()).slice(48);
    }

    async #three(state) {
        const response = await session.fetch(
            `https://auth0.openai.com/u/login/identifier?state=${state}`
        );
        return state;
    }

    async #four(state, username) {
        const response = await session.fetch(
            `https://auth0.openai.com/u/login/identifier?state=${state}`,
            {
                method: "POST",
                body: new URLSearchParams({
                    state,
                    username,
                    "js-available": false,
                    "webauthn-available": true,
                    "is-brave": false,
                    "webauthn-platform-available": true,
                    action: "default",
                }),
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
            }
        );
        return state;
    }

    async #five(state, username, password) {
        const response = await session.fetch(
            `https://auth0.openai.com/u/login/password?state=${state}`,
            {
                method: "POST",
                body: new URLSearchParams({
                    state,
                    username,
                    password,
                    action: "default",
                }),
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
                redirect: "manual",
            }
        );
        return (await response.text()).slice(46);
    }

    async #six(state) {
        await session.fetch(`https://auth0.openai.com/authorize/resume?state=${state}`);
    }

    async #seven() {
        const response = await session.fetch(
            "https://explorer.api.openai.com/api/auth/session"
        );
        const { accessToken } = await response.json();
        return {
            accessToken,
            cookie: response.headers.get("set-cookie").split(";")[0],
        };
    }
}