import RrMessageModel from "../models/RrMessageModel.js";

export default async function onReaction(reaction, user, added)
{
    if(user.bot) return
    if(!reaction.message.guild) return
    if(reaction.partial) await reaction.fetch()
    if (reaction.message.partial) await reaction.message.fetch();

    const query = {message_id: reaction.message.id}
    const rrMessage = await RrMessageModel.findOne(query)
     
    if(!rrMessage || !rrMessage.role_emoji.has(reaction.emoji.name)) return
    let role = rrMessage.role_emoji.get(reaction.emoji.name)
    
    if(added)
    {
        await reaction.message.guild.members.cache.get(user.id).roles.add(role)
        return
    }

    await reaction.message.guild.members.cache.get(user.id).roles.remove(role)
}