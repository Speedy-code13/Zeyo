import { GuildStickerManager } from "discord.js";
import Command from "../classes/Command.js";
import getMsFromConvention from "../functions/getMsFromConvention.js";
import GuildSettingsModel from "../models/GuildSettingsModel.js";
import isUserAdministrator from "../functions/isUserAdministrator.js";

class Autor extends Command{
    async run(guildSettings, message)
    {
        if(!await isUserAdministrator(message, true)) return

        const args = this.formatArgs(message)

        if(args[0]?.toLowerCase() == 'removeall'){ this.subCmdRemoveAll(args, guildSettings, message); return }

        if(!this.areValid(args, 2)) {  this.sendEmbed(message, 'autor_desc', 'autor_help'); return }

        const role = this.getRoleFromArg(args[1], message)
        if(role == null) { this.sendEmbed(message, 'invalid_role', 'error'); return}

        if(args[0].toLowerCase()  == 'add'){ this.subCmdAdd(role, args, guildSettings, message); return }
        if(args[0].toLowerCase()  == 'remove'){ this.subCmdRemove(role, args, guildSettings, message); return }
        
        
        this.sendEmbed(message, 'autor_desc', 'autor_help')
    }

    async subCmdAdd(role, args, guildSettings, message)
    {
        if(guildSettings.auto_roles.has(role.id)) {  this.sendEmbed(message, 'autor_add_fail', 'error'); return }

        const timeForRoleToBeTakenOff = getMsFromConvention(args[2])
        
        const highestRolePositionOfBot = message.guild.members.resolve(this.client.user).roles.highest.position
        if(role.position >= highestRolePositionOfBot) {this.sendEmbed(message, 'role_not_accessible', 'error'); return}

        guildSettings.auto_roles.set(role.id, timeForRoleToBeTakenOff)
        if(!timeForRoleToBeTakenOff && args[2] != null) { this.sendEmbed(message, 'invalid_time', 'error'); return }
        await guildSettings.save()

        this.sendEmbed(message, 'autor_add_success', 'success');
    }
    async subCmdRemove(role, args, guildSettings, message)
    {
        if(!guildSettings.auto_roles.has(role.id)){  this.sendEmbed(message, 'autor_remove_fail', 'error'); return }

        guildSettings.auto_roles.delete(role.id)
        await guildSettings.save()

        this.sendEmbed(message, 'autor_remove_success', 'success');

    }
    async subCmdRemoveAll(args, guildSettings, message)
    {
        if(guildSettings.auto_roles.size == 0){ this.sendEmbed(message, 'autor_removeall_fail', 'error'); return }

        guildSettings.auto_roles.clear()
        await guildSettings.save()

        this.sendEmbed(message, 'autor_removeall_success', 'success');
    }
}

export default Autor