import { Guild } from "discord.js";
import Command from "../classes/Command.js";
import isUserAdministrator from "../functions/isUserAdministrator.js";
import BoostedOddsModel from "../models/BoostedOddsModel.js";
import createOrGetThread from "../functions/createOrGetThread.js";
import getParsedWebsiteName from "../functions/getParsedWebsiteName.js"
class Bodds extends Command{

    async run(guildSettings, message)
    {
        if(!await isUserAdministrator(message, true)) return
        
        const args = this.formatArgs(message)

        if(args[0]?.toLowerCase() == 'off'){ this.subCmdOff(message); return }
        if(args[0]?.toLowerCase() == 'on'){ this.subCmdOn(args, message); return }

        if(!this.areValid(args, 3)) {  this.sendEmbed(message, 'bodds_desc', 'bodds_help'); return }

        if(args[0]?.toLowerCase() == 'notifyrole'){ this.subCmdNotifyRole(args, message); return }
        this.sendEmbed(message, 'bodds_desc', 'bodds_help')
    }

    async subCmdOff(message)
    {
        const boddsSettings = await this.getBoddsSettings(message.guild)
        if(boddsSettings.channel_id == null) {this.sendEmbed(message, 'bodds_off_fail', 'error'); return}
        boddsSettings.channel_id = null
        await boddsSettings.save()
        this.sendEmbed(message, 'bodds_off_success', 'success');
    }
    async subCmdOn(args, message)
    {
        const boddsSettings = await this.getBoddsSettings(message.guild)

        if(args[1] == null){  this.sendEmbed(message, 'bodds_desc', 'bodds_help'); return }
        const channel = await this.getChannelFromArg(args[1])
        if(channel == null) {this.sendEmbed(message, 'bodds_on_fail', 'error'); return}
        boddsSettings.channel_id = channel.id
        await boddsSettings.save()
        this.sendEmbed(message, 'bodds_on_success', 'success');
    }

    async subCmdNotifyRole(args, message)
    {
        const boddsSettings =  await this.getBoddsSettings(message.guild)

        const role = this.getRoleFromArg(args[1], message)
        if(role == null) {this.sendEmbed(message, 'invalid_role', 'error'); return}

        const website = args[2]
        const boostedOddsChannel = await this.client.channels.fetch(boddsSettings.channel_id)
        if(boostedOddsChannel == null) {this.sendEmbed(message, 'invalid_channel', 'error'); return;}
        if(website == null || !this.client.webdriver.websites.has(website.toLowerCase())) {this.sendEmbed(message, 'invalid_website', 'error'); return}
        boddsSettings.role_for_website.set(website.toLowerCase(), role.id)

        boddsSettings.save()

        await createOrGetThread(getParsedWebsiteName(website), boostedOddsChannel);
        this.sendEmbed(message, 'bodds_notifyrole_success', 'success');
    }
    async getBoddsSettings(guild)
    {
        var boddsSettings = await BoostedOddsModel.findOne({guild_id: guild.id})
        if(boddsSettings == null)
        {
            const userSchema = {guild_id:guild.id, role_for_website: new Map()}
            boddsSettings = new BoostedOddsModel(userSchema)
            await boddsSettings.save()
        }
        return boddsSettings
    }

}

export default Bodds