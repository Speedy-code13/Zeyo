import Event from "../classes/Event.js";
import addRoleToUser from "../functions/addRoleToUser.js";

class GuildMemberAdd extends Event{
 
    async run(member){
        const guildSettings = await this.client.getGuildSettings(member.guild)

        guildSettings.auto_roles.forEach((timeToTakeOff, roleId) => {
            const role = member.guild.roles.resolve(roleId)
          
            if(!addRoleToUser(member, this.client, role, member.guild))
            {
                guildSettings.auto_roles.delete(roleId)
                guildSettings.save()
                return
            }
        });
    }
}

export default GuildMemberAdd