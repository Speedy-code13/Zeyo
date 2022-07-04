import mongoose from "mongoose";

const guildSettingsSchema = new mongoose.Schema({
    guild_id : {type: String, required: true},
    lang : {type: String, required: true, default:"fr"}
})

export default mongoose.model("Guild setting", guildSettingsSchema)