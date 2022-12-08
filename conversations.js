const conversationMap = {}
const conversationTimeLimit = 300000 // 5 minutes

function getConversation(userid){
    let conversation = {
        conversationId:undefined,
        parentMessageId:undefined
    }
    
    if(conversationMap[userid]){
        conversation = conversationMap[userid]
    }else{
        conversationMap[userid] = conversation
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

cleanUnactiveConversations()

export default {
    getConversation,
    resetConversation
}