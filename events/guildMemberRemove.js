import onGuildMemberUpdate from "../functions/onGuildMemberUpdate.js"
import Event from "../classes/Event.js";

class GuildMemberRemove extends Event{
    async run(member)
    {
        onGuildMemberUpdate(member, this.client)
    }
}

export default GuildMemberRemove