import { Router } from "express";
import jwt from "jsonwebtoken";

import config from '../../config/config.js'
import { JWT_SECRET } from "../dasboard.js";
import auth from "../middleware/auth.js";

const API_ROUTER = Router()

API_ROUTER.post("/login", (req, res) => {
    if (process.env.DASHBOARD_USERNAME == req.body.username &&
        process.env.DASHBOARD_PASSWORD == req.body.password) {

        jwt.sign({
            data: 'foobar'
        }, JWT_SECRET, { expiresIn: '1h' },(err,token)=>{

            res.cookie("auth", token, {
                maxAge: 1000 * 60 * 60,
                httpOnly: true
            })
            res.redirect("/dashboard.html")
        });
        return;
    }
    res.redirect("/")
})

API_ROUTER.get("/checkauth",auth, (req, res) => {
    res.sendStatus(200)
})

API_ROUTER.get("/config",auth,(req,res)=>{
    res.send(config.getFullConfig())
})

API_ROUTER.post("/config",auth,(req,res)=>{
    let data = req.body
    let keys = Object.keys(data)

    if(data.MAX_TOKEN != undefined){
        data.MAX_TOKEN = parseInt(data.MAX_TOKEN)
        if(!data.MAX_TOKEN){
            data.MAX_TOKEN = 1000
        }
    }

    keys.forEach((key)=>{
        config.set(key,data[key])
    })
    config.save()
    res.sendStatus(200)
})

API_ROUTER.get("/oauthurl",auth,(req,res)=>{
    res.send({
        url:`https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=2147486720&scope=bot`
    })
})

export default API_ROUTER