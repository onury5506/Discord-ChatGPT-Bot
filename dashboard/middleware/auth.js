import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../dasboard.js";

export default function auth(req,res,next){
    let cookie = req.cookies.auth
    if (!cookie) {
        return res.sendStatus(403)
    }

    try {
        jwt.verify(cookie, JWT_SECRET);
        next()
    } catch (e) {
        res.sendStatus(403)
    }
}