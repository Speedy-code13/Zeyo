import RrMessageModel from "../models/RrMessageModel.js";
import Command from "../classes/Command.js";
import { Guild, Permissions} from 'discord.js'
import GuildSettingsModel from "../models/GuildSettingsModel.js";

class Rrd extends Command{
    async run(message)
    {
        var guildSettings = await this.getGuildSettings(message)
        this.lang = guildSettings.lang
        if(!guildSettings) return

        const userMember = await message.guild.members.fetch(message.author)
        if(!userMember.permissions.has(Permissions.FLAGS.ADMINISTRATOR)){
            this.sendEmbed(message, 'missing_permission', 'error')

            return
        }
        let args = this.formatArgs(message)

        if(!this.areValid(args, 1)) {  this.sendEmbed(message, 'rrd_success', 'rrd_help'); return}

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