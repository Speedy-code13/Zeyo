import Command from "../classes/Command.js";
import { Permissions} from 'discord.js'
import RrMessageModel from "../models/RrMessageModel.js";

class Rr extends Command{
    async run(message){
        await this.useGuildLang(message.guild)

        if(!await this.isAdministrator(message)) return
        await this.addReactionRole(message)
    }

   async addReactionRole(message)
    {
        let args = this.formatArgs(message) 

        if(!this.areValid(args, 5)){ this.sendEmbed(message, 'rr_desc', 'rr_help'); return}

        var channel =  this.getChannelFromArg(args[1])

        if(channel == undefined) {   this.sendEmbed(message, 'invalid_channel', 'error'); return}

        var roleMessage = await this.getMessageFromArg(args[2], channel)
    
        if(roleMessage === undefined) { this.sendEmbed(message, 'invalid_message_id', 'error'); return}

        var role = this.getRoleFromArg(args[3], message)

        if(role == null) { this.sendEmbed(message, 'invalid_role', 'error'); return}
 
        var emoji = args[4]

        try {roleMessage.react(emoji)}

        catch {this.sendEmbed(message, 'invalid_emoji', 'error'); return}

        if(args[0] === 'add')
            await this.saveReactionRole(message.guild.id, message.channel.id, roleMessage.id, emoji, role.id, message)

        if(args[0] === 'remove')
         await this.removeReactionRole(emoji, role.id, message)

    }
    async removeReactionRole(messageId, emojiId, message)
    {
        const query = { message_id: messageId }
        let rrMessageModel = await RrMessageModel.findOne(query)

        if(!rrMessageModel || !rrMessageModel.has(role_emoji))
        {
            this.sendEmbed(message, 'rr_remove_fail', 'success' )
            return
        }

        rrMessageModel.role_emoji.delete(emojiId)
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
    
            this.sendEmbed(message, 'rr_success', 'success')
        }
        catch(err)
        {
            console.log(err)
        }

    }
}

export default Rr