import Event from "../classes/Event.js";
import GuildSettingsModel from "../models/GuildSettingsModel.js";

class GuildCreate extends Event{
    async run(guild)
    {
        GuildSettingsModel.create({guild_id:guild.id, auto_roles: new Map()}, error => {if(error) console.log(error)})
    }
}

export default GuildCreate