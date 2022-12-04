import Command from "../classes/Command.js";

class Ping extends Command{
    async run(guildSettings, message)
    {
        message.channel.send("pong");
    }   
}

export default Ping