import RrMessageModel from "../models/RrMessageModel.js";
import Command from "../classes/Command.js";
import GuildSettingsModel from "../models/GuildSettingsModel.js";
import isUserAdministrator from "../functions/isUserAdministrator.js";


class Rrd extends Command{
    async run(guildSettings, message)
    {
        if(!await isUserAdministrator(message, true)) return
        
        const args = this.formatArgs(message)

        if(!this.areValid(args, 1)) {  this.sendEmbed(message, 'rrd_desc', 'rrd_help'); return}

        const query = {message_id: args[0]}

        const rrMessage = await RrMessageModel.findOneAndDelete(query)
        if(!rrMessage) {this.sendEmbed(message, 'invalid_message_id', 'error'); return}

        const channel = this.client.channels.cache.get(rrMessage.channel_id)

        const roleMessage = await this.getMessageFromArg(args[0], channel)

        if(roleMessage === undefined) { this.sendEmbed(message, 'invalid_message_id', 'error'); return}

        roleMessage.reactions.removeAll()

        this.sendEmbed(message, 'rrd_success', 'success')

    }
}
export default Rrd