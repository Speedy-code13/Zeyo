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
     
    const emoji = reaction.emoji.id ? `<:${reaction.emoji.name}:${reaction.emoji.id}>` : reaction.emoji.name

    if(!rrMessage || !rrMessage.role_emoji.has(emoji)) return
    
    const roleId = rrMessage.role_emoji.get(emoji)
    const role = reaction.message.guild.roles.resolve(roleId)
    
    if(added)
    {
        if(!rrMessage.role_limit)
        {
            addRoleToUser(reaction.message.guild.members.cache.get(user.id), client, role, reaction.message.guild)
            return
        }
        const member = reaction.message.guild.members.resolve(user)  

        let rolesOfUser = calcuateReactionsOfMemberOnMessage(member, rrMessage)


        if(rolesOfUser >= rrMessage.role_limit)
        {
            reaction.users.remove(user.id)
            return
        }
        addRoleToUser(reaction.message.guild.members.cache.get(user.id), client, role, reaction.message.guild)

    }

    removeRoleFromUser(reaction.message.guild.members.cache.get(user.id), client, role, reaction.message.guild)
}

function calcuateReactionsOfMemberOnMessage(member, message)
{
    var rolesOfUser = 0

    for(const roleId of message.role_emoji.values())
    {
       for(const userRoleId of member.roles.cache.keys())
       {
            if(roleId == userRoleId) {rolesOfUser++; continue}
       }
    }

    return rolesOfUser
}