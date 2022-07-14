import { MessageEmbed, Permissions } from "discord.js"
import GuildSettingsModel from "../models/GuildSettingsModel.js";

class Command{
    constructor(client, name)
    {
        this.client = client
        this.name = name
        this.language = "en"
    }
    areValid(args, number)
    {
        if(args.length === 0) return false
        for(let i = 0; i < number; i++){
            if(args[i] === undefined && args[i] === null) return false
        }
        return true
    }

    formatArgs(message)
    {
        var args = message.content.replace(/\s+/g, ' ').trim().split(" ")
        args.shift()
        return args
    }


   getChannelFromArg(arg)
    {
        return this.client.channels.cache.get(arg.substring(2, arg.length -1))
    }

    async getMessageFromArg(arg, channel)
    {
        try{
            var message = await channel.messages.fetch(arg)
        }
        catch{
            return undefined
        }
        return message
    }

    getRoleFromArg(arg, message)
    {
        var roleId = arg.substring(3, arg.length - 1)
        return  message.guild.roles.resolve(roleId)
    }
    getLocale(string, ...vars)
    {
        return this.client.getLocale(this.language,string, ...vars);
     }

    sendEmbed(message, string, embedType, ...vars)
    {
        message.channel.send({embeds:[this.client.embeds.get(embedType)(this.getLocale(string, vars), this.lang)]})
    }
    
    async useGuildLang(message)
    {
        var guildSettings = await this.client.getGuildSettings(message)
        this.lang = guildSettings.lang
    }

    async isAdministrator(message)
    {
        const userMember = await message.guild.members.fetch(message.author)
        if(!userMember.permissions.has(Permissions.FLAGS.ADMINISTRATOR)){
            this.sendEmbed(message, 'missing_permission', 'error')
            return false
        }

        return true
    }
}

export default Command