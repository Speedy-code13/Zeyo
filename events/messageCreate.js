import Event from "../classes/Event.js";

class MessageCreate extends Event{
    async run(message){
        if(!message.content.startsWith(this.client.prefix) || message.author.bot) return

        let removedPrefixMsg = message.content.replace(this.client.prefix, "")

        let command = this.client.getCommand(removedPrefixMsg)

        if(command) command.run(message);
    }
}

export default MessageCreate