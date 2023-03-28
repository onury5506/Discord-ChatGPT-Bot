import fs from "fs/promises"
const PATH = "./configFile/config.json"
let config = {
    "OPENAI_MODEL":"gpt-3.5-turbo",
    "MAX_TOKEN":1000,
    "ENABLE_DIRECT_MESSAGES":false,
    "CONVERSATION_START_PROMPT":"",
    "USE_EMBED":true
}

load()

function get(key){
    return config[key]
}

function set(key,value){
    config[key] = value
}

function save(){
    fs.writeFile(PATH,JSON.stringify(config)).then(()=>{
        console.log("Config saved!")
    }).catch((err)=>{
        console.error("Config save error! : ",err)
    })
}

function load(){
    
    fs.readFile(PATH).then((data)=>{
        try{
            data = data.toString()
            config = JSON.parse(data)
            console.log(new Date()+"   ---    Config loaded")
        }catch(e){
            console.error("Config file corrupted! : ",e)
        }
    }).catch(()=>{
        save()
    })
}

export default {
    save,
    load,
    set,
    get
}