import path from "path"
import { fileURLToPath} from "url"
import fs from "fs"
import { Client, Collection, MessageEmbed } from "discord.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))                      

function getfiles(directory)
{
    return fs.readdirSync(directory).filter((file) => file.endsWith(".js"))
}


class Bot extends Client {
    constructor(args)
    {
        super(args)
        
        this.prefix = args.prefix
        this.commands = new Collection()
        this.events = new Collection()
        this.languages = new Map()
        this.embeds = new Map()
        this.defaultLang = "en"

        this.initEmbeds()
    }

    async start(token) 
    {
        await super.login(token)
    }

    loadEvents()
    {
        getfiles(`${this, __dirname}/../events/`).forEach(async (eventFileName) =>
        {
            const eventName = eventFileName.split(".js")[0]
            const Event = (await import(`../events/${eventFileName}`)).default
            const event = new Event(this, eventName)
            event.startListener()
            this.events.set(eventName, event)
        })
    }

    loadCommands()
    {
        getfiles(`${this, __dirname}/../commands/`).forEach(async (commandFileName) =>
        {
            const commandName = commandFileName.split(".js")[0]
            const Command = (await import(`../commands/${commandFileName}`)).default
            const command = new Command(this, commandFileName)
            this.commands.set(commandName, command)
        })
    }
    loadLanguages()
    {
        getfiles(`${this, __dirname}/../languages/`).forEach(async (languageFileName) =>
        {
            const languageName = languageFileName.substring(5, languageFileName.length - 3)
            const language = (await import(`../languages/${languageFileName}`)).default
            this.languages.set(languageName, language)
        })
    }

    getCommand(commandName)
    {
        return this.commands.get(commandName.split(" ")[0].toLowerCase())
    }

    initEmbeds()
    {
        this.embeds.set('error', string => {
            let embed = new MessageEmbed()
            .setColor('RED')
            .setDescription( '😑  ' + string)
            return embed
        })
        this.embeds.set('success', string => {
            let embed = new MessageEmbed()
            .setColor('GREEN')
            .setDescription( '😎  ' + string)
            return embed
        })

        this.embeds.set('setlang_help', description =>{
            const args = {
                description: description,
                usage: `${this.prefix}setlang [language]{fr, en}`,
                example: `${this.prefix}setlang en`,
                commandName : 'setlang'
            }
            return this.helpEmbed(args)
        })

        this.embeds.set('rr_help', description => {
            const args = {
                description:description,
                usage: `${this.prefix}rr [channel] [message id] [role] [emoji]`,
                example: `${this.prefix}rr #general 992092550179594360 @cowboy 🤠`,
                commandName : 'rr'
            }
            return this.helpEmbed(args)
        })

        this.embeds.set('rrd_help', description => {
            const args = {
                description:description,
                usage: `${this.prefix}rr [message id]`,
                example: `${this.prefix}rrd 992092550179594360`,
                commandName : 'rrd'
            }
            return this.helpEmbed(args)
        })
    }

    helpEmbed(args)
    {
        var embed = new MessageEmbed()
        .setColor('BLUE')
        .setTitle('Command: ' + this.prefix + args.commandName)
        .setDescription(`**Description:** ${args.description}`)
        .addFields([
            {
                name: 'Usage:',
                value : args.usage    
            },
            {
                name: 'Example:',
                value: args.example
            }

            ]
        )
        return embed
    }
}

export default Bot