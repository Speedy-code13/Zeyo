import mongoose from "mongoose";

const guildSettingsSchema = new mongoose.Schema({
    guild_id : {type: String, required: true},
    lang : {type: String, required: true, default:"en"},
    stats_channel_id : String,
    links_disabled_everywhere : {type:Boolean, default: false},
    disabled_links_channels: [
        {
            type: String
        }
    ]
})

export default mongoose.model("Guild setting", guildSettingsSchema)