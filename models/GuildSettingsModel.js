import mongoose from "mongoose";

const guildSettingsSchema = new mongoose.Schema({
    guild_id : {type: String, required: true},
    lang : {type: String, required: true, default:"fr"},
    stats_channel_id : String
})

export default mongoose.model("Guild setting", guildSettingsSchema)