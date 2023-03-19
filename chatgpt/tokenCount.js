import { encode } from "gpt-3-encoder"

export default function tokenCount(text){
    return encode(text).length
}