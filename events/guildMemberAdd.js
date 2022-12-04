import Event from "../classes/Event.js";
import addRoleToUser from "../functions/addRoleToUser.js";
import removeRoleFromUser from "../functions/removeRoleFromUser.js";
import { MessageEmbed } from "discord.js";
import { TextChannel } from 'discord.js';

class GuildMemberAdd extends Event{
 
    async run(member){
        const guildSettings = await this.client.getGuildSettings(member.guild)
        this.handleAutoRole(member, guildSettings)
        this.handleWelcomeMessage(member, guildSettings)
    }

    async handleAutoRole(member, guildSettings)
    {
        guildSettings.auto_roles.forEach((timeToTakeOff, roleId) => {
            const role = member.guild.roles.resolve(roleId)
          
            if(!addRoleToUser(member, this.client, role, member.guild))
            {
                guildSettings.auto_roles.delete(roleId)
                guildSettings.save()
                return
            }
            setTimeout(removeRoleFromUser, parseInt(timeToTakeOff), member, this.client, role, member.guild)
        });
    }
    
    async handleWelcomeMessage(member, guildSettings)
    {
        if(guildSettings.welcome_channel_id == null) return
        const channel = await this.client.channels.fetch(guildSettings.welcome_channel_id)

        if(channel == null)
        {
            guildSettings.welcome_channel_id = null
            guildSettings.save()
            return
        }
        channel.send({embeds:[await this.getWelcomeEmbed(member)]})
    }

    async getWelcomeEmbed(member)
    {
        const userCreationString = `<t:${parseInt(member.user.createdAt.getTime() / 1000)}:R>`
        const today = new Date()
        const date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()
        const userPicUrl = member.user.displayAvatarURL({dynamic: true})
        const embed = new MessageEmbed()
        .setColor('0x36b616')
        .setTitle(`Welcome, ${member.user.tag} to ${member.guild.name}!`)
        .addFields([
            {
                name: `⏱ Account Created`,
                value : userCreationString, 
                inline: true
            },
            {
                name: `📈 Member count`,
                value : member.guild.members.cache.filter(member => !member.user.bot).size.toString(),
                inline : true
            }
            ]
        )
        .setFooter({text: date})
        .setThumbnail(userPicUrl)
        return embed
    }
}

export default GuildMemberAdd