export default function addRoleToUser(member, client, role, guild)
{
    const highestRolePositionOfBot = guild.members.resolve(client.user).roles.highest.position

    if(role == undefined || role.position >= highestRolePositionOfBot || !member.has(role)) return false
    try{
        member.roles.remove(role)
        return true
    }
    catch(e){
        console.log(e)
        return false
    }
}