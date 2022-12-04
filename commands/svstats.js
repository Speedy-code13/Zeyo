import Command from "../classes/Command.js";
import createStatsInterval from "../functions/createStatsInterval.js";
import setSvStats from "../functions/setSvStats.js";
import getSvStats from "../functions/getSvStats.js";
import isUserAdministrator from "../functions/isUserAdministrator.js";


class SvStats extends Command{
    async run(guildSettings, message)
    {
        if(!await isUserAdministrator(message, true)) return

        const args = this.formatArgs(message)

        if(args[0] === 'off') {await this.subCmdOff(message, guildSettings); return}
        if(args[0] === 'on') {await this.subCmdOn(message, guildSettings); return}

        this.sendEmbed(message, 'svstats_desc', 'svstats_help'); return
    }

    async subCmdOff(message, guildSettings)
    {
        const channel = this.client.channels.cache.get(guildSettings.stats_channel_id)
        
        if(channel === undefined){this.sendEmbed(message, 'svstats_off_fail', 'error'); return} 
        
        const category = channel.parent

        this.stopUpdatingStats(guildSettings)

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

    stopUpdatingStats(guildSettings)
    {
        const thisIntervalId = this.client.statsIntervals.get(guildSettings.guild_id)
        clearInterval(thisIntervalId)
    }

    async subCmdOn(message, guildSettings)
    {
        if(guildSettings.stats_channel_id != undefined){this.sendEmbed(message, 'svstats_on_fail', 'error'); return}
        
        var channel = await this.createStatsChannel(message, guildSettings)
        
        if(channel == undefined) {this.sendEmbed(message, 'bot_missing_permission', 'error'); return }
        
        guildSettings.stats_channel_id = channel.id

        await guildSettings.save()

        const interval = createStatsInterval(this.client, guildSettings)
        this.client.statsIntervals.set(guildSettings.guild_id, interval)
        this.sendEmbed(message, 'svstats_on_success', 'success')
    }

    async createStatsChannel(message, guildSettings)
    {
        try{
            const channelManager = message.guild.channels

            const everyoneRole = message.guild.roles.cache.find(r => r.name === '@everyone');

            const svStatsCategory = await channelManager.create('─═☆ S E R V E R - S T A T S ☆═─', 
            {
                type:'GUILD_CATEGORY',
                position: 0,
                permissionsOverwrites: [{
                    id: everyoneRole.id,
                    deny: ['CONNECT']
                  }]
            })
            const channelName = await getSvStats(message.guild)
    
            const channel = await channelManager.create(channelName, {

                type: 'GUILD_VOICE',
                parent: svStatsCategory, 
                permissionsOverwrites: [{
                    id: everyoneRole.id,
                    deny: ['CONNECT']
                  }]
            })
            return channel
        }
        catch(error)
        {
            console.error(error)
            return undefined
        }
    }   
    
}

export default SvStats