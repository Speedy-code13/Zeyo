import getSvStats from "./getSvStats.js"

export default async function onGuildMemberUpdate(member, client)
{
    let guild = await client.getGuildSettings(member.guild)

    if(guild === null || guild.stats_channel_id === undefined) return

    let channel = client.channels.cache.get(guild.stats_channel_id)

    if(channel === undefined) return

    channel.setName(await getSvStats(member.guild))
}

