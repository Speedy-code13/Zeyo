import Event from "../classes/Event.js";
import onReaction from "../functions/onReaction.js";

class MessageReactionRemove extends Event{

    async run(reaction, user){
        await onReaction(this.client, reaction, user, false)
    }

}

export default MessageReactionRemove