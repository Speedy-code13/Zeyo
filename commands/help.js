import Command from "../classes/Command.js";

class Help extends Command{
    async run(guildSettings, message)
    {
        this.sendEmbed(message, 'greeting', 'help')
    }
}

export default Help