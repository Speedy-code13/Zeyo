export default async function getSvStats(guild)
{
    let realMembers = 0
    let onlineMembers = 0
    let offlineMembers = 0

    let allMembers = await guild.members.fetch()
    allMembers.forEach(member => {
        if(!member.user.bot){
            realMembers++

            if(member.presence.status === "offline") offlineMembers++
            else onlineMembers++
        }  
    }); 

    return `👥: ${realMembers} 🟢: ${onlineMembers} 🔴: ${offlineMembers}`
}