import { GuildEmoji } from "discord.js";
import Event from "../classes/Event.js";
import hasLink from "../functions/hasLink.js";
import isUserAdministrator from "../functions/isUserAdministrator.js";

class MessageCreate extends Event{
    async run(message){
        if(message.author.bot) return

        const guildSettings = await this.client.getGuildSettings(message.guild)
        this.lang = guildSettings.lang

        await this.handleModeration(message, guildSettings)

        this.handleCommands(message, guildSettings)
    }

    async handleModeration(message, guildSettings)
    {
        if(!hasLink(message.content) || await isUserAdministrator(message)) return

        if(guildSettings.disabled_links_channels.includes(message.channel.id) || guildSettings.links_disabled_everywhere)
        {
            message.delete()
            .then(msg => message.channel.send(this.client.getLocale(this.lang, 'links_not_allowed'), `ass`))
            .catch(() => {this.sendEmbed(message, 'missing_permission', 'error')})
            return
        }
    }

    handleCommands(message, guildSettings)
    {
        if(!message.content.startsWith(this.client.prefix)) return

        const removedPrefixMsg = message.content.replace(this.client.prefix, "")

        const command = this.client.getCommand(removedPrefixMsg)

        if(command)
        {
            command._run(guildSettings, message);
            command.lang = guildSettings.lang
        } 

            
    }
}

export default MessageCreate