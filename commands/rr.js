import Command from "../classes/Command.js";
import { Permissions} from 'discord.js'
import RrMessageModel from "../models/RrMessageModel.js";

class Rr extends Command{
    async run(message){
        await this.useGuildLang(message)
        const userMember = await message.guild.members.fetch(message.author)
        if(!userMember.permissions.has(Permissions.FLAGS.ADMINISTRATOR)){
            this.sendEmbed(message, 'missing_permission', 'error')
            return
        }
        this.addReactionRole(message)
    }

   async addReactionRole(message)
    {
        let args = this.formatArgs(message) 

        if(!this.areValid(args, 4)){ this.sendEmbed(message, 'rr_desc', 'rr_help'); return}

        var channel =  this.getChannelFromArg(args[0])

        if(channel == undefined) {   this.sendEmbed(message, 'invalid_channel', 'error'); return}

        var roleMessage = await this.getMessageFromArg(args[1], channel)
    
        if(roleMessage === undefined) { this.sendEmbed(message, 'invalid_message_id', 'error'); return}

        var role = this.getRoleFromArg(args[2], message)

        if(role == null) { this.sendEmbed(message, 'invalid_role', 'error'); return}
 
        var emoji = args[3]

        try {roleMessage.react(emoji)}

        catch {this.sendEmbed(message, 'invalid_emoji', 'error'); return}

        await this.saveReactionRole(message.guild.id, message.channel.id, roleMessage.id, emoji, role.id, message)
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