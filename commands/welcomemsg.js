import Command from "../classes/Command.js";
import isUserAdministrator from "../functions/isUserAdministrator.js"

class WelcomeMsg extends Command{
    async run(guildSettings, message)
    {
        if(!await isUserAdministrator(message, true)) return

        const args = this.formatArgs(message)

        if(args[0]?.toLowerCase() == 'off') {await this.subCmdOff(message, guildSettings); return}
        if(args[0]?.toLowerCase()  == 'on') {await this.subCmdOn(message, guildSettings, args); return}

        this.sendEmbed(message, 'welcomemsg_desc', 'welcomemsg_help'); return
    }

    async subCmdOff(message, guildSettings)
    {
        if(!guildSettings.welcome_channel_id) {this.sendEmbed(message, 'welcomemsg_off_fail', 'error'); return}

        guildSettings.welcome_channel_id = null

        await guildSettings.save()
        this.sendEmbed(message, 'welcomemsg_off_success', 'success')
    }
    async subCmdOn(message, guildSettings, args)
    {
        if(args[1] == null) {this.sendEmbed(message, 'welcomemsg_desc', 'welcomemsg_help'); return}

        const channel = await this.getChannelFromArg(args[1])

        if(channel == null) {   this.sendEmbed(message, 'invalid_channel', 'error'); return}

        guildSettings.welcome_channel_id = channel.id

        await guildSettings.save()

        this.sendEmbed(message, 'welcomemsg_on_success', 'success')
    }
}

export default WelcomeMsg