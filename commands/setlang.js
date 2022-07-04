import Command from "../classes/Command.js";
import { Permissions} from 'discord.js'


class SetLang extends Command{
    async run(message)
    {
        var guildSettings = await this.getGuildSettings(message)
        this.lang = guildSettings.lang
        var cmdArgs = this.formatArgs(message)

        const userMember = await message.guild.members.fetch(message.author)
        if(!userMember.permissions.has(Permissions.FLAGS.ADMINISTRATOR)){
            this.sendEmbed(message, 'missing_permission', 'error')
            return
        }
        

        if(!this.areValid(cmdArgs, 1) || !this.client.languages.has(cmdArgs[0])) {this.sendEmbed(message, 'setlang_desc', 'setlang_help'); return}

        guildSettings.lang = cmdArgs[0]
        
        await guildSettings.save()

        this.sendEmbed(message, 'setlang_success', 'success')
    }
}

export default SetLang