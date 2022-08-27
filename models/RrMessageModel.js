import mongoose from "mongoose";

const rrMessageSchema = new mongoose.Schema({
    guild_id : {type: String, required: true},
    channel_id : {type: String, required: true},
    message_id : {type: String, required: true},
    role_limit : {type: Number, default: null},
    role_emoji : {
        type: Map,
        of: String
    }
})

export default mongoose.model('Role Reaction Message', rrMessageSchema)