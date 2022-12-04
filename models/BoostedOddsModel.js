import mongoose from "mongoose";

const boostedOddsModel = new mongoose.Schema({
    guild_id : {type: String, required: true},
    channel_id : {type: String, default:null},
    role_for_website : {
        type: Map,
        of: String
    }
})

export default mongoose.model('Boosted Odds Model', boostedOddsModel)