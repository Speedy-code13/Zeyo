import { MessageEmbed } from "discord.js"
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
    
   

    async getGuildSettings(message)
    {
        let guildSettings = await GuildSettingsModel.findOne({guild_id: message.guild.id}).catch(error => { 
            if(error)
            {
                guildSettings = await GuildSettingsModel.create({guild_id:guild.id}, error => {if(error) console.log(error)})
                console.log(error)
                return null
            }
        })

        return guildSettings
    }

    getLocale(string, ...vars)
    {
        let locale = this.client.languages.get(this.language)[string];
     
        let count = 0;
        try{
            locale = locale.replace(/%VAR%/g, () => vars[count] !== null ? vars[count] : "%VAR%")
        }
        catch{
            console.log(string)
        }
     
        return locale;
     }

    sendEmbed(message, string, embedType, ...vars)
    {
        message.channel.send({embeds:[this.client.embeds.get(embedType)(this.getLocale(string, vars))]})
    }
    
    async useGuildLang(message)
    {
        var guildSettings = await this.getGuildSettings(message)
        this.lang = guildSettings.lang
    }
}

export default Command