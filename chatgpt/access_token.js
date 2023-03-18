import OpenAITokenGen from "aikey";

export async function getAccessToken(){
    const generator = new OpenAITokenGen();
    let res = await generator.login(process.env.OPENAI_EMAIL, process.env.OPENAI_PASSWORD)

    return res.accessToken
}
