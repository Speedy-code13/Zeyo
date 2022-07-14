import Event from "../classes/Event.js";
import onGuildMemberUpdate from "../functions/onGuildMemberUpdate.js";

class PresenceUpdate extends Event{
 
    async run(oldPresence, newPresence){
        onGuildMemberUpdate(newPresence.member, this.client)
    }

}

export default PresenceUpdate