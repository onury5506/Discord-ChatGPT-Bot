const fields = {
    OPENAI_MODEL: document.getElementById("OPENAI_MODEL"),
    MAX_TOKEN: document.getElementById("MAX_TOKEN"),
    ENABLE_DIRECT_MESSAGES: document.getElementById("ENABLE_DIRECT_MESSAGES"),
    CONVERSATION_START_PROMPT: document.getElementById("CONVERSATION_START_PROMPT"),
    USE_EMBED: document.getElementById("USE_EMBED"),
}
const Success = document.getElementById("notiSuccess");
const Failure = document.getElementById("notiFail");



document.getElementById("save_button").addEventListener("click",saveConfig)

async function getOAuthUrl(){
    let res = await fetch("/api/oauthurl", {
        credentials: "include"
    })

    if (res.status != 200) {
        return
    }

    res = await res.json()
    console.log(res)
    const a = document.getElementById("oauth_discord")
    a.href = res.url
}
getOAuthUrl()

async function loadConfig() {
    let res = await fetch("/api/config", {
        credentials: "include"
    })

    if (res.status != 200) {
        return window.location = "/"
    }

    res = await res.json()

    fields.OPENAI_MODEL.value = res.OPENAI_MODEL
    fields.MAX_TOKEN.value = res.MAX_TOKEN
    fields.ENABLE_DIRECT_MESSAGES.checked = res.ENABLE_DIRECT_MESSAGES
    fields.CONVERSATION_START_PROMPT.value = res.CONVERSATION_START_PROMPT
    fields.USE_EMBED.checked = res.USE_EMBED
}

async function saveConfig() {
    const data = {
        OPENAI_MODEL:fields.OPENAI_MODEL.value,
        MAX_TOKEN: fields.MAX_TOKEN.value,
        ENABLE_DIRECT_MESSAGES: fields.ENABLE_DIRECT_MESSAGES.checked,
        CONVERSATION_START_PROMPT: fields.CONVERSATION_START_PROMPT.value,
        USE_EMBED: fields.USE_EMBED.checked,
    }

    data.MAX_TOKEN = parseInt(data.MAX_TOKEN)

    if(!data.MAX_TOKEN){
        data.MAX_TOKEN = 1000
    }

    let res = await fetch("/api/config", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    })

    if(res.status != 200){
        // Show the notification
        Failure.style.display = "block";

        // Hide the notification after some time (optional)
        setTimeout(() => {
          Failure.style.display = "none";
        }, 5000); // Hide after 5 seconds
        return;
    }
    await loadConfig()
        // Show the notification
        Success.style.display = "block";

        // Hide the notification after some time (optional)
        setTimeout(() => {
          Success.style.display = "none";
        }, 5000); // Hide after 5 seconds
}

loadConfig()