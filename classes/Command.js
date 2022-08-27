import { MessageEmbed, Permissions } from "discord.js"
import GuildSettingsModel from "../models/GuildSettingsModel.js";
import sendEmbed from "../functions/sendEmbed.js";

class Command{
    constructor(client, name)
    {
        this.client = client
        this.name = name
        this.language = "en"
    }
    async _run(guildSettings, ...args)
    {
        if(!args[0].guild.members.resolve(this.client.user).permissions.has("ADMINISTRATOR")) { sendEmbed(args[0], 'bot_missing_permission', 'error'); return}
        try{
            await this.run(guildSettings, ...args)
        }
        catch(err){
            console.log(err)
        }
    }
    areValid(args, number)
    {
        if(args.length == 0) return false
        for(let i = 0; i < number; i++){
            if(args[i] == undefined && args[i] == null) return false
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
        if(arg.length != 23) return null
        var roleId = arg.substring(3, arg.length - 1)
        return  message.guild.roles.resolve(roleId)
    }
    getLocale(string, ...vars)
    {
        return this.client.getLocale(this.language,string, ...vars);
    }
    
    sendEmbed(...args){  sendEmbed( this.lang, this.client, ...args) } 
   
    async useGuildLang(message)
    {
        var guildSettings = await this.client.getGuildSettings(message)
        this.lang = guildSettings.lang
    }

}

export default Command