import { GuildEmoji } from "discord.js";
import Event from "../classes/Event.js";
import hasLink from "../functions/hasLink.js";
import isUserAdministrator from "../functions/isUserAdministrator.js";

class MessageCreate extends Event{
    async run(message){
        if(message.author.bot) return

        const guildSettings = await this.client.getGuildSettings(message.guild)
        this.lang = guildSettings.lang

        this.handleModeration(message, guildSettings)

        this.handleCommands(message, guildSettings)
    }

    async handleModeration(message, guildSettings)
    {
        if(!hasLink(message.content) || await isUserAdministrator(message)) return
        if(guildSettings.channel_links == undefined) {guildSettings.channel_links = new Map(); guildSettings.save()}

        if(guildSettings.channel_links.get(message.channel.id) == 'off' || (guildSettings.links_disabled_everywhere && !guildSettings.channel_links.has(message.channel.id)))
        {
            message.delete()
            .catch(() => {this.sendEmbed(message, 'bot_missing_permission', 'error')})
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
            command.lang = guildSettings.lang
            command._run(guildSettings, message);
        } 
    }
}

export default MessageCreate