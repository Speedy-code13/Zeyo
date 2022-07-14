import path from "path"
import { fileURLToPath} from "url"
import fs from "fs"
import GuildSettingsModel from "../models/GuildSettingsModel.js";
import {Client, Collection, MessageEmbed } from "discord.js"
import initEmbeds from "../functions/initEmbeds.js";

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

        initEmbeds(this)
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
    getLocale(language, string, ...vars)
    {
        let locale = this.languages.get(language)[string];

        let count = 0;
        locale = locale.replace(/%VAR%/g, () => vars[count] !== null ? vars[count] : "%VAR%");

         return locale;
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

    async getGuildSettings(guild)
    {
        let guildSettings = await GuildSettingsModel.findOne({guild_id: guild.id}).catch(async (error) => { 
            if(error)
            {
                guildSettings = await GuildSettingsModel.create({guild_id:guild.id}, error => {if(error) console.log(error)})
                console.log(error)
                return null
            }
        })

        return guildSettings
    }
}

export default Bot