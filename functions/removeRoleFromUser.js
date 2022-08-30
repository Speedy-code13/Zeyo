export default function addRoleToUser(member, client, role, guild)
{
    const highestRolePositionOfBot = guild.members.resolve(client.user).roles.highest.position

    if(role.id == null || role.position >= highestRolePositionOfBot || !member.roles.cache.has(role.id)) return false
    try{
        member.roles.remove(role)
        return true
    }
    catch(e){
        console.log(e)
        return false
    }
}