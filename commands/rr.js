import Command from "../classes/Command.js";
import { Permissions} from 'discord.js'
import RrMessageModel from "../models/RrMessageModel.js";
import isUserAdministrator from "../functions/isUserAdministrator.js";


class Rr extends Command{
    async run(guildSettings, message){
        if(!await isUserAdministrator(message, true)) return
        
        await this.addReactionRole(message)
    }

   async addReactionRole(message)
    {
        const args = this.formatArgs(message) 

        if(!this.areValid(args, 5)){ this.sendEmbed(message, 'rr_desc', 'rr_help'); return}

        const channel = this.getChannelFromArg(args[1])

        if(channel == null) {   this.sendEmbed(message, 'invalid_channel', 'error'); return}

        const roleMessage = await this.getMessageFromArg(args[2], channel)
    
        if(roleMessage == null) { this.sendEmbed(message, 'invalid_message_id', 'error'); return}

        const role = this.getRoleFromArg(args[3], message)

        if(role == null) { this.sendEmbed(message, 'invalid_role', 'error'); return}
 
        const highestRolePositionOfBot = message.guild.members.resolve(this.client.user).roles.highest.position
        if(role.position >= highestRolePositionOfBot) {this.sendEmbed(message,'role_not_accessible', 'error'); return}

        const emoji = args[4]

        try {roleMessage.react(emoji)}

        catch {this.sendEmbed(message, 'invalid_emoji', 'error'); return}

     
        if(args[0].toLowerCase() == 'add')
            await this.saveReactionRole(message.guild.id, channel.id, roleMessage.id, emoji, role.id, message)

        if(args[0].toLowerCase()  == 'remove')
           await this.removeReactionRole(emoji, roleMessage, message)

    }
    async removeReactionRole(emoji, roleMessage, message)
    {
        const query = { message_id: roleMessage.id }
        const rrMessageModel = await RrMessageModel.findOne(query)

        if(!rrMessageModel || !rrMessageModel.role_emoji.has(emoji))
        {
            this.sendEmbed(message, 'rr_remove_fail', 'error')
            return
        }
        roleMessage.reactions.cache.forEach((reaction, reactionId) =>
        {
            if(reaction.emoji.name == emoji){
                reaction.remove()
            }
        })
        rrMessageModel.role_emoji.delete(emoji)
        await rrMessageModel.save()
        this.sendEmbed(message, 'rr_remove_success', 'success' )
    }

    async saveReactionRole(guildId, channelId, messageId, emojiId, roleId, message){
        try{
            const query = { message_id: messageId }
            let rrMessageModel = await RrMessageModel.findOne(query)
            if(rrMessageModel)
            {
                rrMessageModel.role_emoji.set(emojiId, roleId)
    
                await rrMessageModel.save()
            }
            
            else{
                const reactionRoleMessageModel = new RrMessageModel({
                    guild_id: guildId,
                    channel_id: channelId,
                    message_id: messageId,
                })
                reactionRoleMessageModel.role_emoji = new Map()
                reactionRoleMessageModel.role_emoji.set(emojiId, roleId)
                await reactionRoleMessageModel.save()
            }
    
            this.sendEmbed(message, 'rr_add_success', 'success')
        }
        catch(err)
        {
            console.log(err)
        }

    }
}

export default Rr