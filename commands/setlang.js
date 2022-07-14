import Command from "../classes/Command.js";
import { Permissions} from 'discord.js'


class SetLang extends Command{
    async run(message)
    {
        var guildSettings = await this.client.getGuildSettings(message.guild)
        this.lang = guildSettings.lang

        if(!guildSettings) return
        
        var cmdArgs = this.formatArgs(message)
        
        if(!await this.isAdministrator(message)) return

        if(!this.areValid(cmdArgs, 1) || !this.client.languages.has(cmdArgs[0])) {this.sendEmbed(message, 'setlang_desc', 'setlang_help'); return}

        guildSettings.lang = cmdArgs[0]
        
        await guildSettings.save()

        this.sendEmbed(message, 'setlang_success', 'success')
    }
}

export default SetLang