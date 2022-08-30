import mongoose from "mongoose";

const guildSettingsSchema = new mongoose.Schema({
    guild_id : {type: String, required: true},
    lang : {type: String, required: true, default:"en"},
    stats_channel_id : String,
    links_disabled_everywhere : {type:Boolean, default: false},
    welcome_channel_id : {type:String, default:null},
    channel_links: {
        type: Map,
        of: String,
        default : new Map()
    },
    auto_roles: {
        type: Map,
        of: String,
        required: true
    }
    
})

export default mongoose.model("Guild setting", guildSettingsSchema)