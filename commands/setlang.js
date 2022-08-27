import Command from "../classes/Command.js";
import { Permissions} from 'discord.js'
import isUserAdministrator from "../functions/isUserAdministrator.js";



class SetLang extends Command{
    async run(guildSettings, message)
    {
        if(!await isUserAdministrator(message, true)) return
        
        var cmdArgs = this.formatArgs(message)
        

        if(!this.areValid(cmdArgs, 1) || !this.client.languages.has(cmdArgs[0])) {this.sendEmbed(message, 'setlang_desc', 'setlang_help'); return}

        guildSettings.lang = cmdArgs[0]
        
        await guildSettings.save()

        this.sendEmbed(message, 'setlang_success', 'success')
    }
}

export default SetLang