const conversationMap = {}
let conversationTimeLimit = parseInt(process.env.CONVERSATION_MEMORY_SECONDS)*1000

if(!conversationTimeLimit || conversationTimeLimit <= 0){
    conversationTimeLimit = 300000
}

function getConversation(userid){
    let conversation = {
        conversationId:undefined,
        parentMessageId:undefined
    }
    
    if(conversationMap[userid]){
        conversation = conversationMap[userid]
        conversation.newConversation = false
    }else{
        conversationMap[userid] = conversation
        conversation.newConversation = true
    }

    conversation.lastSeen = Date.now()
    
    return conversation
}

function resetConversation(userid){
    delete conversationMap[userid]
}

function cleanUnactiveConversations(){
    try{
        const users = Object.keys(conversationMap)
        users.forEach((user)=>{
            const lastSeen = conversationMap[user].lastSeen
            if(Date.now()-lastSeen-conversationTimeLimit >= 0){
                delete conversationMap[user]
            }
        })
    }catch(e){

    }finally{
        setTimeout(cleanUnactiveConversations,60000)
    }
}

if(process.env.CONVERSATION_MEMORY_SECONDS.toLocaleLowerCase() != "false"){
    cleanUnactiveConversations()
}

export default {
    getConversation,
    resetConversation
}