import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import API_ROUTER from "./routes/api.js";

const app = express()

app.use(express.static("./dashboard/public"))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

let init = false
export const JWT_SECRET = generateSecret()
function generateSecret(){
    let chars = "qwertyuopasdfghjklizxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789"
    let secret = ""
    for(let i=0;i<32;i++){
        secret += chars[Math.floor(Math.random()*chars.length)]
    }
    return "secret" //secret
}

app.use("/api",API_ROUTER)

app.get("/logout",(req,res)=>{
    res.cookie("auth","")
    res.redirect("/")
})

export function initDashboard(){
    if(init){
        return;
    }

    app.listen(8080,()=>{
        console.log(new Date() + " Dashboard listening on port 8080")
    })
}