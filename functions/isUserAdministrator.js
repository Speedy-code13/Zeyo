import { Guild, Permissions} from 'discord.js'
import sendEmbed from './sendEmbed.js'

export default async function isUserAdministrator(message, notifyUser)
{
    const userMember = await message.guild.members.fetch(message.author)
    if(!userMember.permissions.has(Permissions.FLAGS.ADMINISTRATOR)){
        if(notifyUser) sendEmbed(message, 'missing_permission', 'error')
        return false
    }

    return true
}