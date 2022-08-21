import setSvStats from "./setSvStats.js"

export default function createStatsInterval(client, guild_settings)
{
    const timer = setInterval(async () =>{
        await setSvStats(client, guild_settings)
    }, 1000 * 60 * 5)

    return timer
}