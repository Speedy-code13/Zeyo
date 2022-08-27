import Event from "../classes/Event.js";
import onReaction from "../functions/onReaction.js";

class MessageReactionAdd extends Event{

    async run(reaction, user){
        await onReaction(this.client, reaction, user, true)
    }

}

export default MessageReactionAdd