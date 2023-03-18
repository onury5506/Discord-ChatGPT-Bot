export default async function Moderations(input) {
    let res = await fetch("https://api.openai.com/v1/moderations",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({input})
        })
    res = await res.json()
    return res.results[0].flagged
}