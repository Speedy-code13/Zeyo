import Event from "../classes/Event.js";
import GuildSettingsModel from "../models/GuildSettingsModel.js";

class GuildDelete extends Event{
    async run(guild)
    {
        GuildSettingsModel.deleteMany({guild_id:guild.id}, error => {if(error) console.log(error)})
    }
}

export default GuildDelete