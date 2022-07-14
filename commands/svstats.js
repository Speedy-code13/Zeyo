import Command from "../classes/Command.js";
import getSvStats from "../functions/getSvStats.js";

class SvStats extends Command{
    async run(message)
    {
        var guildSettings = await this.client.getGuildSettings(message.guild)
        if(!guildSettings) return

        this.lang = guildSettings.lang

        var args = this.formatArgs(message)

        if(!await this.isAdministrator(message)) return

        if(args[0] === 'off') {await this.subCmdOff(message, guildSettings); return}
        if(args[0] === 'on') {await this.subCmdOn(message, guildSettings, args); return}

        this.sendEmbed(message, 'svstats_desc', 'svstats_help'); return
    }

    async subCmdOff(message, guildSettings)
    {
        const channel = this.client.channels.cache.get(guildSettings.stats_channel_id)
        const category = channel.parent
        
        if(channel === undefined){this.sendEmbed(message, 'svstats_off_fail', 'error'); return} 

        guildSettings.stats_channel_id = undefined
        await guildSettings.save()

        try
        {
            await channel.delete()
            await category.delete()
        }
        catch
        {
           this.sendEmbed(message, 'svstats_off_fail', 'error')
           return
        }

      
        this.sendEmbed(message, 'svstats_off_success', 'success')
    }
    async subCmdOn(message, guildSettings)
    {
        if(guildSettings.stats_channel_id !== undefined){this.sendEmbed(message, 'svstats_on_fail', 'error'); return}
        var channel = await this.createStatsChannel(message)

        if(channel === undefined) return

        guildSettings.stats_channel_id = channel.id

        await guildSettings.save()

        this.sendEmbed(message, 'svstats_on_success', 'success')
    }

    async createStatsChannel(message)
    {
        try{
            const channelManager = message.guild.channels

            const svStatsCategory = await channelManager.create('─═☆ S E R V E R - S T A T S ☆═─', 
            {
                type:'GUILD_CATEGORY',
                position: 0
            })
    
            const channelName = await getSvStats(message.guild)
            var channel = await channelManager.create(channelName, {
                type: 'GUILD_VOICE',
                parent: svStatsCategory, 
                permissionsOverwrites: [{
                    id: message.guild.id,
                    deny: ['CONNECT']
                  }]
            })
        }
        catch(error)
        {
            console.error(error)
            this.sendEmbed(message, 'bot_missing_permission', 'error')
        }

        return channel
    }   
    
}

export default SvStats