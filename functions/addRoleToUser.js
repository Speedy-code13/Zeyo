export default function addRoleToUser(member, client, role, guild)
{
    const highestRolePositionOfBot = guild.members.resolve(client.user).roles.highest.position

    if(role == undefined || role.position >= highestRolePositionOfBot) return false
    try{
        member.roles.add(role)
        return true
    }
    catch(e){
        console.log(e)
        return false
    }
}