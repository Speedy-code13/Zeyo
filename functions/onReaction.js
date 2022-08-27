import RrMessageModel from "../models/RrMessageModel.js";
import addRoleToUser from "./addRoleToUser.js";
import removeRoleFromUser from "./removeRoleFromUser.js"


export default async function onReaction(client, reaction, user, added)
{
    if(user.bot) return
    if(!reaction.message.guild) return
    if(reaction.partial) await reaction.fetch()
    if (reaction.message.partial) await reaction.message.fetch();

    const query = {message_id: reaction.message.id}
    const rrMessage = await RrMessageModel.findOne(query)
     
    if(!rrMessage || !rrMessage.role_emoji.has(reaction.emoji.name)) return
    const role = rrMessage.role_emoji.get(reaction.emoji.name)
    
    if(added)
    {
        addRoleToUser(user, client, role, reaction.message.guild)
        return
    }

    removeRoleFromUser(user, client, role, reaction.message.guild)
}