import Command from "../classes/Command.js";
import { Permissions} from 'discord.js'
import isUserAdministrator from "../functions/isUserAdministrator.js";

class Links extends Command{
    async run(guildSettings, message)
    {        
        const cmdArgs = this.formatArgs(message)
        
        if(!await isUserAdministrator(message, this.sendEmbed)) return
        
        if(!this.areValid(cmdArgs, 2)) {this.sendEmbed(message, 'links_desc', 'links_help'); return}
        
        const subCmd = cmdArgs[0].toLowerCase()

        if(subCmd.toLowerCase()  == 'default') {await this.subCmdWhitelist(guildSettings, message, cmdArgs); return}
        if(subCmd.toLowerCase()  == 'off') {await this.subCmdOff(guildSettings, message, cmdArgs); return}
        if(subCmd.toLowerCase()  ==  'on') {await this.subCmdOn(guildSettings, message, cmdArgs); return}

        this.sendEmbed(message, 'links_desc', 'links_help');
    }

    async subCmdOff(guildSettings, message, args)
    {
       if(await this.handleLinksGlobalRule(message, guildSettings, true, args)) return

       await this.handleLinksLocalRule(message, guildSettings, true, args)
    }
    async subCmdOn(guildSettings, message, args)
    {
        if(await this.handleLinksGlobalRule(message, guildSettings, false, args)) return
      
        await this.handleLinksLocalRule(message, guildSettings, false, args)
    }
    async subCmdWhitelist(guildSettings, message, args)
    {
         
    }
    
    async handleLinksGlobalRule(message, guildSettings, rule, args)
    {
        if(args[1].toLowerCase() == 'default')
        {
            guildSettings.links_disabled_everywhere = rule
            await guildSettings.save()
            this.sendEmbed(message, 'links_default_success', 'success')
            return true
        }
        return false
    }

    async handleLinksLocalRule(message, guildSettings, rule, args)
    {
        const channel = this.getChannelFromArg(args[1])
        if(channel == undefined) {this.sendEmbed(message, 'invalid_channel', 'error'); return}
        if(guildSettings.channel_links == undefined) guildSettings.channel_links = new Map()

        if(rule == true)
        {
            if(guildSettings.channel_links[channel.id] == "off") {this.sendEmbed(message, 'links_off_channel_fail', 'error'); return}
            guildSettings.channel_links.set(channel.id, "off")

            await guildSettings.save()

            this.sendEmbed(message, 'links_off_channel_success', 'success')

            return
        }

        if(!guildSettings.channel_links[channel.id] == "on") {this.sendEmbed(message, 'links_on_channel_fail', 'error'); return}
        guildSettings.channel_links.set(channel.id, "on")

        await guildSettings.save()
        this.sendEmbed(message, 'links_on_channel_success', 'success')

    }

}

export default Links