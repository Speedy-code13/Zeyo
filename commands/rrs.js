import RrMessageModel from "../models/RrMessageModel.js";
import Command from "../classes/Command.js";
import GuildSettingsModel from "../models/GuildSettingsModel.js";
import isUserAdministrator from "../functions/isUserAdministrator.js";
import isNumber from "../functions/isNumber.js";


class Rrs extends Command{
    async run(guildSettings, message)
    {
        if(!await isUserAdministrator(message, true)) return
        
        const args = this.formatArgs(message)

        if(!this.areValid(args, 3)) {  this.sendEmbed(message, 'rrs_desc', 'rrs_help'); return}

        const query = {message_id: args[1]}

        if(args[0].toLowerCase() != 'emojilimit') {  this.sendEmbed(message, 'rrs_desc', 'rrs_help'); return}

        const rrMessage = await RrMessageModel.findOne(query)

        if(!rrMessage) {this.sendEmbed(message, 'invalid_message_id', 'error'); return}

        if(!isNumber(args[2]) || args[2] < 1 || args[2] > 99) {  this.sendEmbed(message, 'emojilimit_wrong_number', 'error'); return} 
        rrMessage.role_limit = args[2]
        await rrMessage.save()
        this.sendEmbed(message, 'rrs_emojilimit_success', 'success')

    }
}
export default Rrs