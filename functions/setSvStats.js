import getSvStats from "./getSvStats.js"

export default async function setSvStats(client, guild_settings)
{
    const guild = client.guilds.cache.get(guild_settings.guild_id)
    const channel = client.channels.cache.get(guild_settings.stats_channel_id)

    if(guild == undefined || channel == undefined) 
    {
        disableSvStats(client, guild_settings)
        return false
    }

    channel.setName(await getSvStats(guild))
    return true
}

async function disableSvStats(client, guild_settings)
{
    guild_settings.stats_channel_id = undefined

    const thisIntervalId = client.statsIntervals.get(guild_settings)
    clearInterval(thisIntervalId)

    guild_settings.save()
}

