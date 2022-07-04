import mongoose from "mongoose";

const rrMessageSchema = new mongoose.Schema({
    guild_id : {type: String, required: true},
    channel_id : {type: String, required: true},
    message_id : {type: String, required: true},
    unique_role : {type: Boolean, required: true, default: false },
    role_emoji : {
        type: Map,
        of: String
        }
})

export default mongoose.model('Role Reaction Message', rrMessageSchema)