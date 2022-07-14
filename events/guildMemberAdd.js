import onGuildMemberUpdate from "../functions/onGuildMemberUpdate.js"
import Event from "../classes/Event.js";

class GuildMemberAdd extends Event{
    async run(member)
    {
        onGuildMemberUpdate(member, this.client)
    }
}

export default GuildMemberAdd